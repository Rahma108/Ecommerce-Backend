import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto, UpdateCategoryParamsDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudMulter, fileFieldValidation } from 'src/common/utils/multer';
import { RoleEnum } from 'src/common/enums';
import { Auth  , User} from 'src/common/decorator';
import type { ICategory, IFile } from 'src/common/interfaces';
import type { HUserDocument} from 'src/DB/models/user.model';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

   @UseInterceptors(FileInterceptor("attachment" , CloudMulter({validation :fileFieldValidation.image})))
   @Auth([RoleEnum.ADMIN])
   @Post()

   async create(@Body() createCategoryDto: CreateCategoryDto,
   @User() user:HUserDocument,
   @UploadedFile(ParseFilePipe) file : IFile ): Promise<ICategory>  {
       return await this.categoryService.create(createCategoryDto , user , file );
     }



    @UseInterceptors(FileInterceptor("attachment" , CloudMulter({validation :fileFieldValidation.image})))
    @Auth([RoleEnum.ADMIN])
    @Patch(':categoryId')
    update(@Param() params: UpdateCategoryParamsDto , @Body() updateCategoryDto: UpdateCategoryDto ,
      @User() user:HUserDocument,
      @UploadedFile( new ParseFilePipe({fileIsRequired: false })) file? : IFile ) {
      return this.categoryService.update(params, updateCategoryDto , user , file );
    }  
        @Get()
        async findAll(): Promise<ICategory[]> {
          return this.categoryService.findAll();
        }

        @Get(':categoryId')
        async findOne(
          @Param('categoryId') categoryId: string
        ): Promise<ICategory> {
          return this.categoryService.findOne(categoryId);
        }

        @Auth([RoleEnum.ADMIN])
        @Delete(':categoryId')
        async remove(
          @Param('categoryId') categoryId: string
        ): Promise<{ message: string }> {
          return this.categoryService.remove(categoryId);
        }

        @Auth([RoleEnum.ADMIN])
        @Patch(':categoryId/restore')
        async restore(
          @Param('categoryId') categoryId: string
        ): Promise<ICategory> {
          return this.categoryService.restore(categoryId);
        }
}
