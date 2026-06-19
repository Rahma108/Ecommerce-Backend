import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { CartRepository } from 'src/common/repository/cart.repository';
import { ProductModel } from 'src/DB/models/product.model';
import { CartModel } from 'src/DB/models/cart.model';
import { ProductRepository } from 'src/common/repository/product.repository';

@Module({
  imports:[CartModel , ProductModel ],
  controllers: [CardController],
  providers: [CardService , CartRepository , ProductRepository ],
})
export class CardModule {}
