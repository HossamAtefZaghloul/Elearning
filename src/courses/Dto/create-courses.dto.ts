import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  video?: string;

  @IsString()
  @IsOptional()
  pdf?: string;
}
