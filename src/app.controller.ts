import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import {pipeline} from 'node:stream'
import { promisify } from 'node:util';
import type { Request, Response } from 'express';
import { S3Service } from './common/utils';
const s3WriteStream = promisify(pipeline)

@Controller()
export class AppController {
  constructor(private readonly appService: AppService , 
    private readonly s3Service: S3Service
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("uploads/*path")
  async getFile(@Req() req : Request , @Res() res:Response ){
        const {download , fileName } = req.query as {download : string , fileName : string }
        const {path} = req.params as {path : string [] }
        const key = path.join("/");
        const { Body, ContentType } = await this.s3Service.getAsset({
            Key: key
        });
        res.setHeader(
        "Content-Type",
        ContentType || "application/octet-stream"
    );
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    if(download === "true"){
        res.setHeader("Content-Disposition", `attachment; filename="${ fileName || key.split("/").pop()}"`); // only apply it for  download
    }
        return await s3WriteStream(Body as NodeJS.ReadableStream , res  ) 
        // return successResponse({res , data:{params : req.params ,  key , data:{Body , ContentType } } , status:200 })




  }

  @Get("pre-signed/*path")
  async getFileLink(@Req() req : Request  ){
        const {download , fileName } = req.query as {download : string , fileName : string } 
        const {path} = req.params as {path : string [] }
        const Key = path.join("/");
        return  await this.s3Service.createPreSignedFetchLink({Key , download , fileName })
  }

}
