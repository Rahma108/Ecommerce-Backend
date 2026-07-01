import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModel, CouponModel, OrderModel, ProductModel } from 'src/DB/models';
import { OrderRepository } from 'src/common/repository/order.repository';
import { CartRepository, CouponRepository, ProductRepository } from 'src/common/repository';
import { CardService } from '../card/card.service';
import { PaymentService } from 'src/common/utils';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Module({
  imports:[OrderModel , CartModel , ProductModel , CouponModel ] ,
  controllers: [OrderController],
  providers: [RealtimeGateway , OrderService , OrderRepository ,ProductRepository , CartRepository , CouponRepository , CardService , PaymentService ],
})
export class OrderModule {}
