import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getPort } from 'get-port-please';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = await getPort({ portRange: [3000, 3001] });
  await app.listen(port, async (...args) => {
    console.log(`Server is running on ${await app.getUrl()}`);
  });
}
bootstrap();
