import { Types } from 'mongoose';
import { IUser } from './user.interface';
import { CouponTypeEnum } from '../enums';
export interface ICoupon {

  type: CouponTypeEnum;
  discount:number ;
  startDate: Date;
  endDate: Date;
  duration : number ;
  usedBy :{ userId :Types.ObjectId , time : Date  }
  name: string;
  slug: string;
  image: string;
  createdBy: Types.ObjectId | IUser;
  updatedBy: Types.ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  restoredAt?: Date;
}
