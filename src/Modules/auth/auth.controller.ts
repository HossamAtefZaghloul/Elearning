import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/Modules/users/Dto/create-user.dto';
import { LoginUserDto } from 'src/Modules/users/Dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  // USER ROUTE: SIGNUP (CREATE ACC)
  @Post('signup')
  async signup(@Body() userDto: CreateUserDto) {
    await this.usersService.createUser(userDto);
    return { message: 'User created successfully //Redirect ...!' };
  }

  // USER ROUTE: SIGNIN (LOG IN)
  @Post('login')
  async login(@Body() userDto: LoginUserDto) {
    const accessToken = await this.usersService.handleLogin(userDto);
    return {
      accessToken,
      message: 'login successfully //Redirect ...!',
    };
  }

  // USER ROUTE: REFRESH TOKEN (ONCE TOKEN EXPIRED)
  @Post('refresh-token') // send refresh-token in req-cookies :<
  async refreshToken(@Body() cookies: { refresh_token: string }) {
    const refreshToken = cookies.refresh_token;
    const newTokens = await this.usersService.handleRefreshToken(refreshToken);

    return {
      accessToken: newTokens.access_token,
      refreshToken: newTokens.refresh_token,
      message: 'Token refreshed successfully!',
    };
  }

  // USER ROUTE: LOG OUT
  @Post('logout')
  async logout(@Body() body: { refresh_token: string }) {
    console.log(body.refresh_token);
    await this.usersService.logout(body.refresh_token);

    return { message: 'Logged out successfully' };
  }
}
