import { SetMetadata } from "@nestjs/common"
import { RoleEnum, TokenTypeEnum } from "../enums"

export const ttlName = "CacheTTL"
export const TTL = (value : number = 10   )=>{
    return SetMetadata(ttlName ,  value )
}


export const PersonalCacheName = "PersonalCacheName"
export const PersonalCache = (value : boolean = false )=>{
    return SetMetadata(PersonalCacheName ,  value )
}