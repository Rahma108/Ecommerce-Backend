import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto , RemoveItemsFromCardDto} from './dto/update-card.dto';
import{ PersonalCache, TTL, User } from 'src/common/decorator';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import type{ HUserDocument } from 'src/DB/models';
import { ICart } from 'src/common/interfaces';
import { CustomCartCacheInterceptor } from 'src/common/interceptor';

@Controller('cart')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() createCardDto: CreateCardDto , @User() user : HUserDocument ) : Promise<ICart>{
    return await this.cardService.create(createCardDto , user);
  }

  @UseGuards(AuthenticationGuard)
  @Patch("remove-items")
  async removeItemsFromCart(@Body()  removeItemsFromCardDto :RemoveItemsFromCardDto , @User() user : HUserDocument ) : Promise<ICart>{
    return await this.cardService.removeItemsFromCart(removeItemsFromCardDto , user);
  }
  @UseGuards(AuthenticationGuard)
    @Delete()
  async remove(@User() user : HUserDocument ) {
    return await  this.cardService.remove(user);
  }
  
  // Cache always get..
  @TTL(30)
  @PersonalCache(true)
  @UseInterceptors(CustomCartCacheInterceptor)
  @UseGuards(AuthenticationGuard)
  @Get()
  async findOne(@User() user : HUserDocument ): Promise<ICart> {
    return await  this.cardService.findOne(user);
  }


}
