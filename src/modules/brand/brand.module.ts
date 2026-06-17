import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandRepository } from 'src/common/repository';
import { BrandModel } from 'src/DB/models';
import { S3Service } from 'src/common/utils';

@Module({
  imports:[BrandModel ],
  controllers: [BrandController],
  providers: [BrandService , BrandRepository , S3Service],
})
export class BrandModule {}
