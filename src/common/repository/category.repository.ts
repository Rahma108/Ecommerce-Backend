import { InjectModel } from '@nestjs/mongoose';
import { ICategory } from '../interfaces';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';
import { Category } from 'src/DB/models';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CategoryRepository extends BaseRepository<ICategory> {
  constructor(@InjectModel(Category.name) protected readonly model: Model<ICategory>) {
    super(model);
  }
}
