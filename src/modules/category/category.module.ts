import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryModel ,  BrandModel } from 'src/DB/models';
import { CategoryRepository } from 'src/common/repository/category.repository';
import { BrandRepository } from 'src/common/repository';
import { S3Service } from 'src/common/utils';

@Module({
  imports:[CategoryModel , BrandModel ],
  controllers: [CategoryController],
  providers: [CategoryService , CategoryRepository ,BrandRepository , S3Service ],
})
export class CategoryModule {}
