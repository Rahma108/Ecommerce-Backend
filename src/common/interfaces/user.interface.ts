import { Types } from 'mongoose';
import { GenderEnum, RoleEnum } from '../enums';
export interface IUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  DOB?: Date;
  confirmedAt?: Date;
  gender?: GenderEnum;
  role?: RoleEnum;
  phone?: string;
  profileImage?: string;
  coverImages?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  changeCredentialTime?: Date;
  confirmEmail?: Date;
  provider?: number;
  friends?: Types.ObjectId[] | IUser[];
  deletedAt?: Date;
  restoredAt?: Date;
}
