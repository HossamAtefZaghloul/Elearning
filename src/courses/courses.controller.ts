import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCourseDto } from './Dto/create-courses.dto';
import { CoursesService } from './courses.service';
import { AuthGuard } from '../auth/auth.guard';
import { LoggingInterceptor } from './Interceptor/LoggingInterceptor ';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
import { multerConfig } from '../config/multer.config';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pdf', maxCount: 1 },
        { name: 'video', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  async create(
    @UploadedFiles()
    files: { pdf: Express.Multer.File[]; video: Express.Multer.File[] },

    @Body() courseDto: CreateCourseDto,
  ): Promise<{ message: string }> {
    try {
      courseDto.pdfPath = files.pdf[0]?.path;
      courseDto.videoPath = files.video[0]?.path;

      console.log(courseDto.pdfPath);

      await this.coursesService.createCourse(courseDto);

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
  async getCourses(@Query() filters: { category?: string }) {
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

  @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  @Get(':id')
  async getCoursesById(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await console.log(`Received ID: ${id}`);
      return { message: 'HI' };
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
