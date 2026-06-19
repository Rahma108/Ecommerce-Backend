import { MongooseModule, Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {  ICart, ICartProduct, IUser } from 'src/common/interfaces';
import { generateSlug } from 'src/common/utils/slug';

export type CartDocument = HydratedDocument<Cart>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strict: true,
  strictQuery: true,
  collection:"CARTS"
})
export class Cart {
  @Prop({
    type: Types.ObjectId,
    ref: 'USERS',
    required: true,
  })
  userId!: Types.ObjectId | IUser;

  
    @Prop([raw({
      productId: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number , min : 1 , default : 1  }
    })])
  products!:ICartProduct[];



}
export const CartMongooseSchema = SchemaFactory.createForClass(Cart);

export const CartModel = MongooseModule.forFeature([{name : Cart.name  , schema : CartMongooseSchema }]);
