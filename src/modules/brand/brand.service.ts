import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import type { UpdateBrandDto, UpdateBrandParamsDto } from './dto/update-brand.dto';
import { BrandRepository } from 'src/common/repository';
import { generateSlug, S3Service } from 'src/common/utils';
import { HUserDocument } from 'src/DB/models';
import { IBrand, IFile } from 'src/common/interfaces';
import {generateToObjectId} from '../../common/utils/index'
@Injectable()
export class BrandService {
  constructor(
    private readonly s3Service:S3Service,
    private readonly brandRepository : BrandRepository){

  }
  async create({name}: CreateBrandDto , user : HUserDocument , file : IFile ): Promise<IBrand> {
    const checkDuplicated = await this.brandRepository.findOne({filter: {name , paranoid : false }});
    if(checkDuplicated) throw new ConflictException("Brand Already Exist ")

    const image = await this.s3Service.uploadAsset({file , path :`Brands`})
    const brand =  await this.brandRepository.createOne({data:{
      name  ,
      image ,
      createdBy : user._id 
    }})
  if(!brand){
    await this.s3Service.deleteAsset({Key : image })
    throw new BadRequestException("Fail to create Brand instance ❕")
  }
    return brand.toJSON()
  }

    async update({brandId} : UpdateBrandParamsDto, {name}: UpdateBrandDto , user : HUserDocument , file? : IFile ):Promise<IBrand> {
      brandId = generateToObjectId(brandId as string )
      const brand = await this.brandRepository.findOne({filter:{_id : brandId }})
      if(!brand) throw new NotFoundException("Brand Not Found ❕")
        if(name && await this.brandRepository.findOne({filter:{name , _id : { $ne: brandId }, paranoid : false }})){
          throw new ConflictException("Brand with same name already exist ❕")
        }
        brand.name = name as string;
        brand.slug = generateSlug(brand.name)

        let oldImage !:string;
        if(file){
          brand.image = await this.s3Service.uploadAsset({file , path:"Brands"})

        }
        brand.updatedBy = user._id ;
        await brand.save()
        if(oldImage) await this.s3Service.deleteAsset({Key: oldImage })


    return brand.toJSON()
  }
      async findAll(): Promise<IBrand[]> {
        const brands = await this.brandRepository.find({
            filter: {deletedAt: { $exists: false }},
          projection: "name slug image createdBy",
        });

        return brands.map((brand) => brand.toJSON());
      }

    async findOne(id: string): Promise<IBrand> {
      const _id = generateToObjectId(id);

      const brand = await this.brandRepository.findOne({
        filter: { _id , deletedAt: { $exists: false } },
       
      });

      if (!brand) throw new NotFoundException("Brand Not Found ❕");

      return brand.toJSON();
    }
      async remove(brandId: string): Promise<{ message: string }> {
      const _id = generateToObjectId(brandId);

      const brand = await this.brandRepository.findOne({
        filter: { _id },
      });

      if (!brand) throw new NotFoundException("Brand Not Found ❕");

      // soft delete
      brand.deletedAt = new Date();
      await brand.save();

      return { message: "Brand deleted successfully ✅" };
    }
    async restore(brandId: string): Promise<IBrand> {
        const _id = generateToObjectId(brandId);

        const brand = await this.brandRepository.findOne({
          filter: { _id, paranoid: false },
        });

        if (!brand) throw new NotFoundException("Brand Not Found ❕");

        if (!brand.deletedAt) {
          throw new BadRequestException("Brand is already active ❕");
        }

        brand.deletedAt = undefined;
        await brand.save();

        return brand.toJSON();
}


}


