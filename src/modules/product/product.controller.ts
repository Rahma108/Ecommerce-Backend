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
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
