import { InjectModel } from '@nestjs/mongoose';
import { IBrand } from '../interfaces';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';
import { Brand } from 'src/DB/models';
import { Injectable } from '@nestjs/common';
@Injectable()
export class BrandRepository extends BaseRepository<IBrand> {
  constructor(@InjectModel(Brand.name) protected readonly model: Model<IBrand>) {
    super(model);
  }
}
