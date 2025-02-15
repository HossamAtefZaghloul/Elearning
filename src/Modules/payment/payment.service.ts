import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/database/core/course.entity';
import { Payments, PaymentStatus } from 'src/database/core/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(Payments)
    private readonly paymentsRepository: Repository<Payments>,
  ) {}

  async paymentMethod(userId: string, courseId: string) {
    try {
      // mocking payment method ????!
      console.log(userId, courseId);
      const course = await this.coursesRepository.findOne({
        where: { id: courseId },
        select: ['price'],
      });

      if (course === null) {
        throw new Error('Course not found');
      }
      const payment = this.paymentsRepository.create({
        student: { id: userId },
        course: { id: courseId },
        price: course.price,
        status: PaymentStatus.COMPLETED,
      });

      return await this.paymentsRepository.save(payment);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new InternalServerErrorException('Payment Failed');
    }
  }
}
