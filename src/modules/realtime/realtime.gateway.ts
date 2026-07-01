import { Ack, ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway , WebSocketServer ,OnGatewayConnection , OnGatewayDisconnect } from "@nestjs/websockets";
import {Socket , Server } from 'socket.io'

@WebSocketGateway()
export class RealtimeGateway implements OnGatewayInit  , OnGatewayConnection , OnGatewayDisconnect{

    @WebSocketServer()
    server! : Server   // io

    afterInit( server : Server ){
        console.log("Gateway is Running 😎")
    }

    handleConnection(client : Socket){
        console.log(`Connected :::${client.id}`)
    }

    handleDisconnect(client : Socket){
        console.log(`Disconnected :::${client.id}`)
    }

    @SubscribeMessage('sayHi')
    sayHi(
        @MessageBody() body : any ,
        @Ack() ack: (response: { status: string; data: string }) => void,
        @ConnectedSocket() client : Socket
    ){

        console.log({body , client })
        ack({status : "Received" , data :"Hello from server "})
        this.server.emit('sayHi' , "jlhbibh")


    }



}