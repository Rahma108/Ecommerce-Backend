import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationController } from './modules/auth/auth.controller';
import { AuthenticationService } from './modules/auth/auth.service';

@Module({
  imports: [],
  controllers: [AppController, AuthenticationController],
  providers: [AppService, AuthenticationService],
})
export class AppModule {}
