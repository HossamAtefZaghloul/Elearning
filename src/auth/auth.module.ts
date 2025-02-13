import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { CoreModule } from 'src/core-module/core-module.module';
@Module({
  imports: [UsersModule, CoreModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
