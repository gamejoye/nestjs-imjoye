import { HttpStatus } from '@nestjs/common';

export class ApiResult<T> {
  statusCode: HttpStatus;
  data: T;
  message: string;
}
