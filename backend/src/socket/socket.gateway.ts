import { Inject, Logger, OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatsService } from "src/chats/chats.service";
import { ChatType } from "src/chats/entities/chat.entity";
import { UserchatsService } from "src/userchats/userchats.service";
import { MessagesService } from "src/messages/messages.service";
import { ChatadminsService } from "src/chatadmins/chatadmins.service";
import { UsersService } from "src/users/users.service";
import { error } from "console";

import { subscribe } from "diagnostics_channel";
import { Subscription } from "rxjs";

// Define the WebSocketGateway and its path and CORS settings
@WebSocketGateway({ path: '/api', cors: true })
export class SocketGateway implements OnModuleInit, OnGatewayConnection {
    // Define a logger and a map of rooms
    private readonly logger = new Logger(SocketGateway.name);
    // private readonly rooms = new Map<string, Set<string>>();
	private readonly maxScore: number = 5;
    
    // Inject the ChatsService into the constructor
    constructor(private readonly ChatsService: ChatsService,
				private readonly UsersService: UsersService,
                private readonly UserchatsService: UserchatsService,
                private readonly MessageService: MessagesService,
                private readonly ChatadminsService: ChatadminsService) {}

    // Define the WebSocketServer and an array of clients
    @WebSocketServer()
    private server: Server;
	private UserList: {user_id: number, socket: Socket}[] = [];
	private IdWaitlist: {user_id:number, socket: Socket}[] = [];
	private IdWaitlist_bonus: {user_id:number, socket: Socket}[] = [];
	private stock: {roomName: string, player1: Socket, player2: Socket, gameID: number}[] = [];
    // Define the onModuleInit method to handle connections and list rooms
    onModuleInit() {
        this.server.on('connection', async (socket: Socket) => {
            this.handleConnection(socket);
        });
    }

	randomNumberInRange (min: number, max: number) {
		let randRet = Math.floor(Math.random() * (max - min + 1)) + min;
		if (randRet > -2 && randRet < 2)
			randRet = this.randomNumberInRange(min, max);
		return randRet;
	}

    // Define the handleConnection method to log when a client connects
	@Inject('UsersService')
    async handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);

		// this.logger.log(`Socket connected: ${Socket.id}`);
    }

    // Define the handleDisconnect method to log when a client disconnects
	@Inject('UsersService')
    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
		// get user id from UserList
		let List_leaver = this.UserList.find((one) => (one.socket.id === client.id));
		if (List_leaver !== undefined)
		{
			// change the user status in database
			// remove user from UserList
			this.logger.log(`removed user from userList ${List_leaver.user_id}`);
			this.UserList.splice(this.UserList.indexOf(List_leaver, 1));
			this.UsersService.updateStatus(List_leaver.user_id , 0);
		}
		let leaver = this.IdWaitlist.find((one) => (one.socket.id === client.id));
		if (leaver !== undefined)
			this.IdWaitlist.splice(this.IdWaitlist.indexOf(leaver), 1);
		leaver = this.IdWaitlist_bonus.find((one) => (one.socket.id === client.id));
		if (leaver !== undefined)
			this.IdWaitlist_bonus.splice(this.IdWaitlist_bonus.indexOf(leaver), 1);
		let toDelete = this.stock.find((one) => (one?.player1.id === client.id || one?.player2.id === client.id));
		if (toDelete !== undefined)
		{
			let pnumber = 0;
			if (toDelete.player1.id === client.id)
				pnumber = 1;
			else if (toDelete.player2.id === client.id)
				pnumber = 2
			if (pnumber !== 0)
				this.server.to(toDelete.roomName).emit('forfeit', {player: pnumber, max: this.maxScore, gameID: toDelete.gameID});
			this.stock.splice(this.stock.indexOf(toDelete));
		}
    }
    
	@Inject('UsersService')
	@SubscribeMessage('connect_id')
	async onConnectId(client: Socket, user_id: number) {
		// add user to User list if he doesn't exist
		// replace the socket if the user exists
		let joiner = await this.UserList.find((one) => (one.user_id === user_id));
		if (joiner !== undefined)
		{
			if(joiner.socket.id !== client.id)
			{
				
				await this.server.to(joiner.socket.id).emit('force-logout');
			}
			joiner.socket = client;
			this.logger.log(`changed socket in userList for ${user_id}`);
		}
		else
		{
			this.UserList.push({user_id: user_id, socket: client});
			this.logger.log(`added user to userList ${user_id}`);
		}
		let user_info = this.UserList.find((one) => (one.socket.id === client.id));
		if (user_info !== undefined)
			this.UsersService.updateStatus(user_info.user_id , 1);
		// set the user as online
	};
    // Define the onPongInitSetup method to handle joining a game
	@Inject('UsersService')
    @SubscribeMessage('join-game')
    async onPongInitSetup(client: Socket, message: { roomName: string }) {
        
        client.join(message.roomName);
        const room = await this.server.sockets.adapter.rooms.get(message.roomName);
		let curr = await this.stock.find((one) => (one?.roomName === message.roomName));
		if (curr === undefined)
		{
			await this.stock.push({roomName: message.roomName, player1: client, player2: undefined, gameID: 0});
			await this.server.to(client.id).emit('pong-init-setup', 1);
		}
		else
			curr.player2 = client;
        if (room != undefined && curr != undefined && curr.player1 != undefined && curr.player2 != undefined) {
            

			await this.server.to(curr.player2.id).emit('pong-init-setup', 2);
            this.server.to(message.roomName).emit('game-start', message.roomName);
			let player_1 = this.UserList.find((one) => (one.socket.id === client.id));
			let player_2 = this.UserList.find((one) => (one.socket.id === client.id));
			this.UsersService.updateStatus(player_1.user_id, 2);
			this.UsersService.updateStatus(player_2.user_id, 2);
        }
		return Promise.resolve();
    }

	@SubscribeMessage('setGameId')
	onSetGameId(client: Socket, message: {roomName: string, gameId: number})
	{
		
		let game = this.stock.find((one) => (one?.roomName === message.roomName));
		if (game !== undefined && game.gameID === 0)
			game.gameID = message.gameId;
  }

	@SubscribeMessage('updateAchievements')
	async onUpdateAchievements(client: Socket, message: {player1_id: number, player2_id: number}) {
		
		this.UsersService.updateUserAchievmentByType(message.player1_id, 'games_played', 1)
		this.UsersService.updateUserAchievmentByType(message.player2_id, 'games_played', 1)
	}

	@SubscribeMessage('give-roomName')
	async onGiveRoomName(client: Socket, data: {user_id: number})
	{
		
		try
		{
			let friend = await this.UserList.find((one) => (one.user_id === data.user_id));
			let curr = this.stock.find((one) => (one?.player1.id === friend?.socket.id));
			if (curr == undefined)
				curr =  await this.stock.find((one) => (one?.player2.id === friend?.socket.id));
			if (curr == undefined)
				throw new Error(`User not in game`);
			else
				this.server.to(client.id).emit('give-roomName', {roomName: curr?.roomName});
		}
		catch (error) 
		{
			this.server.to(client.id).emit('back_to_home', {error: error.message, reset: true});
			console.error('Error giving room name:', error.message);
		}
	}

	@SubscribeMessage('spectate')
	async onSpectate(client: Socket, message: { roomName: string})
	{
		
		client.join(message.roomName);
		this.server.to(message.roomName).emit('spectate', message);
	}

	@SubscribeMessage('gameState')
	async onGamestate(client: Socket, message: { data : any, roomName: string})
	{
		
		this.server.to(message.roomName).emit('gameState', message);
	}

	IsInGame(client: Socket):boolean
	{
		let standard = this.stock.find((one) => (one.player1.id === client.id || one.player2.id === client.id))
		if (standard !== undefined)
			return (true);
		return (false);
	}

    @SubscribeMessage('waitList')
    async onWaitList(client: Socket, message: {user_id:number, bonus: number }) {
        
		try {
			if (this.IsInGame(client))
				return;
			if(message.bonus == 0)
			{
				const userInWaitList = this.IdWaitlist.find((one) => (one.user_id === message.user_id));
				const userOtherList = this.IdWaitlist_bonus.find((one) => (one.user_id === message.user_id));
				if (userOtherList !== undefined)
				{
					this.IdWaitlist_bonus.splice(this.IdWaitlist_bonus.indexOf(userOtherList), 1);
					
				}
				if (userInWaitList === undefined)
				{
					this.IdWaitlist.push({user_id: message.user_id, socket:client});
				}
				else
				{
					
					if (userInWaitList.socket.id !== client.id)
						userInWaitList.socket = client;
					else
						throw new Error(`User already in wait list`);
				}
				if(this.IdWaitlist !== undefined && this.IdWaitlist.length >= 2)
				{
					const roomName = this.IdWaitlist[0].socket.id + this.IdWaitlist[1].socket.id;
					await this.onPongInitSetup(this.IdWaitlist[0].socket, {roomName: roomName});
					await this.onPongInitSetup(this.IdWaitlist[1].socket, {roomName: roomName});
					this.IdWaitlist.splice(0, 2);
				}
			}
			if(message.bonus == 1)
			{
				const userInWaitList = this.IdWaitlist_bonus.find((one) => (one.user_id === message.user_id));
				const userOtherList = this.IdWaitlist.find((one) => (one.user_id === message.user_id));
				if (userOtherList !== undefined)
				{
					this.IdWaitlist.splice(this.IdWaitlist.indexOf(userOtherList), 1);
					
				}
				if (userInWaitList === undefined)
				{
					this.IdWaitlist_bonus.push({user_id: message.user_id, socket:client});
				}
				else
				{
					
					if (userInWaitList.socket.id !== client.id)
						userInWaitList.socket = client;
					else
						throw new Error(`User already in wait list`);
				}
				if(this.IdWaitlist_bonus !== undefined && this.IdWaitlist_bonus.length >= 2)
				{
					const roomName = this.IdWaitlist_bonus[0].socket.id + this.IdWaitlist_bonus[1].socket.id;
					await this.onPongInitSetup(this.IdWaitlist_bonus[0].socket, {roomName: roomName});
					await this.onPongInitSetup(this.IdWaitlist_bonus[1].socket, {roomName: roomName});
					this.IdWaitlist_bonus.splice(0, 2);
				}
			}
		} catch (error) {
			
			this.IdWaitlist.map((client) => {
			this.server.to(client.id).emit('room-join-error', {error: error.message, reset: true});
		}
    }

    @SubscribeMessage('bye-bye')
	async onByeBye(client: Socket, message:{roomName:string, user_id: number})
	{
		let byeRoom = await this.stock.find((one)=>(one?.roomName === message.roomName));
		await this.stock.splice(this.stock.indexOf(byeRoom), 1);
		
		this.UsersService.updateStatus(message.user_id , 1);
	}


    @SubscribeMessage('delete-channel')
    async onDeleteChannel(client: Socket, data: { chat_id: number, roomName: string }) {
        
		await this.server.to(data.roomName).emit('smb-movede', data);
		this.server.to(data.roomName).emit('refresh-id');
    }

	@SubscribeMessage('ready')
	async onReady(@MessageBody() data: {roomName:string, sbx: number, sby: number})
	{
		
		data.sbx = this.randomNumberInRange(-6, 6);
		data.sby = this.randomNumberInRange(-6, 6);
		this.server.to(data.roomName).emit('ready', data);
	}

    @SubscribeMessage('exchange-info')
    onExchangeInfo(client: Socket, data: { myId : number, myName : string, myAvatar : string, roomName: string, playerNumber: number}) {
        
        this.server.to(data.roomName).emit('exchange-info', data);
    }

    // Define the onGameOver method to handle when a game is over
	@Inject('UsersService')
    @SubscribeMessage('game-over')
    onGameOver(client: Socket, message: { roomName: string }) {
        
        this.server.to(message.roomName).emit('leave-game', message);
		let user_info = this.UserList.find((one) => (one.socket.id === client.id));
		this.UsersService.updateStatus(user_info.user_id , 1);
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
			
            this.server.to(data.roomName).emit('goal', {score1: data.score1, score2: data.score2});
        };
        if(data.score1 == this.maxScore || data.score2 == this.maxScore) {
            this.server.to(data.roomName).emit('game-over',  {score1: data.score1, score2: data.score2});
			let toDelete = this.stock.find((one) => (one?.roomName === data.roomName));
			toDelete.player1.leave(data.roomName);
			toDelete.player2.leave(data.roomName);
			this.stock.splice(this.stock.indexOf(toDelete), 1);
        }
    }

    @SubscribeMessage('bonus')
    onBonus(client: Socket, data: { roomName: string, playerNumber: number })
	{
        
        this.server.to(data.roomName).emit('bonus-player', data);
    }

	@SubscribeMessage('bonus-pos')
	onBonusPos(client: Socket, data: {roomName:string, pos_x: number, pos_y: number, playerNumber: number, speed_y: number, speed_x: number})
	{
		
		this.server.to(data.roomName).emit('bonus-send', data);
	}

    // Define the onCreateRoom method to handle creating a chat room
    @SubscribeMessage('create-room')
    @Inject('ChatsService')
    async onCreateRoom(client: Socket, message: { roomName: string, client: string, Password: string | null }) {
		try {
			const roomList = await this.ChatsService.findAllFromSocket();
			
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
            
			await this.onJoinRoom(client, { roomName: message.roomName, socketID: client.id, client: parseInt(message.client), password: message.Password });
            this.ChatadminsService.create({user_id: parseInt(message.client), chat_id: createdRoom.id});
        } catch (error) {
            console.error('Error creating room:', error.message);
			this.server.to(client.id).emit('room-join-error', {error: error.message, reset: true});
        }
    }

	@SubscribeMessage('leave-chat')
	@Inject('UserchatsService')
	async onLeaveRoom(client: Socket, message:{ chat_id : number, roomName : string, user_id: number}): Promise<void> {
		
		//change it to leave-room
		//
		await this.ChatsService.leaveChat(message.chat_id, {user_id: message.user_id})
		this.server.to(message.roomName).emit('smb-moved');
		this.server.to(message.roomName).emit('refresh-chat');
		client.leave(message.roomName);
		this.server.to(client.id).emit('smb-movede');
		
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
			if (error.message !== 'Already in room' && error.message !== 'protected') {
				this.server.to(client.id).emit('room-join-error', {error: error.message, reset: true});
			}
		}
	}

	@SubscribeMessage('create-1on1')
	@Inject('UserchatsService')
	async onAddUserchat(client: Socket, message:{roomName: string, requester: number, requested: number}){
		try {
			
			const chats = await this.ChatsService.findName(message.roomName);
			if (chats !== null)
				throw new Error('chat already exists');
			const roomList = await this.ChatsService.findAllFromSocket();
			roomList.map((room) => {
				if (room.name == message.roomName) {
					throw new Error(`Room already exists`);
				}
			});
			const createdRoom = await this.ChatsService.create({
				name: message.roomName,
				type: ChatType.CHANNEL,
				owner: message.requester,
				password: null,
			});
			
			await this.UserchatsService.create({user_id: message.requested, chat_id: createdRoom.id});
            this.ChatadminsService.create({user_id: message.requester, chat_id: createdRoom.id});
            this.ChatadminsService.create({user_id: message.requested, chat_id: createdRoom.id});
		} catch (error) {
			
			this.server.to(client.id).emit('room-join-error', {error: error.message, reset: true});
		}
		
	}

    @SubscribeMessage('join-room')
	@Inject('ChatsService')
	@Inject('UserchatsService')
	@Inject('UsersService')
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
            if (await this.ChatsService.isPasswordValid(chats.id, message.password) == false) { // check if password matches
                throw new Error(`Wrong password.`);
            }
            client.join(message.roomName);
			this.server.to(client.id).emit('login-ok', message.roomName);
			const list = await this.UserchatsService.findByChatId(chats.id);
			list.map((userchat) => {
                if (userchat.user_id == message.client) {
                    
                    throw new Error(`Already in room`);
                }});
			await this.UserchatsService.create({user_id: message.client, chat_id: chats.id});
            this.server.to(message.roomName).emit('smb-moved');
            
        } catch (error) {
            console.error('Error joining room:', error.message);
            if (error.message !== 'Already in room') {
				this.server.to(client.id).emit('room-join-error', {error: error.message, reset: true});
				this.server.to(client.id).emit('refresh-id');
			}
        }
    }

	@SubscribeMessage('refresh')
	onRefresh(client: Socket, message:{ roomName: string, type: string}): void {
		
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

	@SubscribeMessage('moveRoom')
	async onMoveRoom(client: Socket)
	{
		let pnumber = 0;
		let foundStock = await this.stock.find((one)=>(one.player1.id === client.id));
		if (foundStock === undefined)
			foundStock = await this.stock.find((one)=>(one.player2.id === client.id));
		else 
			pnumber = 1;
		if (foundStock !== undefined)
		{
			if (pnumber === 0)
				pnumber = 2;
			if (foundStock.player1 !== undefined && foundStock.player2 !== undefined)
				this.onUserLeft(client, {roomName: foundStock.roomName, playerNumber: pnumber, gameID: foundStock.gameID});
			else
				this.stock.splice(this.stock.indexOf(foundStock),1);
		}
		let leaver = this.IdWaitlist.find((one) => (one.socket.id === client.id));
		if (leaver !== undefined)
			this.IdWaitlist.splice(this.IdWaitlist.indexOf(leaver), 1);
		leaver = this.IdWaitlist_bonus.find((one) => (one.socket.id === client.id));
		if (leaver !== undefined)
			this.IdWaitlist_bonus.splice(this.IdWaitlist_bonus.indexOf(leaver), 1);
	}

	@Inject('UsersService')
	@SubscribeMessage('user-left')
	async onUserLeft(client: Socket, message:{roomName: string, playerNumber: number, gameID: number}): Promise<void> {
		
		this.server.to(message.roomName).emit('forfeit', {player: message.playerNumber, max: this.maxScore, gameID: message.gameID});
		let user_info = this.UserList.find((one) => (one.socket.id === client.id));
		if (user_info !== undefined)
			this.UsersService.updateStatus(user_info.user_id , 1);
	}

	@SubscribeMessage('invite')
	async onInvite(client: Socket, message: {inviter: {username: string, user: number, avatar: string}, invited:{username: string, id: number}})
	{
		try {
			let target = await this.UserList.find((one)=> (one.user_id == message.invited.id));
			if (target == undefined)
			{
				
				throw new Error('User doesn\'t exist or is not online');
			}
			if (this.IsInGame(target.socket))
				throw new Error('User is currently in a game');
			const blocked = await this.UsersService.blockAnyWayList(message.inviter.user);
			await blocked.forEach((user)=>{
				if (user.id == message.invited.id){
					
					throw new Error('User is blocked or blocked you');
				}
			});
			const roomName = client.id + target.socket.id;
			this.server.to(target.socket.id).emit('invite', {inviter: message.inviter, roomName: roomName});
			await this.onPongInitSetup(client, {roomName: roomName});
			this.logger.log('INVITED', message.invited.username);
		} catch (error){
			this.logger.log(`Error challenging user: ${error.message}`);
			this.server.to(client.id).emit('back_to_home', {error: error.message, reset: true});
		}
	}

	@SubscribeMessage('replyInvite')
	async replyInvite(client: Socket, message: {roomName: string, status: string})
	{
		let target = await this.stock.find((one)=> (one.roomName == message.roomName));
		if (target == undefined)
		{
			
			this.server.to(client.id).emit('back_to_home', {error: 'The request expired', reset: true});
			return;
		}
		if (message.status == 'accept')
			await this.onPongInitSetup(client, {roomName: message.roomName});
		else
		{
			this.server.to(target.player1.id).emit('back_to_home', {error: 'The user refused your challenge', reset: true});
			this.stock.splice(this.stock.indexOf(target), 1);
		}
	}

    // Define the onCreateSomething method to handle creating something
    @SubscribeMessage('create-something')
	@Inject('UsersService')
    async onCreateSomething(client: Socket, data: {room: string, user_id: number, text: string, sender_Name: string}) {
        // 
        const chats = await this.ChatsService.findName(data.room);
		if (await this.ChatsService.isUserInChat(chats.id, data.user_id) === true)
		{
			if (await this.ChatsService.isUserMuted(chats.id, data.user_id) === false)
			{
				const users = await this.ChatsService.findChatUsers(chats.id, -1);
				const blocked = await this.UsersService.blockAnyWayList(data.user_id);
				users.forEach((user)=>{
					blocked.forEach((blocked_user)=>{
						if (user.id == blocked_user.id){
							
							(this.UserList.find((one)=>one.user_id == user.id))?.socket.join(`banRoom-${data.user_id}`);
						}
				});
			})
				this.MessageService.create({chat_id: chats.id, user_id: data.user_id, text: data.text, user_name: data.sender_Name});
				this.server.to(data.room).except(`banRoom-${data.user_id}`).emit('srv-message', data);
				const sockets = await this.server.in(`banRoom-${data.user_id}`).fetchSockets();
				sockets.forEach(s => {
					s.leave(`banRoom-${data.user_id}`);
				});
			}
			else
			{
				this.server.to(client.id).emit('room-join-error', {error: 'You are muted in this chat', reset: false});
			}
		}
    }
}