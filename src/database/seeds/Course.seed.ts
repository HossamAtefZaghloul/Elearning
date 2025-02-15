// run command npx ts-node src/database/seeds/Course.seed.ts

import { createReadStream } from 'fs';
import * as csvParser from 'csv-parser';
import { AppDataSource } from '../../config/typeorm.config';
import { Course } from '../core/course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from '../../courses/Dto/create-courses.dto';

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connection established');
  const courses: CreateCourseDto[] = []; // add course dto later :3

  // Read CSV file using stream + pipe
  createReadStream('./src/database/seeds/data-csv/fake-courses.csv')
    .pipe(
      csvParser({ mapHeaders: ({ header }) => header.trim().toLowerCase() }),
    )
    .on('data', (row: Record<string, string>) => {
      console.log('Row:', row);
      courses.push({
        title: row.title,
        description: row.description,
        price: Number(row.price),
        videoPath: row.video || '',
        pdfPath: row.pdf || '',
      });
    })
    .on('end', async () => {
      console.log(courses);
      await insertCourses(courses);
    })
    .on('error', (error: unknown) => {
      if (error instanceof Error) {
        console.error('CSV Parsing failed:', error.message);
      } else {
        console.error('An unknown error occurred during CSV parsing');
      }
    });
}

async function insertCourses(courses: Partial<Course>[]) {
  try {
    const courseRepository: Repository<Course> =
      AppDataSource.getRepository(Course);
    await courseRepository.insert(courses);
    console.log('Seeding complete');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Seeding failed:', error.message);
    } else {
      console.error('An unknown error occurred during seeding');
    }
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('Seeding failed:', error.message);
  } else {
    console.error('An unknown error occurred during seeding');
  }
  process.exit(1);
});
