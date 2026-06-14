import { BadRequestException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import type {Request} from 'express'
import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { IFile } from "../interfaces";
export const fileFieldValidation = {
    image:['image/jpeg' , 'image/jpg' , 'image/png' ],
    video:['video/mp3', 'video/mp4']
}
export const LocalMulter = (
    {
       validation = [] ,
       folder = "public" ,
       fileSize = 2 
    }:{
        validation? : string[] ,
        folder?:string,
        fileSize ?:number 
    }
)=>{
        return {
        storage : diskStorage(
            {
            destination(req:Request, file: IFile, callback:Function) {
                const fullPath =  resolve(`./uploads/${folder}`)
                if(!existsSync(fullPath)){
                    mkdirSync(fullPath , {recursive : true })

                }
                return callback(null , fullPath)
            },
            filename(req:Request, file: IFile, callback:Function) {
                const uniqueFileName = randomUUID()+ "_" + file.originalname ;
                file.finalPath  = `uploads/${folder}`
                callback(null , uniqueFileName )
            },
            }
        ) ,
        fileFilter(req:Request, file: IFile, callback:Function){
            if (!['image/jpeg'].includes(file.mimetype)) {
            return callback(new BadRequestException("Invalid File Format ❌"), false);
    }
    return callback(null, true);
        },
        limits:{fileSize : 2  * 1024 * 1024 }
    }}
