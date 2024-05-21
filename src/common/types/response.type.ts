import { HttpStatus } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiExtraModels } from '@nestjs/swagger';
import type { ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';

export class ApiBaseResult {
  @ApiProperty({
    description: 'Http状态码',
    examples: [
      HttpStatus.OK,
      HttpStatus.CREATED,
      HttpStatus.NOT_FOUND,
      HttpStatus.FORBIDDEN,
    ],
  })
  statusCode: HttpStatus;
  @ApiProperty({
    description: 'Http内容的简要概述',
    examples: ['用户权限不足', '未找到资源'],
  })
  message: string;
}

export interface IApiResult<T> extends ApiBaseResult {
  data: T;
}

export const ApiOkResponseResult = <T extends Type>(options: {
  model: T;
  description?: string;
  isArray?: boolean;
}) => {
  const { model, description, isArray } = options;
  const ref: ReferenceObject = { $ref: getSchemaPath(model) };
  return applyDecorators(
    ApiExtraModels(ApiBaseResult),
    ApiExtraModels(model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(ApiBaseResult),
          },
          {
            properties: {
              data: isArray ? { type: 'array', items: ref } : ref,
            },
          },
        ],
      },
    }),
  );
};

export const ApiCreatedResponseResult = <T extends Type>(options: {
  model: T;
  description?: string;
  isArray?: boolean;
}) => {
  const { model, description, isArray } = options;
  const ref: ReferenceObject = { $ref: getSchemaPath(model) };
  return applyDecorators(
    ApiExtraModels(ApiBaseResult),
    ApiExtraModels(model),
    ApiCreatedResponse({
      description,
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(ApiBaseResult),
          },
          {
            properties: {
              data: isArray ? { type: 'array', items: ref } : ref,
            },
          },
        ],
      },
    }),
  );
};
