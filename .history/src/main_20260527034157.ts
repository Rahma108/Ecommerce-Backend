import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(POR);
  console.log(`Server is Running on port ${PORT} 🚀🚀🚀`);
}
void bootstrap();
