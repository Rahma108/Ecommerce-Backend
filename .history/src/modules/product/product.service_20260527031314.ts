import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
    constructor() {}
    listProduct(){
        return {id : 1 , name : "IPhone"}
    }
}
