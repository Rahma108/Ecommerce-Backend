import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryRepository } from 'src/common/repository/category.repository';
import { S3Service } from 'src/common/utils/service/s3.service';
import { BrandRepository } from 'src/common/repository/brand.repository';
import { ProductRepository } from 'src/common/repository/product.repository';
import type{ IFile } from 'src/common/interfaces/multer.interface';
import { ICategory } from 'src/common/interfaces/category.interface';
import { CreateCategoryDto } from '../category/dto/create-category.dto';
import type { HUserDocument } from 'src/DB/models/user.model';
import { generateToObjectId } from 'src/common/utils/toObject';
import { IProduct } from 'src/common/interfaces/product.interface';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ProductService {
    constructor(
      private readonly s3Service:S3Service,
      private readonly brandRepository:BrandRepository,
      private readonly categoryRepository : CategoryRepository,
    private readonly productRepository : ProductRepository){
  
        }
        async create(
          {name , description ,  brandId , categoryId , originalPrice , salePrice ,discountPercentage = 0 , stock }: CreateProductDto,
          user: HUserDocument,
          files : {image : IFile , gallery ?: IFile[]}
        ): Promise<IProduct> {
  
        brandId = generateToObjectId(brandId  as unknown as string )
        categoryId  = generateToObjectId(categoryId  as unknown as string )

          const category = await this.categoryRepository.findOne({
            filter: { _id :  categoryId, paranoid: false },
          });
  
          if (!category) {
            throw new NotFoundException("Category Not  Exist");
          }
          const brand = await this.brandRepository.findOne({
            filter: { _id :  brandId, paranoid: false },
          });
  
          if (!brand) {
            throw new NotFoundException("brand Not  Exist");
          }
          const finalPrice = Number( (salePrice - (salePrice * (discountPercentage / 100 ))).toFixed(2));
          const productId = randomUUID().slice(0 , 6);


        const image = await this.s3Service.uploadAsset({file: files.image[0] , path: `Products/${productId}`} )
        let gallery!:string[] | undefined;
        if(files.gallery?.length){
          gallery = await this.s3Service.uploadAssets({ files : files.gallery , path: `Products/${productId}/gallery` });

        }
        const product = await this.productRepository.createOne({
            data:{
                  name , 
                  description ,
                  brandId ,
                  categoryId ,
                  originalPrice , 
                  salePrice 
                  ,discountPercentage ,
                  stock , 
                  productId , 
                  image ,
                  gallery,
                  createdBy: user._id ,
                  finalPrice
          }
        })
        if(!product){
          await this.s3Service.deleteFolderByPrefix({ prefix: `Products/${productId}` } )
          throw new BadRequestException("Fail to create Product ❕");
        }
          return product.toJSON();
  }
   

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
