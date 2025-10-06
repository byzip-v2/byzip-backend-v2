import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AppModule } from '../src/app.module';

let app: INestApplication;

async function bootstrap(): Promise<INestApplication> {
  if (!app) {
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    // CORS 설정
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // Swagger 설정
    const config = new DocumentBuilder()
      .setTitle('ByZip API')
      .setDescription('The ByZip API description')
      .setVersion('2.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  }
  return app;
}

export default async (req: Request, res: Response): Promise<void> => {
  const nestApp = await bootstrap();
  const httpAdapter = nestApp.getHttpAdapter();
  const instance = httpAdapter.getInstance() as (
    req: Request,
    res: Response,
  ) => void;
  instance(req, res);
};
