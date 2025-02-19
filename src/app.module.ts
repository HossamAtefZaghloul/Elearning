import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './Modules/auth/auth.module';
import { UsersModule } from './Modules/users/users.module';
import { CoursesModule } from './Modules/courses/courses.module';
import { CoreModule } from './Modules/core-module/core-module.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PaymentModule } from './Modules/payment/payment.module';
import { ProfileModule } from './Modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'rahhst',
      database: process.env.DATABASE_NAME || 'Elearning',
      synchronize: true, /// CHANGE THIS To False BEFORE PRODUCTION**
      entities: [__dirname + '/database/core/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    CoursesModule,
    CoreModule,
    PaymentModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
