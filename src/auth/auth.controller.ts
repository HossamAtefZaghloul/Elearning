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

  @Post('signup')
  async signup(@Body() UserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(UserDto);
      return user && { message: 'User created successfully //Redirect ...!' };
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
  @Post('login')
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
  @Post('refresh-token') // send refresh-token in req-cookies
  async refreshToken(@Body() body: { refresh_token: string }) {
    try {
      const refreshToken = body.refresh_token;

      const newTokens =
        await this.usersService.handleRefreshToken(refreshToken);

      return {
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token,
        message: 'Token refreshed successfully!',
      };
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
