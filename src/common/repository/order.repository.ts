import { InjectModel } from '@nestjs/mongoose';
import { IOrder } from '../interfaces';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';
import { Order } from 'src/DB/models';
import { Injectable } from '@nestjs/common';
@Injectable()
export class OrderRepository extends BaseRepository<IOrder> {
  constructor(@InjectModel(Order.name) protected readonly model: Model<IOrder>) {
    super(model);
  }
}
