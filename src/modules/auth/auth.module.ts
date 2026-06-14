import {  MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthenticationController } from './auth.controller';
import { AuthenticationService } from './auth.service';
import { defaultLanguage } from 'src/common/middleware';
import { EmailService, EncryptionSecurity, SecurityService } from 'src/common/utils/service';
@Module({
  imports: [],
  exports:[
  EncryptionSecurity,
    EmailService ,
    SecurityService],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    EncryptionSecurity,
    EmailService ,
    SecurityService
  ],
})
export class AuthModule {
   configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(defaultLanguage )
        .forRoutes(AuthenticationController);
    }
}
