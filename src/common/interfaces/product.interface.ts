import { Types } from 'mongoose';
import { IUser } from './user.interface';
import { IBrand } from './brand.interface';
import { ICategory } from './category.interface';
export interface IProduct{
  name: string;
  description: string;
  slug: string;
  image: string;

  gallery?:string[];

  productId: string ;
  stock : number;

  rating ?: number ;

  originalPrice : number ;
  salePrice : number ;
  discountPercentage: number
  finalPrice : number ;

  categoryId: Types.ObjectId | ICategory;
  brandId: Types.ObjectId | IBrand;

  updatedBy: Types.ObjectId | IUser;
  createdBy: Types.ObjectId | IUser;
  notifyUsers: Types.ObjectId[] | IUser[];


  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  restoredAt?: Date;
}
