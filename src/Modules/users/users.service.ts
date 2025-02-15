import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../database/core/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
// ** DTO ** \\
import { CreateUserDto } from './Dto/create-user.dto';
import { LoginUserDto } from './Dto/login-user.dto';

config();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const salt = Number(process.env.BCRYPT_SALT) || 10;
      const user = this.usersRepository.create(userDto);
      user.password = await bcrypt.hash(user.password, salt);
      return await this.usersRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleLogin(
    userDto: LoginUserDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      console.log(userDto);
      const user = await this.findUser(userDto);
      const payload = { sub: user.id, username: user.name };

      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn: '60m',
      });
      const refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });

      const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
      user.refreshToken = hashedRefreshToken;
      await this.usersRepository.save(user);

      return { access_token, refresh_token };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUser(userDto: LoginUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: userDto.email },
        select: ['id', 'email', 'password', 'name', 'role'],
      });
      console.log(user);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isPassValid = await bcrypt.compare(userDto.password, user.password);
      if (!isPassValid) {
        throw new HttpException('Invalid Password', HttpStatus.UNAUTHORIZED);
      }

      return user;
    } catch (error) {
      console.error('Error checking user:', error);
      throw new HttpException(
        'Error checking user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async handleRefreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken);
      console.log('verifyAsync');
      console.log(payload);
      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
        select: ['id', 'name', 'refreshToken'],
      });
      console.log(user);
      if (!user || !user.refreshToken) {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Compare (user: refresh token with) the hashed one in the DB
      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      console.log('isValid :', isValid);
      if (!isValid) {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // generate new access token
      const newAccessToken = await this.jwtService.signAsync(
        { sub: user.id, username: user.name },
        { expiresIn: '60m' },
      );

      console.log('OLD Refresh token:', user.refreshToken);

      // new refresh token
      const newRefreshToken = await this.jwtService.signAsync(
        { sub: user.id, username: user.name },
        { expiresIn: '7d' },
      );

      // Hash the refresh token
      const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

      // update token in the database
      await this.usersRepository.update(user.id, {
        refreshToken: hashedRefreshToken,
      });

      console.log('NEW Refresh token:', newRefreshToken);

      return { access_token: newAccessToken, refresh_token: newRefreshToken };
    } catch (error: any) {
      console.error('Refresh token error:', error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
  async logout(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
        select: ['id', 'name', 'refreshToken'],
      });

      if (!user || !user.refreshToken) {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }
      await this.usersRepository.update(user.id, {
        refreshToken: '',
      });
      console.log('refreshToken:', user.refreshToken);
      return { message: 'Logged out successfully' };
    } catch (error: any) {
      console.log(error);
      throw new HttpException(
        'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
