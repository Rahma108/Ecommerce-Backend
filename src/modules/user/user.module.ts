import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {  PreAuthMiddleware } from 'src/common/middleware/authentication.middleware';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: User.name, schema: userMongooseSchema }
    // ])
  ],
  exports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
    configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreAuthMiddleware)
      .forRoutes(UserController);
  }

}

