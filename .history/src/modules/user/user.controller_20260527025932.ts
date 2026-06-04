import { Controller } from "@nestjs/common";

@Controller('user')
export class UserController {
    constructor(private readonly userService : UserS){

        @Get()
        profile(){
            const user = 
            return {message :"Done" , data :{user}} 
        }

    }
}