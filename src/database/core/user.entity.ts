import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StudentCourse } from './student-course.entity';
import { Payments } from './payment.entity';

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  Instructor = 'instructor',
}

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ length: 20 })
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @OneToMany(() => StudentCourse, (studentCourse) => studentCourse.student)
  studentCourses: StudentCourse[];

  @OneToMany(() => Payments, (payments) => payments.student)
  payments: Payments[];

  @Column({ select: false, nullable: true })
  refreshToken?: string;
}
