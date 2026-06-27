import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors,  UploadedFiles } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CloudMulter, fileFieldValidation } from 'src/common/utils/multer';
import { RoleEnum } from 'src/common/enums';
import { Auth, User } from 'src/common/decorator';
import type{ HUserDocument} from 'src/DB/models';
import { IProduct } from 'src/common/interfaces/product.interface';
import type{ IFile } from 'src/common/interfaces/multer.interface';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

     @UseInterceptors(
      FileFieldsInterceptor([{name : "image" , maxCount: 1} , {name : "gallery" , maxCount: 3 } ], 
      CloudMulter({validation:fileFieldValidation.image })
     ))
     @Auth([RoleEnum.ADMIN])
     @Post()
  
     async create(@Body() createProductDto: CreateProductDto,
     @User() user:HUserDocument,
     @UploadedFiles() files : {image : IFile , gallery ?: IFile[]} ): Promise<IProduct>  {
         return await this.productService.create(createProductDto , user , files);
       }
  
      @Get()
      async findAll(): Promise<IProduct[]> {
        return this.productService.findAll();
      }




      
      @Get(':productId')
      async findOne(
        @Param('productId') productId: string
      ): Promise<IProduct> {
        return this.productService.findOne(productId);
      }

      @UseInterceptors(
        FileFieldsInterceptor(
          [
            { name: 'image', maxCount: 1 },
            { name: 'gallery', maxCount: 5 },
          ],
          CloudMulter({ validation: fileFieldValidation.image })
        )
      )
      @Auth([RoleEnum.ADMIN])
      @Patch(':productId')
      async update(
        @Param('productId') productId: string,
        @Body() updateProductDto: UpdateProductDto,
        @User() user: HUserDocument,
        @UploadedFiles()
        files: { image?: IFile[]; gallery?: IFile[] }
      ): Promise<IProduct> {
        return this.productService.update(
          productId,
          updateProductDto,
          user,
          files
        );
      }

   
      @Auth([RoleEnum.ADMIN])
      @Delete(':productId')
      async remove(
        @Param('productId') productId: string
      ): Promise<{ message: string }> {
        return this.productService.remove(productId);
      }

      @Auth([RoleEnum.ADMIN])
      @Patch(':productId/restore')
      async restore(
        @Param('productId') productId: string
      ): Promise<IProduct> {
        return this.productService.restore(productId);
      }
}

