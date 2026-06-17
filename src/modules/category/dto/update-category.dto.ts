import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { Types } from 'mongoose';
import { ArrayUnique, IsArray, IsMongoId, IsOptional } from 'class-validator';
import { IBrand } from 'src/common/interfaces/brand.interface';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {

        @IsMongoId({each : true })
        @IsArray()
        @ArrayUnique()
        @IsOptional()
        removeBrandIds? : Types.ObjectId[] | IBrand[];
}

export class UpdateCategoryParamsDto extends PartialType(CreateCategoryDto) {
    @IsMongoId()
    categoryId !:string | Types.ObjectId;
}