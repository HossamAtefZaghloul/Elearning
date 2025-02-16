import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/database/core/course.entity';
import { Payments, PaymentStatus } from 'src/database/core/payment.entity';
import { StudentCourse } from 'src/database/core/student-course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(Payments)
    private readonly paymentsRepository: Repository<Payments>,
    @InjectRepository(StudentCourse)
    private readonly studentCourseRepository: Repository<StudentCourse>,
  ) {}

  async paymentMethod(userId: string, courseId: string) {
    try {
      console.log(userId, courseId);
      const course = await this.coursesRepository.findOne({
        where: { id: courseId },
        select: ['price'],
      });

      if (course === null) {
        throw new Error('Course not found');
      }

      // mocking payment method here ..

      // then
      const payment = this.paymentsRepository.create({
        student: { id: userId },
        course: { id: courseId },
        price: course.price,
        status: PaymentStatus.COMPLETED,
      });

      await this.paymentsRepository.save(payment);

      const studentCourse = this.studentCourseRepository.create({
        student: { id: userId },
        course: { id: courseId },
      });

      await this.studentCourseRepository.save(studentCourse);

      return studentCourse;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new InternalServerErrorException('Payment Failed');
    }
  }
}
