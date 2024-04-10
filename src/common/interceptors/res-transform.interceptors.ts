import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from '../types/response.type';

@Injectable()
export class ResTransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((data: T) => ({
        statusCode: context.switchToHttp().getResponse()
          .statusCode as HttpStatus,
        data: data,
        message: 'success',
      })),
    );
  }
}
