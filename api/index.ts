import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
import basicAuth from 'express-basic-auth';
import * as sdkPackage from '../sdk-package/package.json';
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

    // API 문서 접근 제한을 위한 기본 인증 설정 (Swagger 문서에만 적용)
    app.use(
      ['/docs', '/docs-json'],
      basicAuth({
        challenge: true,
        users: {
          byzip: 'byzip123',
        },
      }),
    );

    // Swagger 설정
    const config = new DocumentBuilder()
      .setTitle('ByZip API')
      .setDescription(`byzip-sdk version: ${sdkPackage.version}`)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        url: '/docs-json',
      },
      customCssUrl: 'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css',
      customJs: [
        'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js',
      ],
    });

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
