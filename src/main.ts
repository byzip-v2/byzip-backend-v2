import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV ?? 'development'}`);
}
bootstrap().catch((error) => {
  console.error('❌ Error starting the application:', error);
  process.exit(1);
});
