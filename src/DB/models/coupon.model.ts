import { MongooseModule, Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CouponTypeEnum } from 'src/common/enums';
import { ICoupon, IUser } from 'src/common/interfaces';
import { generateSlug } from 'src/common/utils/slug';

export type HCouponDocument = HydratedDocument<ICoupon>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strict: true,
  strictQuery: true,
})
export class Coupon implements ICoupon{
  @Prop({type : Date , required: true })
  startDate!: Date;
  @Prop({type : Date , required: true })
  endDate!: Date;
  @Prop({type :Number , min : 0 , required: true })
  discount!: number;
  @Prop({type :Number , min : 1 ,  default: 1 , required: true })
  duration!: number;
  @Prop({type :Number , enum:CouponTypeEnum , default: CouponTypeEnum.PERCENTAGE })
  type!: CouponTypeEnum;
  @Prop({
    type : [
    raw({
      userId : {type : Types.ObjectId , ref: "User" , required: true},
      orderId : {type : Types.ObjectId , ref: "Order" , required: true},
      time :{type :Date , required: true}
    })
  ] ,
    required : false 
  })
  usedBy!: { userId: Types.ObjectId; time: Date; orderId : Types.ObjectId  }[];

  
  

  @Prop({
    type: String,
    required: true,
    unique: true,
    minLength: 2,
    maxLength: 50,
  })
  name!: string;

  @Prop({ type: String })
  slug!: string;

  @Prop({ type: String })
  image!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: Types.ObjectId | IUser;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  updatedBy!: Types.ObjectId | IUser;

  
  @Prop({ type: Date })
  updatedAt?: Date | undefined;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: Date })
  restoredAt?: Date;
}
export const CouponMongooseSchema = SchemaFactory.createForClass(Coupon);


export const CouponModel = MongooseModule.forFeatureAsync([
  {
    name: Coupon.name,

    useFactory: () => {
      CouponMongooseSchema.pre(["find", "findOne"], function () {

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
      CouponMongooseSchema.pre(["updateOne", "findOneAndUpdate"], function () {

        const update = this.getUpdate() as HydratedDocument<ICoupon>;

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

      CouponMongooseSchema.pre(["deleteOne", "findOneAndDelete"], function () {

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


    CouponMongooseSchema.pre("save", function () {

        if ( this.isModified("name") ) {
            this.slug = generateSlug(this.name)
        }

      });


    return CouponMongooseSchema;
    },
  },
]);
