import { OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ path: '/api', cors: true} )
export class SocketGateway implements OnModuleInit{
	@WebSocketServer()
	private server: Server

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(`${socket.id} conected`);
		})
	}
	
	@SubscribeMessage('newMessage')
	onNewMessage(@MessageBody() body) {
		console.log(body)
	}

	@SubscribeMessage('create-something')
	onCreateSomething(@MessageBody() body) {
		console.log("Websocket body: ", body)
		this.server.emit('srv-message', "Message from server")
		// return {
		// 	event: 'srv-message',
		// 	data: "Should be a response logged on the frontend console"
		// }
	}
}