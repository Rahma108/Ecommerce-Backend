import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IBrand, IUser } from 'src/common/interfaces';
import { generateSlug } from 'src/common/utils/slug';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strict: true,
  strictQuery: true,
})
export class Brand {

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
  deletedAt?: Date;

  @Prop({ type: Date })
  restoredAt?: Date;
}
export const BrandMongooseSchema = SchemaFactory.createForClass(Brand);


export const BrandModel = MongooseModule.forFeatureAsync([
  {
    name: Brand.name,

    useFactory: () => {
      BrandMongooseSchema.pre(["find", "findOne"], function () {

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
      BrandMongooseSchema.pre(["updateOne", "findOneAndUpdate"], function () {

        const update = this.getUpdate() as HydratedDocument<IBrand>;

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

      BrandMongooseSchema.pre(["deleteOne", "findOneAndDelete"], function () {

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


    BrandMongooseSchema.pre("save", function () {

        if ( this.isModified("name") ) {
            this.slug = generateSlug(this.name)
        }

      });


    return BrandMongooseSchema;
    },
  },
]);
