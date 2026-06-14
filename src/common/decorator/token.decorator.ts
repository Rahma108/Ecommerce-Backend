import { SetMetadata } from "@nestjs/common"
import { TokenTypeEnum } from "../enums"

export const tokenTypeName = "tokenType"
export const Token = (tokenType:TokenTypeEnum = TokenTypeEnum.access )=>{
    return SetMetadata(tokenTypeName ,  tokenType )
}