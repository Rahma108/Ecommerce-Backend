import { InjectModel } from '@nestjs/mongoose';
import { IProduct } from '../interfaces';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';
import { Product } from 'src/DB/models';
import { Injectable } from '@nestjs/common';
@Injectable()
export class ProductRepository extends BaseRepository<IProduct> {
  constructor(@InjectModel(Product.name) protected readonly model: Model<IProduct>) {
    super(model);
  }
}
