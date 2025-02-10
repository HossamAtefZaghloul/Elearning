import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../database/core/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
// ** DTO ** \\
import { CreateUserDto } from './Dto/create-user.dto.ts';
import { LoginUserDto } from './Dto/login-user.dto.ts.js';
import { RedisService } from '../redis/redis.service.ts'; // Import Redis Service

config();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
    private redisService: RedisService, // Inject Redis Service
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

  async findUser(
    userDto: LoginUserDto,
    response: Response,
  ): Promise<{ access_token: string; refresh_token: string }> {
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

      const payload = { sub: user.id, username: user.name };

      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      });

      const refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });

      // Store refresh token in HTTP-only cookie
      response.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return { access_token, refresh_token };
    } catch (error) {
      console.error('Error checking user:', error);
      throw new HttpException(
        'Error checking user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(response: Response, token: string): Promise<void> {
    const decoded = this.jwtService.decode(token) as { exp: number };
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    if (expiresIn > 0) {
      await this.redisService.addToBlacklist(token, expiresIn);
    }

    response.clearCookie('refresh_token');
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return await this.redisService.isBlacklisted(token);
  }
}
