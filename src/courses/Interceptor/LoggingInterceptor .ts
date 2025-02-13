import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    console.log('Before handler execution');

    // Extract uploaded file(s)
    const file = request.file;
    const files = request.files;

    if (file) {
      console.log(
        `Uploaded file: ${file.originalname}, Size: ${file.size} bytes`,
      );
    }
    if (files) {
      console.log(`Uploaded ${files.length} files`);
    }

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`After handler execution: ${duration}ms`);
      }),
    );
  }
}
