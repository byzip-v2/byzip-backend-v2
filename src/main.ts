import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Vercel용 서버리스 함수 설정
let cachedApp: any = null;

async function createApp() {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn', 'log'],
  });

  // CORS 설정
  const isDev = process.env.NODE_ENV === 'development';
  const allowedOrigins = isDev
    ? [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://dev.by-zip.com',
      ]
    : [
        'https://by-zip.com',
        'https://www.by-zip.com',
        'https://app.by-zip.com',
        'https://www.app.by-zip.com',
      ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // 전역 접두사 설정 (선택사항)
  app.setGlobalPrefix('api');

  await app.init();

  cachedApp = expressApp;
  return expressApp;
}

// Vercel 서버리스 함수 핸들러
export default async (req: any, res: any) => {
  const app = await createApp();
  app(req, res);
};

// 로컬 개발용 부트스트랩
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const app = await NestFactory.create(AppModule);

    // CORS 설정
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://dev.by-zip.com',
    ];

    app.enableCors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });

    app.setGlobalPrefix('api');

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    console.log(`🚀 Server running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV ?? 'development'}`);
  }
}

// 로컬 개발 시에만 부트스트랩 실행
if (require.main === module) {
  bootstrap().catch((error) => {
    console.error('❌ Error starting the application:', error);
    process.exit(1);
  });
}
