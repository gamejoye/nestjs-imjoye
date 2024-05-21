import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { IApiResult } from '../types/response.type';

@Injectable()
export class ResTransformInterceptor<T>
  implements NestInterceptor<T, IApiResult<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResult<T>> {
    const response: Response = context.switchToHttp().getResponse();
    const request: Request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data: T) => {
        const transformed = {
          statusCode: response.statusCode as HttpStatus,
          data: data,
          message: 'success',
        };
        // 鸿蒙提供的request.uploadFile 无法获取后端的response 所以这里折中方案在response.headers提供返回值
        if (request.path === '/users/avatar/upload') {
          response.setHeader('status', JSON.stringify(transformed));
        }
        return transformed;
      }),
    );
  }
}
