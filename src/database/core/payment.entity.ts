import { Entity, ManyToOne, Column, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Course } from './course.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity()
@Unique(['student', 'course'])
export class Payments extends BaseEntity {
  @ManyToOne(() => User, (user) => user.studentCourses)
  student: User;

  @ManyToOne(() => Course, (course) => course.studentCourses)
  course: Course;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ nullable: true })
  paymentMethod?: string;
}
