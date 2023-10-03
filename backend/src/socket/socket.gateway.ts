import { Inject, OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsResponse } from '@nestjs/websockets';
import { ChatsService } from "src/chats/chats.service";
import { ChatType } from "src/chats/entities/chat.entity";

@WebSocketGateway({ path: '/api', cors: true })
export class SocketGateway implements OnModuleInit, OnGatewayConnection {
	constructor(private readonly ChatsService: ChatsService) {}
@WebSocketServer()
private server: Server;
private rooms: Map<string, Set<string>> = new Map();

onModuleInit() {
	this.server.on('connection', (socket: Socket) => {
	console.log(`${socket.id} connected`);
	});
}

handleConnection(client: Socket) {
	console.log(`${client.id} connected handleconnection`);

	client.on('disconnect', () => {
	console.log(`${client.id} disconnected`);
	});
}


@SubscribeMessage('create-room')
@Inject('ChatsService')
async onCreateRoom(@MessageBody() roomName: string) {
	try {
	const createdRoom = await this.ChatsService.create({
		name: roomName,
		type: ChatType.CHANNEL,
	});

	this.server.emit('room-created', createdRoom);
	} catch (error) {
	console.error('Error creating room:', error.message);
	this.server.emit('room-creation-error', error.message);
	}
}

@SubscribeMessage('list-rooms')
onListRooms() {
	const roomList = [...this.rooms.keys()];
	this.server.emit('room-list', roomList);
}

@SubscribeMessage('join-room')
onJoinRoom(@MessageBody() { userId, room }: { userId: string; room: string }) {
	// Add the user to the specified room
	console.log("join body: ", userId, " room ", room)
}

@SubscribeMessage('create-something')
onCreateSomething(@MessageBody() { userId, room, body }: { userId: string; room: string; body: any}) {
	console.log("Websocket body: ", body, " bodyroom ", body.room)

	// Modify this part to include room information
	this.server.to(body.room).emit('srv-message', body);
}
}
