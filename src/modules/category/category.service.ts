import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto, UpdateCategoryParamsDto } from './dto/update-category.dto';
import { generateSlug, generateToObjectId, S3Service } from 'src/common/utils';
import { HUserDocument } from 'src/DB/models/user.model';
import { ICategory, IFile } from 'src/common/interfaces';
import { CategoryRepository } from 'src/common/repository/category.repository';
import { BrandRepository } from 'src/common/repository/brand.repository';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    private readonly s3Service:S3Service,
    private readonly brandRepository:BrandRepository,
    private readonly categoryRepository : CategoryRepository){

      }
      async create(
        { name, brandIds = [] }: CreateCategoryDto,
        user: HUserDocument,
        file: IFile
      ): Promise<ICategory> {

        console.log("incoming brandIds:", brandIds);

        const objectIds = brandIds.map((id) => generateToObjectId(id));

        const checkDuplicated = await this.categoryRepository.findOne({
          filter: { name, paranoid: false },
        });

        if (checkDuplicated) {
          throw new ConflictException("Category Already Exist");
        }

        const brands = await this.brandRepository.find({
          filter: { _id: { $in: objectIds } },
        });

        if (objectIds.length !== brands.length) {
          throw new NotFoundException("Missing some brands ❕");
        }

        const image = await this.s3Service.uploadAsset({
          file,
          path: `Categories`,
        });

        const category = await this.categoryRepository.createOne({
          data: {
            name,
            image,
            brandIds: objectIds,
            createdBy: user._id,
          },
        });

        if (!category) {
          await this.s3Service.deleteAsset({ Key: image });
          throw new BadRequestException("Fail to create Category ❕");
        }

        return category.toJSON();
}
 
     async update({categoryId} : UpdateCategoryParamsDto, {name , brandIds = [] , removeBrandIds }: UpdateCategoryDto , user : HUserDocument , file? : IFile ):Promise<ICategory> {
       categoryId = generateToObjectId(categoryId as string )
       const objectIds = brandIds.map((id) => generateToObjectId(id));
       if(name){
          const checkDuplicated = await this.categoryRepository.findOne({
          filter: { name,_id :{$ne:categoryId} , paranoid: false },
        });

        if (checkDuplicated) {
          throw new ConflictException("Category Already Exist");
        }
       }
       const brands = await this.brandRepository.find({
          filter: { _id: { $in: objectIds } },
        });

        if (objectIds.length !== brands.length) {
          throw new NotFoundException("Missing some brands ❕");
        }

        let image !:string;
        if(file){
          image = await this.s3Service.uploadAsset({file , path:`Categories`})

        }
      const category = await this.categoryRepository.findOneAndUpdate({filter :{_id :categoryId } , 
        update :{
          $set:{updatedBy : user._id , ...(name ? {name , slug:generateSlug(name) } : {} 
        ) ,
        ...(file ? {image } :{} ),
        brandIds :{
          $setUnion :[
            {
              $setDifference :[
                "$brandIds" ,
                removeBrandIds?.map(ele => generateToObjectId(ele))

              ],
              brandIds 
            }





          ]
        }
      
      
      
      }} ,
      options:{new : false }
    
    
    
    })
      if(!category){
         await this.s3Service.deleteAsset({ Key: image });
         throw new BadRequestException("Fail to update Category ❕");
      }
      await this.s3Service.deleteAsset({Key : category.image})
      category.image = image 
     return category.toJSON()
   }
 
  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }


  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
