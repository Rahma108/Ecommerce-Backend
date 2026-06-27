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
import { PaginateGQLDto } from 'src/dto';
import { IPagination } from 'src/common/interfaces';

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
   
  // Restful
  async findAll(): Promise<IProduct[]> {
  const products = await this.productRepository.find({
    filter: {
      deletedAt: { $exists: false },
    },
  });

  return products.map((p) => p.toJSON());
}
 // graphGl ..
  async findAllProducts(
  args: PaginateGQLDto,
): Promise<IPagination<IProduct>> {
  const page = args.page ?? 1;
  const size = args.size ?? 10;

  const filter = {
    deletedAt: { $exists: false },
  };

  const [products, total] = await Promise.all([
    this.productRepository.find({
      filter,
      options: {
        skip: (page - 1) * size,
        limit: size,
      },
    }),
    this.productRepository.countDocuments(filter),
  ]);

  return {
    docs: products,
    currentPage: page,
    pages: Math.ceil(total / size),
    size,
  };
}


 async findOne(id: string): Promise<IProduct> {
  const _id = generateToObjectId(id);

  const product = await this.productRepository.findOne({
    filter: {
      _id,
      deletedAt: { $exists: false },
    },
  });

  if (!product) throw new NotFoundException("Product Not Found ❕");

  return product.toJSON();
}

      async update(
      productId: string,
      updateProductDto: UpdateProductDto,
      user: HUserDocument,
      files?: { image?: IFile[]; gallery?: IFile[] }
    ): Promise<IProduct> {
      const _id = generateToObjectId(productId);

      const product = await this.productRepository.findOne({
        filter: { _id },
      });

      if (!product) throw new NotFoundException("Product Not Found ❕");

      // update prices
      if (updateProductDto.salePrice || updateProductDto.discountPercentage) {
        const salePrice = updateProductDto.salePrice ?? product.salePrice;
        const discount = updateProductDto.discountPercentage ?? product.discountPercentage;

        product.finalPrice = Number(
          (salePrice - salePrice * (discount / 100)).toFixed(2)
        );
      }

      // update image
      if (files?.image?.length) {
        const newImage = await this.s3Service.uploadAsset({
          file: files.image[0],
          path: `Products/${product.productId}`,
        });

        await this.s3Service.deleteAsset({ Key: product.image });
        product.image = newImage;
      }

      // update gallery
      if (files?.gallery?.length) {
        const newGallery = await this.s3Service.uploadAssets({
          files: files.gallery,
          path: `Products/${product.productId}/gallery`,
        });

        product.gallery = [
          ...(product.gallery || []),
          ...(newGallery || []),
        ];
      }

      Object.assign(product, {
        ...updateProductDto,
        updatedBy: user._id,
      });

      await product.save();

      return product.toJSON();
    }
    
    async remove(productId: string): Promise<{ message: string }> {
        const _id = generateToObjectId(productId);

        const product = await this.productRepository.findOne({
          filter: { _id },
        });

        if (!product) throw new NotFoundException("Product Not Found ❕");

        product.deletedAt = new Date();
        await product.save();

        return { message: "Product deleted successfully ✅" };
      }
    async restore(productId: string): Promise<IProduct> {
      const _id = generateToObjectId(productId);

      const product = await this.productRepository.findOne({
        filter: { _id, paranoid: false },
      });

      if (!product) throw new NotFoundException("Product Not Found ❕");

      if (!product.deletedAt) {
        throw new BadRequestException("Product already active ❕");
      }

      product.deletedAt = undefined;
      await product.save();

      return product.toJSON();
    }



}
