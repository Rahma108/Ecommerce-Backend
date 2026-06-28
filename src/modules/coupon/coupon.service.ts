import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { HUserDocument } from 'src/DB/models';
import { IFile } from 'src/common/interfaces';

@Injectable()
export class CouponService {
  async create({discount , startDate , endDate , duration , name , type  }: CreateCouponDto , 
    user: HUserDocument , file:IFile ) {
    return 'This action adds a new coupon';
  }

  findAll() {
    return `This action returns all coupon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
