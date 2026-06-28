import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModel, CouponModel, OrderModel, ProductModel } from 'src/DB/models';
import { OrderRepository } from 'src/common/repository/order.repository';
import { CartRepository, CouponRepository, ProductRepository } from 'src/common/repository';

@Module({
  imports:[OrderModel , CartModel , ProductModel , CouponModel ] ,
  controllers: [OrderController],
  providers: [OrderService , OrderRepository ,ProductRepository , CartRepository , CouponRepository  ],
})
export class OrderModule {}
