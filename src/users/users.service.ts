import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../database/core/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
// ** DTO ** \\
import { CreateUserDto } from './Dto/create-user.dto.ts';
import { LoginUserDto } from './Dto/login-user.dto.ts.js';

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
      });

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
}
