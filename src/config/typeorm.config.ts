import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config(); // ...... CheckSlater

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: parseInt(configService.get<string>('DATABASE_PORT') || '5432', 10),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // Supports both TS and JS
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  migrationsRun: false,
  logging: true,
});
