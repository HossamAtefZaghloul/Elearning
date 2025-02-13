import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StudentCourse } from './student-course.entity';

@Entity()
export class Course extends BaseEntity {
  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({ type: 'decimal' }) // Ensure it's a number type
  price: number;

  @Column({ nullable: true })
  video: string;

  @Column({ nullable: true })
  pdf: string;

  @OneToMany(() => StudentCourse, (studentCourse) => studentCourse.course)
  studentCourses: StudentCourse[];
}
