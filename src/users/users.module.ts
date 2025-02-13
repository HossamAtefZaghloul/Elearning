import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../database/core/user.entity';
import { CoreModule } from 'src/core-module/core-module.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CoreModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
