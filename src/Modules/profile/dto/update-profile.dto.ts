import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  //   @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phoneNumber?: string;
}
