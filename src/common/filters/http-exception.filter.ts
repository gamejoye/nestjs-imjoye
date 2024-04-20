import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // 鸿蒙提供的request.uploadFile 无法获取后端的response 所以这里折中方案在response.headers提供返回值
    const transformed = {
      statusCode: status,
      path: request.url,
      message: exception.message,
    };
    if (request.path === '/users/avatar/upload') {
      response.setHeader('status', JSON.stringify(transformed));
    }
    response.status(status).json(transformed);
  }
}
