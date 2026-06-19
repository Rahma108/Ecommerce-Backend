import { IsMongoId, IsPositive, Min } from "class-validator";
import { Types } from "mongoose";
import { ICartProduct } from "src/common/interfaces";


export class CreateCardDto implements Partial<ICartProduct> {



    @IsMongoId()
    productId !: Types.ObjectId;


    @Min(1)
    @IsPositive()
    quantity !: number ;

}
