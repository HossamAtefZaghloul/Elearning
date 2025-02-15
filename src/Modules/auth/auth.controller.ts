import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/Modules/users/Dto/create-user.dto';
import { LoginUserDto } from 'src/Modules/users/Dto/login-user.dto';
import { EmailDto } from 'src/Modules/users/Dto/email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() userDto: CreateUserDto) {
    try {
      await this.usersService.createUser(userDto);
      return { message: 'User created successfully //Redirect ...!' };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        '  User creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('password-reset')
  resetPass(@Body() email: EmailDto) {
    try {
      console.log(email);
    } catch (error: any) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Password reset failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('login')
  async login(@Body() userDto: LoginUserDto) {
    try {
      const accessToken = await this.usersService.handleLogin(userDto);
      return {
        accessToken,
        message: 'login successfully //Redirect ...!',
      };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('refresh-token') // send refresh-token in req-cookies :<
  async refreshToken(@Body() cookies: { refresh_token: string }) {
    try {
      const refreshToken = cookies.refresh_token;

      const newTokens =
        await this.usersService.handleRefreshToken(refreshToken);

      return {
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token,
        message: 'Token refreshed successfully!',
      };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Invalid refresh token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('logout')
  async logout(@Body() body: { refresh_token: string }) {
    try {
      console.log(body.refresh_token);
      await this.usersService.logout(body.refresh_token);

      return { message: 'Logged out successfully' };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Invalid refresh token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
