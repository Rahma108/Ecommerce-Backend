import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, OrderParamsDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { HCouponDocument, HProductDocument, HUserDocument } from 'src/DB/models';
import { OrderRepository } from 'src/common/repository/order.repository';
import { CartRepository, CouponRepository, ProductRepository } from 'src/common/repository';
import { IOrder, IOrderProduct } from 'src/common/interfaces';
import { CouponTypeEnum, OrderStatusEnum } from 'src/common/enums';
import { randomUUID } from 'node:crypto';
import { CardService } from '../card/card.service';
import { Types } from 'mongoose';
import { generateToObjectId } from 'src/common/utils';

@Injectable()
export class OrderService {
    constructor(
      private readonly orderRepository :OrderRepository ,
      private readonly  productRepository: ProductRepository, 
      private readonly cartRepository: CartRepository , 
      private readonly  couponRepository :CouponRepository,
      private readonly  cardService: CardService
    ) {}
  async create({address , currency , phone , note , couponName ,paymentType}: CreateOrderDto , user:HUserDocument ):Promise<IOrder> {
    const cart = await this.cartRepository.findOne({
      filter:{
        createdBy : user._id
      }
    })
    if(!cart?.products?.length){
      throw new NotFoundException("Cart is Empty ")
    }
    let coupon! : HCouponDocument;
    if (!couponName) {
      coupon = await this.couponRepository.findOne({
        filter:{
          name : couponName ,
          startDate:{$lt : new Date(Date.now() )},
          endDate:{$gt : new Date(Date.now() )}
        }
      }) as HCouponDocument
      if(!coupon){
        throw new NotFoundException("Invalid Coupon ❌")

      }
      const trials = coupon.usedBy.filter(ele => ele.userId.toString() == user._id.toString() ).length
      if (trials >= coupon.duration) {
        throw new BadRequestException("User Exceeded maximum trials pe this coupon ")

        
      }
      
    }

 let orderProducts: IOrderProduct[]  = [] 
 let total : number = 0;
    for (const product of cart.products) {
      const matchProduct = await this.productRepository.findOne({
        filter:{
          _id :  product.productId ,
          stock : {
            $gte: product.quantity ,
          }
        }
      })
      if(!matchProduct){
        throw new NotFoundException(`Invalid Product out of stock ❕`)

      }
      const sum = product.quantity * matchProduct.finalPrice
      orderProducts.push({
        productId : product.productId, 
        quantity: product.quantity ,
        unitAmount:matchProduct.finalPrice ,
        total : sum 
      })
      total += sum ;
      
      
    }

    let subtotal:number = total ;
    let discountPercent: number  = 0
    if (coupon) {
      discountPercent = coupon.type == CouponTypeEnum.PERCENTAGE  ? 
      coupon.discount : (Number((coupon.discount / total ).toFixed(2))* 100 );
      subtotal = subtotal - (subtotal  * Number((discountPercent/100).toFixed(2) ) )
      
    }
    const order = await this.orderRepository.createOne({
      data:{
        address , currency , phone , note , total , subtotal , discountPercent,
        ...(coupon ? {couponId : coupon._id } :{}  ),
        orderId:randomUUID().slice(0 , 6 ),
        createdBy : user._id ,
        products: orderProducts ,
        paymentType ,
        createdAt: new Date(), 
      }
    })
    if(!order){
      throw new BadRequestException("Fail to create this order ❕")
    }

    const stockProducts:{productId : Types.ObjectId , stock : number } [] = [] 
    for (const product of cart.products ) {
      const matchProduct = await this.productRepository.findOneAndUpdate({
        filter :{
          _id : product.productId 
        },
        update:{
          $inc:{
            stock : -product.quantity
          }

        }
      }) as HProductDocument
       stockProducts.push({
        productId : matchProduct._id  ,
        stock : matchProduct.stock
       })
    }
    if(coupon){
      coupon.usedBy.push({
        userId : user._id  , 
        orderId : order._id ,
        time : new Date(Date.now() ),
        })
        await coupon.save()     

    }
    await this.cardService.remove(user)


    return order.toJSON();
  }


  async confirmOrder({orderId}: OrderParamsDto , user:HUserDocument ):Promise<IOrder> {

    const order = await this.orderRepository.findOneAndUpdate({
      filter:{
        _id : generateToObjectId(orderId as unknown as string ) ,
        status: OrderStatusEnum.PENDING
      } ,
      update :{
        status: OrderStatusEnum.PLACED ,
        updatedBy : user._id 
      }
    })
    if(!order){
      throw new NotFoundException("Fail to find this order ❕")
    }

    return order.toJSON();
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
