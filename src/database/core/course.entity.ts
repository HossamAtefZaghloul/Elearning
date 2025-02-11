import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StudentCourse } from './student-course.entity';

@Entity()
export class Course extends BaseEntity {
  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Price: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  video: string;

  @Column({ nullable: true })
  pdf: string;

  @OneToMany(() => StudentCourse, (studentCourse) => studentCourse.course)
  studentCourses: StudentCourse[];
}
