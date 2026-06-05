import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../../common/interfaces';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';
import { User } from 'src/DB/models';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UserRepository extends BaseRepository<IUser> {
  constructor(@InjectModel(User.name) protected readonly model: Model<IUser>) {
    super(model);
  }
}
