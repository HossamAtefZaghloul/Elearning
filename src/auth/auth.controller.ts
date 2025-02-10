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
import { LoginUserDto } from 'src/users/Dto/login-user.dto.ts';
import { EmailDto } from 'src/users/Dto/email.dto.ts';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('auth/signup')
  async signup(@Body() UserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(UserDto);
      return { message: 'User created successfully //Redirect ...!' };
    } catch (error) {
      throw new HttpException(
        { message: 'User creation failed', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('password-reset')
  resetPass(@Body() email: EmailDto) {
    try {
      console.log(email);
    } catch (error) {
      throw new HttpException(
        { message: 'Password reset failed', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Post('auth/login')
  async login(@Body() UserDto: LoginUserDto) {
    try {
      const accessToken = await this.usersService.handleLogin(UserDto);
      return {
        accessToken,
        message: 'login successfully //Redirect ...!',
      };
    } catch (error) {
      throw new HttpException(
        { message: 'Login failed', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
