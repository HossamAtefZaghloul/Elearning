import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCourseDto } from './Dto/create-courses.dto';
import { CoursePaymentParamsDto } from './Dto/course-payment.dto';
import { CoursesService } from './courses.service';
import { AuthGuard } from '../../Guards/auth.guard';
import { LoggingInterceptor } from './Interceptor/LoggingInterceptor';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserRole } from '../../database/core/user.entity';
import { multerConfig } from '../../config/multer.config';
import { Roles } from 'src/Decorator/roles.decorator';
import { RolesGuard } from 'src/Guards/roles.guard';
import { PaymentService } from '../payment/payment.service';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard) // make sure to call AuthGuard first to extract the user from jwt
  @Roles(UserRole.ADMIN)
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
  @Post('purchase/:courseId')
  async coursePayment(
    @Req()
    request: {
      user?: { userId: string };
    },
    @Param() params: CoursePaymentParamsDto,
  ) {
    try {
      const userId = request?.user?.userId as string;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const courseId = params.courseId;
      console.log(userId, courseId);
      const payment = await this.paymentService.paymentMethod(userId, courseId);
      return 'successful';
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
  @Get('info')
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
  @Get('my-courses')
  async getCoursesById(
    @Req() request: { user?: { userId: string } },
  ): Promise<any> {
    try {
      const userId = request.user?.userId;
      if (!userId) {
        throw new HttpException(
          'User ID not found in request',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const userCourses = await this.coursesService.getUserCourses(userId);
      return userCourses;
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
