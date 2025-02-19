import { Entity, ManyToOne, Column, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity()
@Unique(['student', 'course'])
export class StudentCourse extends BaseEntity {
  @ManyToOne(() => User, (user) => user.studentCourses)
  student: User;

  @ManyToOne(() => Course, (course) => course.studentCourses)
  course: Course;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enrolledAt: Date;
}
