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

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'boolean', default: false })
  isPurchased: boolean;

  @Column({ nullable: true })
  pdfPath: string;

  @Column({ nullable: true })
  videoPath: string;

  @OneToMany(() => StudentCourse, (studentCourse) => studentCourse.course)
  studentCourses: StudentCourse[];
}
