import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, isString, Min} from "class-validator";

export class PaginateDto {
  @Transform( ( {value})=> Number(value) )
    @Min(1)
    @IsInt()
    @IsOptional()
    page?:number ;


    @Transform( ( {value})=> Number(value) )
    @Min(1)
    @IsInt()
    @IsOptional()
    size?: number ;


    @IsString()
    @IsOptional()
    search?:string ;

}


@ArgsType()
export class PaginateGQLDto {
  @Field(() => Int , {nullable : true } )
    @Min(1)
    @IsInt()
    @IsOptional()
    page?:number ;


    @Field(() => Int , {nullable : true } )
    @Transform( ( {value})=> Number(value) )
    @Min(1)
    @IsInt()
    @IsOptional()
    size?: number ;

    @Field(() => String, {nullable : true } )
    @IsString()
    @IsOptional()
    search?:string ;

}