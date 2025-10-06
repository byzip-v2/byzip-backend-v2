import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { AppModule } from '../src/app.module';

const server = express();
let app: INestApplication | null = null;

async function createNestApp(): Promise<INestApplication> {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
      logger: ['error', 'warn'],
    });

    // CORS 설정
    app.enableCors({
      origin: true,
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('ByZip API')
      .setDescription('The ByZip API description')
      .setVersion('2.0.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app!, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.init();
  }
  return app;
}

// Vercel 서버리스 핸들러
export default async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  await createNestApp();
  server(req, res);
};
