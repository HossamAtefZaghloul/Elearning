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
  async getCourses(filters: any): Promise<Course[]> {
    const query = this.coursesRepository.createQueryBuilder('course');

    if (filters.category) {
      query.andWhere('course.category = :category', {
        category: filters.category,
      });
    }

    return query.getMany();
  }
}
