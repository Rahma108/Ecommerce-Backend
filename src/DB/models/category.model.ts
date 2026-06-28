import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IBrand, ICategory, IUser } from 'src/common/interfaces';
import { generateSlug } from 'src/common/utils/slug';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strict: true,
  strictQuery: true,
})
export class Category {

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
    ref: 'Brand',
    required: false,
  })
   brandIds? : Types.ObjectId[] | IBrand[];

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
export const CategoryMongooseSchema = SchemaFactory.createForClass(Category);


export const CategoryModel = MongooseModule.forFeatureAsync([
  {
    name: Category.name,

    useFactory: () => {
      CategoryMongooseSchema.pre(["find", "findOne"], function () {

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
      CategoryMongooseSchema.pre(["updateOne", "findOneAndUpdate"], function () {

        const update = this.getUpdate() as HydratedDocument<ICategory>;

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

      CategoryMongooseSchema.pre(["deleteOne", "findOneAndDelete"], function () {

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


    CategoryMongooseSchema.pre("save", function () {

        if ( this.isModified("name") ) {
            this.slug = generateSlug(this.name)
        }

      });


    return CategoryMongooseSchema;
    },
  },
]);
