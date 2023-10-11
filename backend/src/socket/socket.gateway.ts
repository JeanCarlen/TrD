import { Inject, Logger, OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsResponse } from '@nestjs/websockets';
import { ChatsService } from "src/chats/chats.service";
import { ChatType } from "src/chats/entities/chat.entity";
import { create } from "domain";
import { RouterModule } from "@nestjs/core";

// Define the WebSocketGateway and its path and CORS settings
@WebSocketGateway({ path: '/api', cors: true })
export class SocketGateway implements OnModuleInit, OnGatewayConnection {
    // Define a logger and a map of rooms
    private readonly logger = new Logger(SocketGateway.name);
    private readonly rooms = new Map<string, Set<string>>();
    
    // Inject the ChatsService into the constructor
    constructor(private readonly ChatsService: ChatsService) {}
    
    // Define the WebSocketServer and an array of clients
    @WebSocketServer()
    private server: Server;
    private clients: Socket[] = [];

    // Define the onModuleInit method to handle connections and list rooms
    onModuleInit() {
        this.server.on('connection', async (socket: Socket) => {
            console.log(`${socket.id} connected`);
            this.handleConnection(socket);
            // try {
            //     const roomList = await this.ChatsService.findAll();
            //     console.log(roomList);
            // } catch (error) {
            //     console.error('Error listing rooms:', error.message);
            // }
        });
    }

    // Define the handleConnection method to log when a client connects
    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    // Define the handleDisconnect method to log when a client disconnects
    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);	
    }
    
    // Define the onPongInitSetup method to handle joining a game
    @SubscribeMessage('join-game')
    async onPongInitSetup(client: Socket, message: { roomName: string }) {
        console.log("into pong init setup, message is ", message);
        this.clients.push(client);
        client.join(message.roomName);
        client.emit('pong-init-setup', this.clients.length);
        if (this.clients.length == 2) {
            console.log("into if, roomName is ", message.roomName);
            // this.server.to(message.roomName).emit('pong-init-setup done for', message.roomName);
            this.server.to(message.roomName).emit('game-start', message.roomName);
        }
    }

    @SubscribeMessage('exchange-info')
    onExchangeInfo(client: Socket, data: { myId : number, myName : string, myAvatar : string, roomName: string }) {
        console.log("into exchange info ->", data);
        this.server.to(data.roomName).emit('exchange-info', data);
    }

    // Define the onGameOver method to handle when a game is over
    @SubscribeMessage('game-over')
    onGameOver(client: Socket, message: { player : string, roomName: string }) {
        console.log("into game over");
        this.server.to(message.roomName).emit('game-over', message);
        const index = this.clients.indexOf(client);
        if (index !== -1) {
            this.clients.splice(index, 1);
        }
        this.handleDisconnect(client);
    }

    // Define the onPaddleMovement method to handle paddle movement
    @SubscribeMessage('paddle-movement')
    onPaddleMovement(client: Socket, message: { player : string, y : number, roomName: string }) {
        console.log("into paddle movement");
        this.server.to(message.roomName).emit('paddle-movement', message);
    }

    // Define the onGoal method to handle when a goal is scored
    @SubscribeMessage('goal')
    onGoal(client: Socket, data: { score1: number, score2: number, roomName: string }) {
        if(data.score1 < 10 || data.score2 < 10) {
            console.log("into goal");
            const gameState = {
                ballX: 100,
                ballY: 100,
                ballSpeedX: 3,
                ballSpeedY: 5,
                UpPaddle: 100,
                DownPaddle: 500
            };
            this.server.emit('reset', gameState);
        };
        if(data.score1 == 10 || data.score2 == 10) {
            console.log("into goal");
            this.server.to(data.roomName).emit('game-over', data);
        }
    }

    // Define the onRebond method to handle ball rebond
    @SubscribeMessage('srv-bounce')
    onRebond(client: Socket, data: { ballSpeedX: number, ballSpeedY: number, roomName: string }) {
        console.log("into bounce");
        data.ballSpeedX = data.ballSpeedX * -1;
        data.ballSpeedY = data.ballSpeedY * -1;
        this.server.to(data.roomName).emit('bounce', data);
    }

    // Define the onCreateRoom method to handle creating a chat room
    @SubscribeMessage('create-room')
    @Inject('ChatsService')
    async onCreateRoom(@MessageBody() { roomName, client }: { roomName: string, client: string }) {
        try {
            console.log("into create room",client);
            const createdRoom = await this.ChatsService.create({
                name: roomName,
                type: ChatType.CHANNEL,
                owner: parseInt(client),
            });
            console.log('Room created:', roomName);
            const roomList = await this.ChatsService.findAllFromSocket();
            console.log(roomList);
        } catch (error) {
            console.error('Error creating room:', error.message);
            this.server.emit('room-creation-error', error.message);
        }
    }

    // Define the onJoinRoom method to handle joining a chat room
    @SubscribeMessage('join-room')
    async onJoinRoom(client: Socket, message:{ roomName: string, socketID: string }): Promise<void> {
        try {
            console.log("message is:",message);
            console.log(`Join room: ${message.roomName}`);
            console.log(`Client ID: ${message.socketID}`);
        } catch (error) {
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

    // Define the onCreateSomething method to handle creating something
    @SubscribeMessage('create-something')
    onCreateSomething(@MessageBody() data: any) {
        console.log('Create something:', data);
        this.server.to(data.room).emit('srv-message', data);
    }
}