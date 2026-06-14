import { BadRequestException, MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {  PreAuthMiddleware } from 'src/common/middleware/authentication.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type{ Request } from 'express';
import { randomUUID } from 'node:crypto';
import { S3Service } from 'src/common/utils';
@Module({
  imports: [
  ],
  exports: [],
  controllers: [UserController],
  providers: [UserService , S3Service ],
})
export class UserModule {
    configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreAuthMiddleware)
      .forRoutes(UserController);
  }

}

