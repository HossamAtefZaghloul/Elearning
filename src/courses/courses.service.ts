import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCourseDto } from './Dto/create-courses.dto';
import { Course } from '../database/core/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}
  async createCourse(CourseDto: CreateCourseDto) {
    try {
      console.log(CourseDto);
      const course = this.coursesRepository.create(CourseDto);
      await this.coursesRepository.save(course);
      return course;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new InternalServerErrorException('Failed to create course');
    }
  }
  async getCourses(filters: { category?: string }): Promise<Course[]> {
    const query = this.coursesRepository
      .createQueryBuilder('course')
      .select([
        'course.id',
        'course.title',
        'course.description',
        'course.price',
      ]);
    try {
      if (filters.category) {
        query.andWhere('course.category = :category', {
          category: filters.category,
        });
      }

      return query.getMany();
    } catch (error: any) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new InternalServerErrorException('Failed to Fetch courses');
    }
  }
}
