import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCourseDto } from './Dto/create-courses.dto';
import { CoursesService } from './courses.service';
import { AuthGuard } from '../auth/auth.guard';
import { LoggingInterceptor } from './Interceptor/LoggingInterceptor ';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('create')
  async create(
    @Body() CourseDto: CreateCourseDto,
  ): Promise<{ message: string }> {
    try {
      await this.coursesService.createCourse(CourseDto);
      return { message: 'Course created successfully' };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'An unknown error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  @Get()
  async getCourses(@Query() filters: any) {
    try {
      return await this.coursesService.getCourses(filters);
    } catch (error: any) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'An unknown error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
