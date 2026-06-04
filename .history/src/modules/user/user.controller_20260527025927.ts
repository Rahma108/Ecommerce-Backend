import { Controller } from "@nestjs/common";

@Controller('user')
export class UserController {
    constructor(private readonly userService : User){

        @Get()
        profile(){
            const user = 
            return {message :"Done" , data :{user}} 
        }

    }
}