import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3000;  هيستنى هنا لحد ما السيرفر يقوم، وبعدها ينزل للسطر اللي تحته
  await app.listen(PORT);
  console.log(`Server is Running on port ${PORT} 🚀🚀🚀`);
}

// كلمة void دي هي السحر اللي هيخلي الـ ESLint يسكت وميطلعش خطوط حمرا تاني هنا
void bootstrap();