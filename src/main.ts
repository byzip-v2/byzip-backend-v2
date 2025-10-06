import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import express from 'express';

// Vercel 서버리스 환경을 위한 설정
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

// 로컬 개발 환경
if (process.env.NODE_ENV !== 'production') {
  async function bootstrap(): Promise<void> {
    const PORT = process.env.PORT ?? 3000;
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: true,
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('ByZip API')
      .setDescription('The ByZip API description')
      .setVersion('2.0.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}`),
    );
  }
  void bootstrap();
}

// Vercel 서버리스 핸들러
export default async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  await createNestApp();
  server(req, res);
};
