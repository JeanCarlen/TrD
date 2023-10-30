import React, { useState, useContext, useEffect, useRef } from "react";
import { WebsocketContext } from "../context/websocket.context";
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import decodeToken from '../helpers/helpers';
import PongGame	from './PongGame';
import { ThemeConsumer } from "styled-components";
import cowLogo from '../cow.png';

export interface GameData
{
	NameOfRoom: string,
	player1: Players,
	player2: Players,
	score1: number,
	score2: number,
	ball: Ball,
	started: boolean,
	converted: boolean,
	paused: number,
}

interface Players{
	pNumber: number,
	id: number,
	name: string,
	avatar: string,
	pos_y: number,
	pos_x: number,
	speed: number,
}

interface Ball{
	pos_y: number,
	pos_x: number,
	speed_y: number,
	speed_x: number
}

const GameSocket: React.FC = () => {
let content: {username: string, user: number, avatar: string};
const [roomName, setRoomName] = useState<string>('');
const [timer, setTimer] = useState<number>(0);
const token: string | undefined = Cookies.get("token");
const [GamePaused, setGamePaused] = useState<boolean>(false);
const [player1, setPlayer1] = useState<string>('player1');
const [player2, setPlayer2] = useState<string>('player2');
let intervalId: number= 0;
let paddleSize: number = 150;
let cowLogoImage: HTMLImageElement = new Image();
const canvasRef = useRef<HTMLCanvasElement>();

let data = useRef<GameData>({
	NameOfRoom: '',
	player1: {
		pNumber: 0,
		id: 0,
		name: '',
		avatar: '',
		pos_y: 10,
		pos_x: 0,
		speed: 25,
	},
	player2: {
		pNumber: 0,
		id: 0,
		name: '',
		avatar: '',
		pos_y: 10,
		pos_x: 10,
		speed: 25,
	},
	score1: 0,
	score2: 0,
	ball: {
		pos_y: 100,
		pos_x: 100,
		speed_y: 1,
		speed_x: 2,
	},
	started: false,
	converted: false,
	paused: 0,
});

const socket = useContext(WebsocketContext);
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const pause = () => {
	setGamePaused(true);
	delay(5000).then(() => {
		setGamePaused(false);
	});
};

useEffect(() => {
	// once at the start of the component
	intervalId = window.setInterval(updateGame, 1000 / 30, data);
	window.addEventListener('keydown', (e: KeyboardEvent) => handleKeyPress(e));

	cowLogoImage.src = cowLogo;
	if (token != undefined)
	{
		content = decodeToken(token);
		console.log('registering token' , content);
		data.current.player1.id = content?.user;
		data.current.player1.name = content?.username;
		data.current.player1.avatar = content?.avatar;
		socket.connect();
	}
	else
	{
	content = { username: 'default', user: 0, avatar: 'http://localhost:8080/images/default.png'}
	}
},[]);

useEffect(() => {

	socket.on('connect', () => {
		console.log(socket.id);
		console.log('Connected');
	});

	socket.on('game-start', (dataBack: string) => {
		console.log('sending info', dataBack);
		data.current.NameOfRoom = dataBack;
		SendInfo(dataBack);
	});

	socket.on('pong-init-setup', (playerNumber: number) => {
		console.log('recieved player number: ' + playerNumber);
		data.current.player1.pNumber= playerNumber;
		});

	// socket.on('bounce', (ball: {ballSpeedX: number, ballSpeedY: number})=> {
	// 	console.log('bounce');
	// 	data.current.ball.speed_x = ball.ballSpeedX;
	// 	data.current.ball.speed_y = ball.ballSpeedY;
	// 	data.current.converted = false;
	// });

	socket.on('goal', (dataBack: {score1: number, score2: number}) => {
			console.log(`goal --> new score ${dataBack.score1} - ${dataBack.score2}` )
			data.current.ball.pos_x = 100;
			data.current.ball.pos_y = 100;
			data.current.ball.speed_x = 2;
			data.current.ball.speed_y = 1;
			data.current.score1 = dataBack.score1;
			data.current.score2 = dataBack.score2;
			data.current.converted = false;
			data.current.paused = 0;
	});

	socket.on('leave-game', (roomName: string) => {
		console.log(socket.id , ' left : ', roomName);
		socket.leave(roomName);
	});

	socket.on('paddle-send', (dataBack: any) => {
		if (dataBack.playerNumber === data.current.player1.pNumber)
			data.current.player1.pos_x = dataBack.pos_x;
		else if (dataBack.playerNumber === data.current.player2.pNumber)
			data.current.player2.pos_x = 600 - dataBack.pos_x - paddleSize;
	});

	socket.on('exchange-info', (dataBack: any) => {
		console.log("EXCHANGE: ",dataBack.myName);
		if (data.current.player1.id === 0)
		{
			data.current.player1.id = dataBack.myId;
			data.current.player1.name = dataBack.myName;
			data.current.player1.avatar = dataBack.myAvatar;
			data.current.player1.pNumber = dataBack.playerNumber;
		}
		else if (data.current.player2.id === 0 && data.current.player1.id !== dataBack.myId)
		{
			data.current.player2.id = dataBack.myId;
			data.current.player2.name = dataBack.myName;
			data.current.player2.avatar = dataBack.myAvatar;
			data.current.player2.pNumber = dataBack.playerNumber;
		}
		if (data.current.player1.pNumber === 1)
		{
			setPlayer1(data.current.player1.name);
			setPlayer2(data.current.player2.name);
		}
		else if (data.current.player1.pNumber === 2)
		{
			setPlayer1(data.current.player2.name);
			setPlayer2(data.current.player1.name);
		}
		data.current.started = true;
		data.current.ball = {
		pos_y: 100,
		pos_x: 100,
		speed_y: 1,
		speed_x: 2,
		}
		if (data.current.player1.pNumber === 2)
		{
			data.current = convert(data.current, 800, 600);
		}
	});

	socket.on('game-over', (dataBack: {score1: number, score2: number}) => {
		data.current.paused = 5;
		console.log('game over');
		let Fball: Ball = {
			pos_y: 40,
			pos_x: 300,
			speed_y: 0,
			speed_x: 0,
		}

		data.current.ball = Fball;
	});

	return () => {
		socket.off('gameUpdate');
		socket.off('connect');
		socket.off('game-start');
		socket.off('pong-init-setup');
		socket.off('bounce');
		socket.off('paddle-send');
		socket.off('exchange-info');
		socket.off('goal');
		socket.off('game-over');
	};
	}, [socket]);



	function convert (data: GameData, height: number, width:number) {

		data.ball.speed_y *= -1;
		data.ball.speed_x *= -1;
		data.ball.pos_y = height - data.ball.pos_y;
		data.ball.pos_x = width - data.ball.pos_x;
		data.converted = true;
		return data;
	}

const updateGame = async() => {
	if (!data.current.started)
	{
		return ;
	}
	const canvas = canvasRef.current!;
	if (!canvas)
	{
		console.log("canvas is null");
		return;
	}

	const ctx = canvas.getContext('2d')!;
	if (data.current.player1.pNumber === 2 && !data.current.converted)
		data.current = convert(data.current, canvas.height, canvas.width);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const newBallX = data.current.ball.pos_x + data.current.ball.speed_x;
	const newBallY = data.current.ball.pos_y + data.current.ball.speed_y;
	// limit max ball speed
	if ((data.current.ball.speed_x > 20) || (data.current.ball.speed_x < - 20)) {
		data.current.ball.speed_x = 20;
		data.current.ball.speed_y = 20;
	}
	// bounce off of left/right walls
	if ((newBallX < 0) || (newBallX > canvas.width)) {
		// a garder
		data.current.ball.speed_x = -data.current.ball.speed_x;
	}
	// check for collision with paddle
	if ((newBallY < 20 && (newBallX >= data.current.player2.pos_x && newBallX <= data.current.player2.pos_x + paddleSize))
		|| (newBallY > canvas.height - 20 && (newBallX >= data.current.player1.pos_x && newBallX <= data.current.player1.pos_x + paddleSize))) {
		data.current.ball.speed_y = -data.current.ball.speed_y * 1.05;
		data.current.ball.speed_x = data.current.ball.speed_x * 1.05;
		console.log('collision with paddle');
		// if (data.current.player1.pNumber === 1)
		// 	Bounce(newBallX, newBallY, data.current.ball.speed_x, data.current.ball.speed_y);
		// else if (data.current.player1.pNumber === 2)
		// 	Bounce(newBallX, newBallY, -data.current.ball.speed_x, -data.current.ball.speed_y);

	}

	// check for goal on player 1 side - change into socket goal
	// add a paused effect
	if(newBallY > canvas.height && data.current.paused === 0) {
		console.log('goal scored');
		if (data.current.player1.pNumber === 1)
			socket.emit('goal', {score1: data.current.score1 , score2: data.current.score2 + 1, roomName: data.current.NameOfRoom});
		else if (data.current.player1.pNumber === 2)
			socket.emit('goal', {score1: data.current.score1 + 1, score2: data.current.score2, roomName: data.current.NameOfRoom});


	}
	else if (data.current.paused === 0){
		// calculating new position - keep
		data.current.ball.pos_x = newBallX;
		data.current.ball.pos_y = newBallY;
	}
	// drawing elements - keep
	ctx.fillStyle = 'pink';
	if (cowLogo) {
		ctx.drawImage(cowLogoImage, data.current.ball.pos_x - 20, data.current.ball.pos_y - 20, 40, 40);
	}
	if (data.current.paused > 0)
		ctx.fillText(data.current.paused, ctx.width / 2, ctx.height / 2);
	ctx.beginPath();
	//ctx.arc(data.current.ball.pos_x, data.current.ball.pos_y, 10, 0, Math.PI * 2, true);
	ctx.roundRect(data.current.player2.pos_x, data.current.player2.pos_y, paddleSize, 10, 5);
	ctx.roundRect(data.current.player1.pos_x, canvas.height - 10, paddleSize, 10, 5);
	ctx.fill();
};

	const SendInfo = (roomToSend: string) => {
		console.log('game-start-> message: ', {roomName: roomToSend, myId: content?.user, myName: content?.username, myAvatar: content?.avatar, playerNumber: data.current.player1.pNumber});
		socket.emit('exchange-info', {roomName: roomToSend, myId: content?.user, myName: content?.username, myAvatar: content?.avatar, playerNumber: data.current.player1.pNumber});
	};

const Paddles = (roomName: string, newDir: number) => {
	socket.emit('paddle-movement', {roomName:roomName, playerNumber: data.current.player1.pNumber, pos_x: data.current.player1.pos_x, newDir: newDir, speed: data.current.player1.speed});}

const sendGame = () => {
	console.log('sendGame', roomName);
	data.current.NameOfRoom = roomName;
	socket.emit('join-game', { roomName: roomName});
};

const Bounce = (newBallx: number, newBally: number, newSpeedx: number, newSpeedy: number) => {
	socket.emit('bounce', {ballSpeedX: newSpeedx, ballSpeedY: newSpeedy, roomName: data.current.NameOfRoom});
};

const CreatePongRoom = () => {
	const roomNamePrompt = prompt("Enter a name for the new Game:");
	console.log("creating room:", roomNamePrompt, content?.user);

	socket.emit('create-room', {
		roomName: roomNamePrompt,
		client: content?.user
	});
};

const WaitingRoom = () => {
	socket.emit('waitList');
	console.log('in the waiting-room');
};

	const handleKeyPress = (e: React.KeyboardEvent) => {
	switch (e.key) {
		case 'ArrowLeft':
		Paddles(data.current.NameOfRoom, -1);
		break;
		case 'ArrowRight':
		Paddles(data.current.NameOfRoom, 1);
		break;
		default:
		break;
	}
	};

	return (
	<div>
	<div className="game">
	<canvas ref={canvasRef} width={600} height={800}></canvas>
	<div className="score">
		<img src="../cow.png" alt="Ball" style={{ display: 'none' }} />
		<span>{player1}: {data.current.score1}</span>
		<br/>
		<span>{player2}: {data.current.score2}</span>
		</div>
	</div>
	<button onClick={CreatePongRoom}>Create Room</button>
	<input
	type="text"
	placeholder="Enter room name"
	value={roomName}
	onChange={(e) => setRoomName(e.target.value)}
	/>
	<button onClick={sendGame}>Join {roomName}</button>
	{/* <button onClick={gameOver}>Game Over</button> */}
	<button onClick={WaitingRoom}>Waiting Room</button>
	</div>
	);
};

export default GameSocket;
