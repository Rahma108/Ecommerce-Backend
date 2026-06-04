import { Controller } from "@nestjs/common";

@Controller('user')
export class UserController {
    constructor(){

        @Get()
        profile(){
            return {message :"Done" , data :} 
        }

    }
}