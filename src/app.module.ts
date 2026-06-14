import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { BrandModule } from './modules/brand/brand.module';
import { OrderModule } from './modules/order/order.module';
import { SharedAuthenticationModule } from './common/modules';
import { S3Service } from './common/utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),
      }),
    }),
    SharedAuthenticationModule,
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    BrandModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService , S3Service ],
})
export class AppModule {}