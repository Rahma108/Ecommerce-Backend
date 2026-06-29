import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IBrand, ICategory, IProduct, IUser } from 'src/common/interfaces';
import { generateSlug } from 'src/common/utils/slug';

export type HProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strict: true,
  strictQuery: true,
})
export class Product {

  @Prop({
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  })
  name!: string;

  @Prop({
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50000,
  })
  description!: string;

  @Prop({ type: String })
  slug!: string;

  @Prop({ type: String , required: true  })
  productId!: string;

  @Prop({ type: String })
  image!: string;

  @Prop({ type: [String] })
  gallery?: string[];

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: Types.ObjectId | IUser;

    @Prop({
    type: Types.ObjectId,
     ref: 'User',
    required: false,
  })
  notifyUser? : Types.ObjectId[] | IUser[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Brand',
    required: true,
  })
  brandId! : Types.ObjectId | IBrand ;
  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  categoryId !:Types.ObjectId | ICategory ;


  @Prop({ type: Number , required: true  , min : 0  })
  stock! : number;
 @Prop({ type: Number , max: 5  , min : 0  })
  rating? : number ;

  @Prop({ type: Number , required: true , min : 0  })
  originalPrice !: number ;
  @Prop({ type: Number , required: true  , min : 0  })
  salePrice !: number ;
  @Prop({ type: Number , default: 0 , min : 0 , max: 100  })
  discountPercentage!: number
  @Prop({ type: Number , required: true , min : 0  })
  finalPrice !: number ;

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
export const ProductMongooseSchema = SchemaFactory.createForClass(Product);


export const ProductModel = MongooseModule.forFeatureAsync([
  {
    name: Product.name,

    useFactory: () => {
      ProductMongooseSchema.pre(["find", "findOne"], function () {

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
      ProductMongooseSchema.pre(["updateOne", "findOneAndUpdate"], function () {

        const update = this.getUpdate() as HydratedDocument<IProduct>;

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

      ProductMongooseSchema.pre(["deleteOne", "findOneAndDelete"], function () {

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


    ProductMongooseSchema.pre("save", function () {

        if ( this.isModified("name") ) {
            this.slug = generateSlug(this.name)
        }

      });


    return ProductMongooseSchema;
    },
  },
]);
