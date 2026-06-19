import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { IsMongoId, IsArray } from "class-validator";
import { Types } from "mongoose";
export class UpdateCardDto extends PartialType(CreateCardDto) {}

export class RemoveItemsFromCardDto  {

    @IsMongoId({each :true } )
    @IsArray()
    productIds !: Types.ObjectId[] ;

}

