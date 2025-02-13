import { Transform, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UserPayloadDto {
  @Type(() => Number)
  @IsNumber()
  id: number;
  @IsString()
  email: string;
  @IsString()
  role: string;
}
