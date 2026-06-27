
import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength, MaxLength, IsPositive, Min, Max , IsOptional, IsMongoId, IsInt } from "class-validator";
import { Types } from "mongoose";
import { IsGTE } from "src/common/decorator/gte.decorator";
import { IProduct } from "src/common/interfaces/product.interface";

export class CreateProductDto  implements Partial<IProduct>{
        @MaxLength(5000)
        @MinLength(2)
        @IsString()
        @IsNotEmpty()
        name!: string;
        @MaxLength(50000)
        @MinLength(2)
        @IsString()
        @IsNotEmpty()
        description!: string;
        
        @Transform(({value} ) =>Number(value))
        @IsPositive()
        @Min(0)
        stock! : number;

        @Transform(({value} ) =>Number(value))
        @IsPositive()
        @Min(0)
        originalPrice! : number ;
        @Transform(({value} ) =>Number(value))
        @IsPositive()
        @Min(0)
        @IsOptional()
        @IsGTE(['originalPrice'])
        salePrice !: number ;

        @Transform(({value} ) =>Number(value))
        @IsPositive()
        @Min(0)
        @Max(100)
        discountPercentage?: number

        @IsMongoId()
        categoryId!: Types.ObjectId ;
        @IsMongoId()
        brandId!: Types.ObjectId;




}


@InputType()
export class SayHiInputDto {
        @Field(()=> String )
        @IsString()
        name!: string ;


        @Field( ()=> Int , { nullable : true })
        @IsInt()
        @IsOptional()
        age!: number 


}
