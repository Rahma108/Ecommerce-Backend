import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderParamsDto } from './dto/create-order.dto';
import { CheckoutOrderDto, CheckoutOrderParamsDto, UpdateOrderDto } from './dto/update-order.dto';
import { RoleEnum } from 'src/common/enums';
import { Auth, User } from 'src/common/decorator';
import type { HUserDocument } from 'src/DB/models';
import { IOrder } from 'src/common/interfaces';
import type{ Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService,
  ) {}

  @Auth([RoleEnum.USER])
  @Post()
  create(@Body() createOrderDto: CreateOrderDto , 
          @User() user: HUserDocument ) :Promise<IOrder>{
    return this.orderService.create(createOrderDto , user );
  }


  @Auth([RoleEnum.ADMIN])
  @Patch("/:orderId/confirm")
  confirmOrder(@Param() orderParamsDto: OrderParamsDto , 
          @User() user: HUserDocument ) :Promise<IOrder>{
    return this.orderService.confirmOrder( orderParamsDto , user );
  }


  @Auth([RoleEnum.USER])
  @Post("/:orderId/checkout")
  checkout(@Param() checkoutOrderParamsDto: CheckoutOrderParamsDto, 
          @Body() body :  CheckoutOrderDto ,
          @User() user: HUserDocument ) :Promise<any>{
    return this.orderService.checkout( checkoutOrderParamsDto , body , user );
  }

  @Post("/webhook")
  webhook(@Req() req : Request) :Promise<any>{
    return this.orderService.webhook( req);
  }


  @Auth([RoleEnum.ADMIN])
  @Patch("/:orderId/cancel")
  cancel(@Param() orderParamsDto: OrderParamsDto , 
          @User() user: HUserDocument ) :Promise<IOrder>{
    return this.orderService.cancel( orderParamsDto , user );
  }
   


  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
