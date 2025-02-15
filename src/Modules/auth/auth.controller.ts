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
  async signup(@Body() UserDto: CreateUserDto) {
    try {
      await this.usersService.createUser(UserDto);
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
    } catch (error) {
      throw new HttpException(
        { message: 'Invalid refresh token', error: error.message },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  @Post('logout')
  async logout(@Body() body: { refresh_token: string }) {
    try {
      console.log(body.refresh_token);
      await this.usersService.logout(body.refresh_token);

      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new HttpException(
        { message: 'Invalid refresh token', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
