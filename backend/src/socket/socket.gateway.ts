import { OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsResponse } from '@nestjs/websockets';

@WebSocketGateway({ path: '/api', cors: true })
export class SocketGateway implements OnModuleInit, OnGatewayConnection {
@WebSocketServer()
private server: Server

onModuleInit() {
	this.server.on('connection', (socket: Socket) => {
	console.log(`${socket.id} connected`);
	});
}

handleConnection(client: Socket) {
	console.log(`${client.id} connected handleconnection`);

	const userId = client.id;
	const room = 'bob place';

	client.join(room);
	console.log(client.id, " logged on room ", room);
	this.server.to(room).emit('broadcast', "fuck this shit, are you there");
};

@SubscribeMessage('newMessage')
onNewMessage(@MessageBody() body) {
	console.log(body)
}

@SubscribeMessage('create-something')
onCreateSomething(@MessageBody() body) {
	console.log("Websocket body: ", body, " bodyroom ", body.room)
	// this.server.emit('srv-message', body);
	this.server.to('bob place').emit('srv-message', body);
	}
}
