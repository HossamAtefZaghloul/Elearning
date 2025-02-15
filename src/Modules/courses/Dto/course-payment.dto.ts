import { IsNotEmpty } from 'class-validator';

export class CoursePaymentParamsDto {
  @IsNotEmpty({ message: 'Course ID is required' })
  courseId: string;
}
