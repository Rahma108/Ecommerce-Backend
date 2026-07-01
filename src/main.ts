
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor, WatchInterceptor } from './common/interceptor';
import { LanguageInterceptor } from './common/interceptor/language.interceptor';
import *  as express from "express"
import { resolve } from 'node:path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService); 
  app.enableCors();
  app.use("/order/webhook" , express.raw({type : 'application/json'}))
  app.use("/upload" , express.static(resolve(`./uploads`)))
  // app.use(defaultLanguage)
  app.useGlobalInterceptors(new WatchInterceptor() , new LanguageInterceptor() , new TransformInterceptor() )
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: false,
    transform: true,
    forbidNonWhitelisted: true,
  }),
);
  const port = config.get<number>('PORT') ?? 3000; 

  await app.listen(port);

  console.log(`Server is Running on port ${port} 🚀🚀🚀`);
}

void bootstrap();
