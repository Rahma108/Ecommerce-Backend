import { MongooseModule, Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CurrencyTypeEnum, OrderStatusEnum, PaymentTypeEnum } from 'src/common/enums';
import { ICoupon, IOrder, IOrderProduct, IUser } from 'src/common/interfaces';
import { generateSlug } from 'src/common/utils/slug';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strict: true,
  strictQuery: true,
})
export class Order implements IOrder{
  @Prop(
  {
    type :  raw(
      {
        userId : { type : Types.ObjectId , ref: 'User', required: true} ,
        time : {type : Date , required: true } ,
        note : {type : String , required: true }
      }
    ) ,
    required: false
    
  }
  )
  cancel?: { userId: Types.ObjectId | IUser; time: Date; note: String; } | undefined;

   @Prop({ type: String   })
   note?:string;
   @Prop([
    raw({
        productId : { type : Types.ObjectId , ref: 'Product', required: true} ,
        quantity : { type: Number , required: true , min : 0} ,
        unitAmount : { type: Number , required: true , min : 0}  ,
        total : { type: Number , required: true , min : 0}  ,

    })
  ])
   products! :IOrderProduct[]
  @Prop({ type: String , required : true  })
  address!: string;
  @Prop({ type: String , required : true  })
  phone!: string;
  @Prop({ type: String , unique : true ,  required : true  })
  orderId!: string;
  @Prop({ type: String   })
  intentId?: string | undefined;

  @Prop({ type: Date })
  paidAt?: Date | undefined;
  @Prop({ type: Date })
  refundedAt?: Date | undefined;

  @Prop({ type: Number,  min: 0   ,required : true  })
  total!: number | undefined;
  @Prop({ type: Number,  min: 0   ,required : true  })
  subtotal!: number;

  @Prop({ type: Number, enum : PaymentTypeEnum , default: PaymentTypeEnum.CASH  })
  paymentType!: PaymentTypeEnum;
  @Prop({ type: String , enum : CurrencyTypeEnum , default: CurrencyTypeEnum.EGP })
  currency!: CurrencyTypeEnum ;
  @Prop({ type: Number, enum : OrderStatusEnum , default: OrderStatusEnum.PENDING  })
  status!: OrderStatusEnum;


  @Prop({ type: Number,  min: 0   , default: 0 })
  discountPercent!: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Coupon'
  })
  couponId?: Types.ObjectId | ICoupon



  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: Types.ObjectId | IUser;

  @Prop({ type: Date , required: true  })
  createdAt!: Date ;
  @Prop({ type: Date })
  updatedAt?: Date | undefined;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  updatedBy!: Types.ObjectId | IUser;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: Date })
  restoredAt?: Date;
}
export const OrderMongooseSchema = SchemaFactory.createForClass(Order);


export const OrderModel = MongooseModule.forFeatureAsync([
  {
    name: Order.name,

    useFactory: () => {
      OrderMongooseSchema.pre(["find", "findOne"], function () {

        if (this.getQuery().paranoid == false) {
          this.setQuery({
            ...this.getQuery(),
          });
        } else {
          this.setQuery({
            ...this.getQuery(),
            deletedAt: { $exists: false }
          });
        }

      });
      OrderMongooseSchema.pre(["updateOne", "findOneAndUpdate"], function () {

        const update = this.getUpdate() as HydratedDocument<IOrder>;

        if (update.deletedAt) {
          this.getQuery().paranoid = true;

          this.setUpdate({
            ...this.getUpdate(),
            $unset: { restoredAt: 1 }
          });
        }

        if (update.restoredAt) {
          this.setQuery({
            ...this.getQuery(),
            paranoid: false,
            deletedAt: { $exists: true }
          });
        }

    });

      OrderMongooseSchema.pre(["deleteOne", "findOneAndDelete"], function () {

        if (this.getQuery().force == true ) {
  

          this.setQuery({
            ...this.getQuery(),
          });
        }else{
          this.setQuery({
            ...this.getQuery(),
            deletedAt: { $exists: true }
          });
        }

    });

    return OrderMongooseSchema;
    },
  },
]);
