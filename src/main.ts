
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { defaultLanguage } from './common/middleware';
import { TransformInterceptor, WatchInterceptor } from './common/interceptor';
import { LanguageInterceptor } from './common/interceptor/language.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService); 
  app.enableCors()
  // app.use(defaultLanguage)
  app.useGlobalInterceptors(new WatchInterceptor() , new LanguageInterceptor() , new TransformInterceptor() )
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  );

  const port = config.get<number>('PORT') ?? 3000; 

  await app.listen(port);

  console.log(`Server is Running on port ${port} 🚀🚀🚀`);
}

void bootstrap();
