import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationController } from './modules/auth/auth.controller';

@Module({
  imports: [],
  controllers: [AppController, AuthenticationController],
  providers: [AppService, Auth],
})
export class AppModule {}
