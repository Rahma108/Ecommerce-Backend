import { Module } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';
import { AuthenticationService } from './auth.service';

@Module({
  imports: [],
  exports: [A],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthModule{



}