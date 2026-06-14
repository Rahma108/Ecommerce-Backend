import { SetMetadata } from "@nestjs/common"
import { RoleEnum, TokenTypeEnum } from "../enums"

export const RoleName = "Roles"
export const Role = (roles : RoleEnum[] )=>{
    return SetMetadata(RoleName  , roles )
}