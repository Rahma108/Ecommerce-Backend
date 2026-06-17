import {MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {  PreAuthMiddleware } from 'src/common/middleware/authentication.middleware';

import { EncryptionSecurity, S3Service, SecurityService } from 'src/common/utils';
import { UserModel } from 'src/DB/models';
@Module({
  imports: [
    UserModel
  ],
  exports: [],
  controllers: [UserController],
  providers: [UserService, S3Service, SecurityService, EncryptionSecurity]
})
export class UserModule {
    configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreAuthMiddleware)
      .forRoutes(UserController);
  }

}

