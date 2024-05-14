import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResTransformInterceptor } from './common/interceptors/res-transform.interceptors';
import * as fs from 'fs';
import { Logger } from './common/utils';

const swaggerTitle = 'IMJoye Api';
const documentDescription = '[如有天樱花再开] 测试IMJoye Api';
const documentVersion = '1.0';
const documentTag = 'Api/V1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(documentDescription)
    .setVersion(documentVersion)
    .addTag(documentTag)
    .build();
  const document = SwaggerModule.createDocument(app, options);

  if (process.env.NODE_ENV === 'development') {
    SwaggerModule.setup('api', app, document);
  }

  fs.writeFileSync('./api.json', JSON.stringify(document, null, 2));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResTransformInterceptor());
  Logger.log('bootstrap...');
  await app.listen(8080);
}

async function generateSwaggerJson() {
  const app = await NestFactory.create(AppModule);
  try {
    const options = new DocumentBuilder()
      .setTitle(swaggerTitle)
      .setDescription(documentDescription)
      .setVersion(documentVersion)
      .addTag(documentTag)
      .build();
    const document = SwaggerModule.createDocument(app, options);

    fs.writeFileSync('./api.json', JSON.stringify(document, null, 2));
  } catch (error) {
    Logger.log('Failed to generate Swagger JSON:', error);
  } finally {
    await app.close();
    // 强制退出 不然会在终端卡住
    process.exit(0);
  }
}

if (process.env.GENERATE_SWAGGER) {
  generateSwaggerJson();
} else {
  bootstrap();
}
