import { Module } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';
import { AuthenticationService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UserRepository } from 'src/common/repository';

@Module({
  imports: [UserModule],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserRepository],
})
export class AuthModule {}
