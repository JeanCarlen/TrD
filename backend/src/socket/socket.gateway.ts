import { ConsoleLogger, Inject, Logger, OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsResponse } from '@nestjs/websockets';
import { ChatsService } from "src/chats/chats.service";
import { ChatType } from "src/chats/entities/chat.entity";
import { create } from "domain";
import { RouterModule } from "@nestjs/core";
import { UserchatsService } from "src/userchats/userchats.service";
import { MessagesService } from "src/messages/messages.service";
import { ChatadminsService } from "src/chatadmins/chatadmins.service";
import { error } from "console";

// Define the WebSocketGateway and its path and CORS settings
@WebSocketGateway({ path: '/api', cors: true })
export class SocketGateway implements OnModuleInit, OnGatewayConnection {
    // Define a logger and a map of rooms
    private readonly logger = new Logger(SocketGateway.name);
    // private readonly rooms = new Map<string, Set<string>>();
	private readonly maxScore: number = 3;
    
    // Inject the ChatsService into the constructor
    constructor(private readonly ChatsService: ChatsService,
                private readonly UserchatsService: UserchatsService,
                private readonly MessageService: MessagesService,
                private readonly ChatadminsService: ChatadminsService) {}

    // Define the WebSocketServer and an array of clients
    @WebSocketServer()
    private server: Server;
    private WaitList: Socket[] = [];
	private Waitlist_bonus: Socket[] = [];
    // Define the onModuleInit method to handle connections and list rooms
    onModuleInit() {
        this.server.on('connection', async (socket: Socket) => {
            console.log(`${socket.id} connected`);
            this.handleConnection(socket);
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
        client.join(message.roomName);
        const room = this.server.sockets.adapter.rooms.get(message.roomName);
        console.log("size is ", room.size);
        if (room != undefined && room.size >= 2) {
            console.log("into if, roomName is ", message.roomName);
            client.emit('pong-init-setup', room.size);
            this.server.to(message.roomName).emit('game-start', message.roomName);
        }
        else {
            client.emit('pong-init-setup', room.size);
        }
    }

    @SubscribeMessage('waitList')
    async onWaitList(client: Socket, message: { bonus: number }) {
        console.log("into wait list");
		try {
			if(message.bonus == 0)
			{
				const userInWaitList = this.WaitList.find((one) => (one.id === client.id));
				if (userInWaitList === undefined)
				{
					this.WaitList.push(client);
				}
				else
				{
					console.log('Found:', userInWaitList.id)
					throw new Error(`User already in wait list`);
				}
				if(this.WaitList !== undefined && this.WaitList.length >= 2)
				{
					const roomName = this.WaitList[0].id + this.WaitList[1].id;
					await this.onPongInitSetup(this.WaitList[0], {roomName: roomName});
					await this.onPongInitSetup(this.WaitList[1], {roomName: roomName});
					this.WaitList.pop();
					this.WaitList.pop();
				}
			}
			if(message.bonus == 1)
			{
				const userInWaitList = this.Waitlist_bonus.find((one) => (one.id === client.id));
				if (userInWaitList === undefined)
				{
					this.Waitlist_bonus.push(client);
				}
				else
				{
					console.log('Found:', userInWaitList.id)
					throw new Error(`User already in wait list`);
				}
				if(this.Waitlist_bonus !== undefined && this.Waitlist_bonus.length >= 2)
				{
					const roomName = this.Waitlist_bonus[0].id + this.Waitlist_bonus[1].id;
					await this.onPongInitSetup(this.Waitlist_bonus[0], {roomName: roomName});
					await this.onPongInitSetup(this.Waitlist_bonus[1], {roomName: roomName});
					this.Waitlist_bonus.pop();
					this.Waitlist_bonus.pop();
				}
			}
		} catch (error) {
			console.log('Error joining wait list:', error.message);
			this.WaitList.map((client) => {console.log(client.id)});
			this.server.to(client.id).emit('room-join-error', {error: error.message, reset: true});
		}
    }

    @SubscribeMessage('delete-channel')
    onDeleteChannel(client: Socket, data: { chat_id: number, roomName: string }) {
        console.log("into delete channel ->", data.chat_id, data.roomName);
        this.server.to(data.roomName).emit('deleted', data);
    }

	@SubscribeMessage('ready')
	async onReady(@MessageBody() data: {roomName:string})
	{
		console.log('ready for room:', data.roomName);
		this.server.to(data.roomName).emit('ready');
		//wait 5 seconds
		//this.server.to(data.roomName).emit('go');
	}

    @SubscribeMessage('exchange-info')
    onExchangeInfo(client: Socket, data: { myId : number, myName : string, myAvatar : string, roomName: string, playerNumber: number }) {
        console.log("into exchange info ->", data);
        this.server.to(data.roomName).emit('exchange-info', data);
    }

    // Define the onGameOver method to handle when a game is over
    @SubscribeMessage('game-over')
    onGameOver(client: Socket, message: { roomName: string }) {
        console.log("into game over");
        this.server.to(message.roomName).emit('leave-game', message);
//        this.handleDisconnect(client);
    }

    // Define the onPaddleMovement method to handle paddle movement
    @SubscribeMessage('paddle-movement')
    onPaddleMovement(client: Socket, data: {roomName:string, playerNumber: number, pos_x: number, newDir: number, speed: number}) {
        data.pos_x = data.pos_x + (data.newDir * data.speed);
        this.server.to(data.roomName).emit('paddle-send', {playerNumber: data.playerNumber, pos_x: data.pos_x});
    }

    // Define the onGoal method to handle when a goal is scored
    @SubscribeMessage('goal')
    onGoal(client: Socket, data: { score1: number, score2: number, roomName: string }) {
        if(data.score1 < this.maxScore && data.score2 < this.maxScore) {
			console.log('goal scored');
            this.server.to(data.roomName).emit('goal', {score1: data.score1, score2: data.score2});
        };
        if(data.score1 == this.maxScore || data.score2 == this.maxScore) {
            this.server.to(data.roomName).emit('game-over',  {score1: data.score1, score2: data.score2});
        }
    }

    @SubscribeMessage('bonus')
    onBonus(client: Socket, data: { roomName: string, playerNumber: number }) {
        console.log("into bonus");
        this.server.to(data.roomName).emit('bonus-player', data);
    }

    // Define the onCreateRoom method to handle creating a chat room
    @SubscribeMessage('create-room')
    @Inject('ChatsService')
    async onCreateRoom(client: Socket, message: { roomName: string, client: string, Password: string | null }) {
		try {
			const roomList = await this.ChatsService.findAllFromSocket();
			console.log('create room:',roomList);
			roomList.map((room) => {
				if (room.name == message.roomName) {
					throw new Error(`Room already exists`);
				}
			}
			);
			const createdRoom = await this.ChatsService.create({
                name: message.roomName,
                type: ChatType.CHANNEL,
                owner: parseInt(message.client),
                password: message.Password,
            });
            console.log('Room created:', message.roomName);
			await this.onJoinRoom(client, { roomName: message.roomName, socketID: client.id, client: parseInt(message.client), password: message.Password });
            this.ChatadminsService.create({user_id: parseInt(message.client), chat_id: createdRoom.id});
        } catch (error) {
            console.error('Error creating room:', error.message);
			this.server.to(client.id).emit('room-join-error', {error: error.message, reset: true});
        }
    }

	@SubscribeMessage('leave-room')
	@Inject('UserchatsService')
	async onLeaveRoom(client: Socket, message:{ id : number, roomName : string}): Promise<void> {
		console.log("into leave room", message);
		console.log ("logging the service " , await this.UserchatsService.remove(message.id));
        this.server.to(message.roomName).emit('smb-moved');
		this.server.to(message.roomName).emit('smb-movede');
        client.leave(message.roomName);
		console.log( message.id , ` left room ${message.roomName}`);
	}

    // Define the onJoinRoom method to handle joining a chat room
    @SubscribeMessage('quick-join-room')
	async onQuickJoinRoom(client: Socket, message:{ roomName: string, socketID: string, client: number}): Promise<void> {
		try {
			const chats = await this.ChatsService.findName(message.roomName);
			if (!chats) {
				throw new Error(`Room ${message.roomName} not found.`);
			}
			if (await this.ChatsService.isUserBanned(chats.id, message.client) === true)
			{
				throw new Error(`You are banned from ${message.roomName}.`);
			}
			if (chats.password != null) {
				throw new Error(`protected`);
			}
			client.join(message.roomName);
		}
		catch (error) {
			console.error('Error joining room:', error.message);
			if (error.message !== 'Already in room' || 'protected') {
				this.server.to(client.id).emit('room-join-error', {error: error.message, reset: true});
			}
		}
	}


    @SubscribeMessage('join-room')
	@Inject('ChatsService')
	@Inject('UserchatsService')
    async onJoinRoom(client: Socket, message:{ roomName: string, socketID: string, client: number, password: string | null }): Promise<void> {
	try {
            const chats = await this.ChatsService.findName(message.roomName);
            if (!chats) {
                throw new Error(`Room ${message.roomName} not found.`);
            }
			if (await this.ChatsService.isUserBanned(chats.id, message.client) === true)
			{
				throw new Error(`You are banned from ${message.roomName}.`);
			}
            if (chats.password != message.password) {
                throw new Error(`Wrong password.`);
            }
            client.join(message.roomName);
			const list = await this.UserchatsService.findByChatId(chats.id);
			list.map((userchat) => {
                if (userchat.user_id == message.client) {
                    console.log(`User ${message.client} already in room ${message.roomName}.`);
                    throw new Error(`Already in room`);
                }});
			await this.UserchatsService.create({user_id: message.client, chat_id: chats.id});
            this.server.to(message.roomName).emit('smb-moved');
            console.log("sent smb joined");
        } catch (error) {
            console.error('Error joining room:', error.message);
            if (error.message !== 'Already in room') {
				this.server.to(client.id).emit('room-join-error', {error: error.message, reset: true});
			}
        }
    }

	@SubscribeMessage('refresh')
	onRefresh(client: Socket, message:{ roomName: string, type: string}): void {
		console.log("into refresh");
		this.server.to(message.roomName).emit(`refresh-${message.type}`);
	}

	@SubscribeMessage('kick')
	async onKick(client: Socket, message: {roomName: string, UserToKick: number})
	{
		try{
			await this.UserchatsService.removeByNameAndUserID(message.roomName, message.UserToKick);
			this.server.to(message.roomName).emit('kick', {roomToLeave: message.roomName, UserToKick: message.UserToKick});
		}
		catch (error) {
			console.error('Error kicking user:', error.message);
		}
	}

	@SubscribeMessage('user-left')
	async onUserLeft(client: Socket, message:{roomName: string, playerNumber: number, gameID: number}): Promise<void> {
		console.log("into user left", message.playerNumber);
		this.server.to(message.roomName).emit('forfeit', {player: message.playerNumber, max: this.maxScore, gameID: message.gameID});
		this.server.to(message.roomName).emit('leave-room', {roomName: message.roomName, id: client.id});
	}

    // Define the onCreateSomething method to handle creating something
    @SubscribeMessage('create-something')
    async onCreateSomething(client: Socket, data: {room: string, user_id: number, text: string, sender_Name: string}) {
        // console.log('Create something:', data);
        const chats = await this.ChatsService.findName(data.room);
		if (await this.ChatsService.isUserInChat(chats.id, data.user_id) === true)
		{
			if (await this.ChatsService.isUserMuted(chats.id, data.user_id) === false)
			{
				this.MessageService.create({chat_id: chats.id, user_id: data.user_id, text: data.text, user_name: data.sender_Name});
				this.server.to(data.room).emit('srv-message', data);
				console.log('sent this: ', data);
			}
			else
			{
				this.server.to(client.id).emit('room-join-error', {error: 'You are muted in this chat', reset: false});
			}
		}
    }
}