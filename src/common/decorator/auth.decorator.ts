import { applyDecorators, UseGuards } from "@nestjs/common"
import { AuthenticationGuard, AuthorizationGuard } from "../guard"
import { RoleEnum, TokenTypeEnum } from "../enums"
import { Role } from "./role.decorator"
import { Token } from "./token.decorator"

export const Auth = (roles : RoleEnum[] , type : TokenTypeEnum = TokenTypeEnum.access)=>{

    return applyDecorators(
            Token(type) ,
            Role(roles) ,
            UseGuards(AuthenticationGuard , AuthorizationGuard)

    )


}