import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/database/core/course.entity';
import { StudentCourse } from 'src/database/core/student-course.entity';
import { User } from 'src/database/core/user.entity';
import { Payments } from 'src/database/core/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, User, StudentCourse, Payments])],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
