
import { Args,Mutation, Query, Resolver } from "@nestjs/graphql"
import { OneProductResponse, PaginateProductResponse, SayHiResponse } from "./entities/product.entity"
import { SayHiInputDto } from "./dto/create-product.dto"
import { Auth, User } from "src/common/decorator"
import { RoleEnum } from "src/common/enums"
import type{ HUserDocument } from "src/DB/models"
import { PaginateGQLDto } from "src/dto"
import { IPagination, IProduct } from "src/common/interfaces"
import { ProductService } from "./product.service"



@Resolver()
export class ProductResolver {
    constructor(private readonly productService : ProductService ){}
    // Find AlL Product  Graphql
    @Query(() => PaginateProductResponse)
    async allProducts(
    @Args() args: PaginateGQLDto,
    ): Promise<IPagination<IProduct>> {
    return this.productService.findAllProducts(args);
    }


    @Auth([RoleEnum.ADMIN])
    @Query( ()=> [SayHiResponse] , {description: "First Api" , name :"Welcome" , nullable : false })
    sayHi (
        @Args("data" , { type :()=>  SayHiInputDto,  nullable : true  }) data: SayHiInputDto,
        @User() user:HUserDocument
    ):{message : string  , age?: number }[] {
        return [{message : data.name, age : data.age }]
    }


    @Mutation( ()=> SayHiResponse , {description: "First Api" , name :"Welcome" , nullable : false })
    sayHi_ ():{message : string  , age?: number } {
        return {message : "Hello GQL " , age : 22}
    }
}