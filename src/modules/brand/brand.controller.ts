import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ParseFilePipe, UploadedFile } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto, UpdateBrandParamsDto } from './dto/update-brand.dto';
import { Auth, User } from 'src/common/decorator';
import { RoleEnum } from 'src/common/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudMulter, fileFieldValidation } from 'src/common/utils';
import type{ HUserDocument } from 'src/DB/models';
import type{ IBrand, IFile } from 'src/common/interfaces';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}


  @UseInterceptors(FileInterceptor("attachment" , CloudMulter({validation :fileFieldValidation.image})))
  @Auth([RoleEnum.ADMIN])
  @Post()
  async create(@Body() createBrandDto: CreateBrandDto,
  @User() user:HUserDocument,
  @UploadedFile(ParseFilePipe) file : IFile ): Promise<IBrand>  {
      return await this.brandService.create(createBrandDto , user , file );
    }

  @Get()

  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @UseInterceptors(FileInterceptor("attachment" , CloudMulter({validation :fileFieldValidation.image})))
  @Auth([RoleEnum.ADMIN])
  @Patch(':brandId')
  update(@Param() params: UpdateBrandParamsDto , @Body() updateBrandDto: UpdateBrandDto ,
    @User() user:HUserDocument,
    @UploadedFile( new ParseFilePipe({fileIsRequired: false })) file? : IFile ) {
    return this.brandService.update(params, updateBrandDto , user , file );
  }

  @Delete(':brandId')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
