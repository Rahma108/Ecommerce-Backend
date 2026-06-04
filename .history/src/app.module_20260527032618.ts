import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { BrandModule } from './modules/brand/brand.module';

@Module({
  imports: [AuthModule, UserModule, ProductModule, CategoryModule, BrandModule, ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
