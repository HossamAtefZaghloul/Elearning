import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from 'src/database/core/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/Modules/auth/auth.module';
import { CoreModule } from 'src/Modules/core-module/core-module.module';
import { StudentCourse } from 'src/database/core/student-course.entity';
import { User } from 'src/database/core/user.entity';
import { RolesGuard } from 'src/Guards/roles.guard';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, User, StudentCourse]),
    AuthModule,
    CoreModule,
    PaymentModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService, RolesGuard],
})
export class CoursesModule {}
