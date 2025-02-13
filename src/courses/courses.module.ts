import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from 'src/database/core/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CoreModule } from 'src/core-module/core-module.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), AuthModule, CoreModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
