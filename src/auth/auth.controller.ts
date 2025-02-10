import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/Dto/create-user.dto.ts';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('create/user')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(createUserDto);
      return { message: 'User created successfully', user };
    } catch (error) {
      throw new HttpException(
        { message: 'User creation failed', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
