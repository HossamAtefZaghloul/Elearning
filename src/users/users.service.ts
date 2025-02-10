import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './Dto/create-user.dto.ts';
import { User } from '../database/core/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const salt = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
      const user = this.usersRepository.create(userDto);
      console.log(user.password);
      user.password = await bcrypt.hash(user.password, salt);
      console.log(user.password);
      return await this.usersRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
