import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userMongooseSchema } from 'src/DB/models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userMongooseSchema },
    ]),
  ],
  exports: [MongooseModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
