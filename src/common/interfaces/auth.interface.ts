import type { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HUserDocument } from "src/DB/models";

export interface IAuthReq extends Request {
    credentials:{user: HUserDocument , decoded : JwtPayload}

}