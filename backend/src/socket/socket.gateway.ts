
import { Inject, Logger, OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsResponse } from '@nestjs/websockets';
import { ChatsService } from "src/chats/chats.service";
import { ChatType } from "src/chats/entities/chat.entity";

@WebSocketGateway({ path: '/api', cors: true })
export class SocketGateway implements OnModuleInit, OnGatewayConnection {
	private readonly logger = new Logger(SocketGateway.name);
	private readonly rooms = new Map<string, Set<string>>();
  constructor(private readonly ChatsService: ChatsService) {}
  @WebSocketServer()
  private server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      console.log(`${socket.id} connected`);
	  this.handleConnection(socket);
	try {
	 	const roomList = await this.ChatsService.findAll();
		console.log(roomList);
	} 
	catch (error) {
		console.error('Error listing rooms:', error.message);
    }});
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('create-room')
  @Inject('ChatsService')
async onCreateRoom(@MessageBody() { roomName, client }: { roomName: string, client: string }){
	try {
		console.log("into create room",client);
		const createdRoom = await this.ChatsService.create({
			name: roomName,
			type: ChatType.CHANNEL,
			owner: parseInt(client),
		});
		this.server.emit('room-list', roomName);
		console.log('Room created:', createdRoom);
	} catch (error) {
		console.error('Error creating room:', error.message);
		this.server.emit('room-creation-error', error.message);
	}
}

//   @SubscribeMessage('list-rooms')
//   onListRooms(): { data: string[] } {
//     const roomList = [...this.rooms.keys()];
//     console.log('Room list requested:', roomList);
//     this.server.emit('room-list', roomList);
//     return { data: roomList };
//   }

@SubscribeMessage('join-room')
async onJoinRoom(client: Socket, message:{ roomName: string, socketID: string }): Promise<void> {
  try{
    console.log("message is:",message);
    console.log(`Join room: ${message.roomName}`);
    console.log(`Client ID: ${message.socketID}`);
  }
  catch (error) {
    console.error('Error joining room:', error.message);
  }
  try {
    const room = await this.ChatsService.findName(message.roomName);
    if (!room) {
      throw new Error(`Room ${message.roomName} not found.`);
    }
    client.join(message.roomName);
    console.log(`${message.socketID} joined room ${message.roomName}`);
    this.server.to(message.roomName).emit('user-joined', message.socketID);
  } catch (error) {
    console.error('Error joining room:', error.message);
    this.server.emit('room-join-error', error.message);
  }
}

  @SubscribeMessage('create-something')
  onCreateSomething(@MessageBody() data: any){
    console.log('Create something:', data);
    this.server.to(data.room).emit('something-created', data);
    return { event: 'something-created', data };
  }
}