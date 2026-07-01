import { Ack, ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway , WebSocketServer ,
    OnGatewayConnection , OnGatewayDisconnect } from "@nestjs/websockets";
import { Types } from "mongoose";
import {Socket, Server } from 'socket.io'
import { Auth, User } from "src/common/decorator";
import { RoleEnum } from "src/common/enums";
import { CacheService, getAuthSocket, TokenService } from "src/common/utils";
import type{ HUserDocument } from "src/DB/models";

@WebSocketGateway(80 , {cors : { origin : "*" }}  )
export class RealtimeGateway implements OnGatewayInit  , OnGatewayConnection , OnGatewayDisconnect{


    constructor( private  readonly tokenService : TokenService ,
        private readonly redisService  : CacheService){
    }
    @WebSocketServer()
    private server! : Server   // io

    afterInit( server : Server ){
        console.log("Gateway is Running 😎")
    }

    async handleConnection(client : Socket){
    try {
        console.log(`Connected :::${client.id}`)
        const result = await this.tokenService.decodeToken({ token : getAuthSocket(client)});
        const { user, decoded } = result;
        client.data = { user, decoded };
        await this.redisService.addSocket(user._id, client.id);
        
    } catch (error:any ) {
        client.emit("custom_error" , error.message )
        
    }
    }

    async handleDisconnect(client : Socket){
        try {
            console.log(`Disconnected :::${client.id}`)
                await this.redisService.removeSocket( client.data.user._id ,  client.id )
                    const connections =  await this.redisService.getSockets( client.data.user._id) || []
                    if(connections.length < 1 ){
                        this.server.emit("offline_user" ,{
                            userId:  client.data.user._id
                        })
                    }
            
        } catch (error:any) {
            client.emit("custom_error" , error.message )
        }
    }

    @Auth([RoleEnum.USER])
    @SubscribeMessage('sayHi')
    sayHi(
        @User() user : HUserDocument ,
        @MessageBody() body : any ,
        @Ack() ack: (response: { status: string; data: string }) => void,
        @ConnectedSocket() client : Socket
    ){

        console.log({body , client , user})
        ack({status : "Received" , data :"Hello from server "})
        this.server.emit('sayHi' , "jlhbibh")


    }

    changeStock (products : {productId : Types.ObjectId , stock : number } [] ){
        this.server.emit("stock" , products )



    }



}