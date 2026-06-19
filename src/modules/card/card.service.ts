import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { RemoveItemsFromCardDto, UpdateCardDto } from './dto/update-card.dto';
import { CartRepository } from 'src/common/repository/cart.repository';
import { ProductRepository } from 'src/common/repository/product.repository';
import { generateToObjectId } from 'src/common/utils';
import { HUserDocument } from 'src/DB/models';
import { ICart } from 'src/common/interfaces';
@Injectable()
export class CardService {
  constructor(
    private readonly cartRepository : CartRepository ,
    private readonly productRepository : ProductRepository 
  ){

  }
  async create({productId , quantity }: CreateCardDto ,  user : HUserDocument): Promise<ICart> {
    productId = generateToObjectId(productId as unknown as string )
    const product =  await this.productRepository.findOne({filter :{_id : productId  , stock : {$gte : quantity}}})
    if(!product) throw new NotFoundException('Missing product or out of stock ')
      let cart = await this.cartRepository.findOne({filter:{userId : user._id }})
    if(!cart) {
      return  await this.cartRepository.createOne({data:{userId : user._id  , products : [{productId , quantity}]}})
    }
    let matched : boolean =  false;
    for(const item of cart.products || [] ){
      if(item.productId.toString() == productId.toString() ){
        item.quantity += quantity ;
        item.quantity = item.quantity > 0 ? item.quantity : 1 ;
        matched = true ;

      }
    }
    if(!matched){
      cart.products.push({productId , quantity: quantity < 1 ? 1 : quantity  }) 
    }
    return await cart.save()
  }

    async removeItemsFromCart({productIds = [] }: RemoveItemsFromCardDto ,  user : HUserDocument): Promise<ICart> {
      productIds = productIds.map((id) => generateToObjectId(id as unknown as string))
    const cart = await this.cartRepository.findOneAndUpdate({
      filter :{ userId : user._id } ,
      update :{ 
        $pull : {products : {productId : {$in : productIds }} } 
      }
    })
    if(!cart) throw new NotFoundException("Cart Not Exist ❕")
  
    return cart.toJSON()
  }

  async remove(user : HUserDocument ) {
    return await this.cartRepository.deleteOne({filter : { userId : user._id }})
  }

  async findOne(user : HUserDocument ) :Promise<ICart>{
    const cart = await this.cartRepository.findOne({ filter : { userId : user._id }  , 
      options : { populate : [{path : "products.productId"}]}})
    if(!cart){
      throw new NotFoundException("Cart is Empty ❕ ")
    } 

  return cart.toJSON()
  }

}
