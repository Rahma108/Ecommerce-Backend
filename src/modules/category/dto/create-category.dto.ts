import { ArrayUnique, IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { IBrand, ICategory } from "src/common/interfaces";
import { Types } from 'mongoose';

export class CreateCategoryDto implements Partial<ICategory> {
      @MaxLength(50)
        @MinLength(2)
        @IsString()
        @IsNotEmpty()
        name!: string ;

        @IsMongoId({each : true })
        @IsArray()
        @ArrayUnique()
        @IsOptional()
        brandIds? : Types.ObjectId[] | IBrand[];

}
