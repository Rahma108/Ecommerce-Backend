import { Controller } from "@nestjs/common";

@Controller('user')
export class UserController {
    constructor(private readonl){

        @Get()
        profile(){
            const user = 
            return {message :"Done" , data :{user}} 
        }

    }
}