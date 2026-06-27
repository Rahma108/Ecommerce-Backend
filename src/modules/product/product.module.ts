import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { BrandModel, CategoryModel, ProductModel } from 'src/DB/models';
import { BrandRepository } from 'src/common/repository/brand.repository';
import { CategoryRepository } from 'src/common/repository/category.repository';
import { ProductRepository } from 'src/common/repository/product.repository';
import { S3Service } from 'src/common/utils/service/s3.service';
import { ProductResolver } from './product.resolver';

@Module({
  imports:[ProductModel , CategoryModel , BrandModel ] ,
  controllers: [ProductController],
  providers: [ProductService , CategoryRepository , BrandRepository , ProductRepository , S3Service , ProductResolver]
})
export class ProductModule {}
