import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const PORT = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // API 문서 접근 제한을 위한 기본 인증 설정
  app.use(
    '/api',
    basicAuth({
      challenge: true,
      users: {
        byzip: 'byzip123',
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ByZip API')
    .setDescription('byzip-sdk version: 1.0.2')
    .setVersion('2.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`),
  );
}

void bootstrap();
