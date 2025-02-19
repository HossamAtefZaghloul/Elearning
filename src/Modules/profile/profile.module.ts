import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserProfile } from 'src/database/core/entities/user-profile.entity';
import { RolesGuard } from 'src/Guards/roles.guard';
import { AuthModule } from '../auth/auth.module';
import { CoreModule } from '../core-module/core-module.module';
import { User } from 'src/database/core/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile, User]),
    AuthModule,
    CoreModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, RolesGuard],
})
export class ProfileModule {}
