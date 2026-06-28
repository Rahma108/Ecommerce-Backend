import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";
import { IsDateGreaterThanNow, IsDateRange, IsValidDiscount } from "src/common/decorator";
import { CouponTypeEnum } from "src/common/enums";
import { ICoupon, IUser } from "src/common/interfaces";

export class CreateCouponDto implements Partial<ICoupon>{


    @MaxLength(5000)
    @MinLength(2)
    @IsString()
    @IsNotEmpty()
    name!: string ;
    @IsDateString()
    @IsDateGreaterThanNow()
    startDate!: Date ;
    @IsDateString()
    @IsDateRange(['startDate'])
    endDate!: Date ;
    @Transform( ({value}) => {return  Number(value)} )
    @Min(1)
    @IsInt()
    duration!: number ;
    @Transform( ({value}) => { return  Number(value)} )
    @IsEnum(CouponTypeEnum )
    type!: CouponTypeEnum ;
    @Transform( ({value}) => { return Number(value)} )
    @Min(1)
    @IsNumber()
    @IsValidDiscount()
    discount!: number ;
  



}
