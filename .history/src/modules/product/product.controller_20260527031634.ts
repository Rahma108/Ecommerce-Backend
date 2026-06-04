import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  listProduct(){
    const product = this.productService.listProduct();
    return { message: 'Done', product };
  }
}
