import { Float, ID, ObjectType } from "@nestjs/graphql";
import { Field, Int } from "@nestjs/graphql";
import { Types } from "mongoose";
import { IBrand, ICategory, IProduct, IUser } from "src/common/interfaces";

export class Product {}

@ObjectType()
export class SayHiResponse {
      @Field(()=> String , {nullable : false })
      message !: string ;


      @Field(()=> Int , {nullable : false })
      age !: number;

  }
  @ObjectType()
  export class OneProductResponse implements Partial<IProduct>{

      @Field(()=> ID )
        _id!: Types.ObjectId;
        @Field(()=> ID )
        categoryId!: Types.ObjectId | ICategory ;
        @Field(()=> ID )
        brandId!: Types.ObjectId | IBrand ;
      
        @Field(()=> ID , {nullable : true })
        updatedBy?: Types.ObjectId | IUser | undefined;
        @Field(()=> ID )
        createdBy!: Types.ObjectId | IUser ;
        @Field(()=> [ID] , {nullable : true } )
        notifyUsers?: Types.ObjectId[] | IUser[] ;


        @Field(()=> Float )
          originalPrice! : number ;
          @Field(()=> Float )
          salePrice! : number ;
          @Field(()=> Float )
          discountPercentage!: number;
          @Field(()=> Float )
          finalPrice! : number;
          @Field(()=> Int )
          stock!: number ;
          @Field(()=> Int  , {nullable : true })
          rating?: number | undefined;

          @Field(()=> String )
          name!: string;
          @Field(()=> String )
          description!: string;
          @Field(()=> String )
          slug!: string;
          @Field(()=> String )
          image!: string;
          @Field(()=> String )
          productId!: string ;

          @Field(()=> [String] , {nullable : true } )
          gallery?:string[] | undefined ;


          
          @Field(()=> String)
          createdAt!: Date;
          @Field(()=> String , {nullable : true })
          updatedAt?: Date;
          @Field(()=> String , {nullable : true })
          deletedAt?: Date;
          @Field(()=> String , {nullable : true })
          restoredAt?: Date;

        
    

}

@ObjectType()
export class PaginateProductResponse{


        @Field(()=> [OneProductResponse ])
        docs !:IProduct[] ;
        @Field(()=> Int , {nullable : true })
        currentPage? :  number| undefined ;
        @Field(()=> Int , {nullable : true })
        pages :  number  | undefined;
        @Field(()=> Int , {nullable : true })
        size ?:  number  | undefined;
    

}
