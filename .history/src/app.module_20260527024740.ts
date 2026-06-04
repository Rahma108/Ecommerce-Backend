import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [A],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
