import { IsEnum, IsOptional, IsString, Matches, Max, Min } from "class-validator";
import { CurrencyTypeEnum } from "src/common/enums";
import { IOrder} from "src/common/interfaces";

export class CreateOrderDto  implements Partial<IOrder>{

    @Max(5000)
    @Min(2)
    @IsString()
    address!: string ;
    @Max(5000)
    @Min(2)
    @IsString()
    @Matches(/^(00201|\+201|01)(0|1|2|5)\d{8}$/)
    phone!: string ;
    @Max(5000)
    @Min(2)
    @IsString()
    @IsOptional()
    note?: string ;

    @IsEnum(CurrencyTypeEnum)
    currency!: CurrencyTypeEnum ;
    

    

    

}
