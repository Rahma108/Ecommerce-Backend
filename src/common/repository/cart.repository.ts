import { InjectModel } from '@nestjs/mongoose';
import { ICart } from '../interfaces';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';
import { Cart } from 'src/DB/models';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CartRepository extends BaseRepository<ICart> {
  constructor(@InjectModel(Cart.name) protected readonly model: Model<ICart>) {
    super(model);
  }
}
