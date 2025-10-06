import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { AppModule } from '../src/app.module';

const expressServer = express();
let app: INestApplication;

async function createNestServer(): Promise<express.Express> {
  if (!app) {
    app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressServer),
      {
        logger: ['error', 'warn', 'log'],
      },
    );

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

  return expressServer;
}

export default async (req: any, res: any) => {
  const server = await createNestServer();
  return server(req, res);
};
