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
import { EmailDto } from 'src/users/Dto/email.dto.ts';

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
      return { message: 'User created successfully //Redirect ...!' };
    } catch (error) {
      throw new HttpException(
        { message: 'User creation failed', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('password-reset')
  async resetPass(@Body() email: EmailDto) {
    try {
      console.log(email);
    } catch (error) {
      throw new HttpException(
        { message: 'Password reset failed', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
