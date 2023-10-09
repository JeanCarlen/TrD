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
// roomName: string,
player1: Players,
player2: Players,
score1: number,
score2: number,
ball: Ball,
}

interface Players{
id: number,
name: string,
avatar: string,
pos_y: number,
pos_x: number,
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
const [playerNumber, setPlayerNumber] = useState<number>(0);
const [gameStarted, setGameStarted] = useState<boolean>(false);
const [playerName1, setPlayerName1] = useState<string>('');
const [playerName2, setPlayerName2] = useState<string>('');
const [playerScore1, setPlayerScore1] = useState<number>(0);
const [playerScore2, setPlayerScore2] = useState<number>(0);
const token: string | undefined = Cookies.get("token");
const intervalIdRef = useRef<number | null>(null);
let intervalId: number= 0;
let paddleSize: number = 150;
let newDir: number = 0;
let cowLogoImage: HTMLImageElement = new Image();
//   let canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>();
const canvasRef = useRef<HTMLCanvasElement>();

let data: GameData = {
	player1: {
		id: 0,
		name: 'Bob',
		avatar: '',
		pos_y: 10,
		pos_x: 0,
	},
	player2: {
		id: 0,
		name: '',
		avatar: '',
		pos_y: 100,
		pos_x: 0,
	},
	score1: 0,
	score2: 0,
	ball: {
		pos_y: 100,
		pos_x: 100,
		speed_y: 3,
		speed_x: 5,
	},
};

const socket = useContext(WebsocketContext);

useEffect(() => {
	// once at the start of the component
	intervalId = window.setInterval(updateGame, 1000 / 60, data);
	window.addEventListener('keydown', (e: KeyboardEvent) => handleKeyPress(e, data));

	cowLogoImage.src = cowLogo;
	if (token != undefined)
	{
		content = decodeToken(token);
		console.log('registering token' , content);
		data.player1.id = content?.user;
		data.player1.name = content?.username;
		data.player1.avatar = content?.avatar;
		socket.connect();
	}
	else
	{
	content = { username: 'default', user: 0, avatar: 'http://localhost:8080/images/default.png'}
	} 
	// updateGame(data);
},[]);

useEffect(() => {

	if (token === undefined) {
	return;
	}
	content = (decodeToken(token));

	socket.on('connect', () => {
		console.log(socket.id);
		console.log('Connected');
	});

	socket.on('game-start', (dataBack: string) => {
		console.log('sending info', dataBack);
		SendInfo(dataBack);
	});
	
	socket.on('pong-init-setup', (playerNumber: number) => {
		console.log('recieved player number: ' + playerNumber);
		setPlayerNumber(playerNumber);
	});

	socket.on('bounce', (ball: Ball)=> {
		console.log('bounce');
		data.ball = ball;
	});
	
	socket.on('goal', (newScore: number, dataGame: GameData) => {
	//data = dataGame;

	});

	socket.on('paddle-movement', (newy1: number, newy2: number) => {
	console.log('paddle-movement');
	data.player1.pos_y = newy1;
	data.player2.pos_y = newy2;
	});

	socket.on('exchange-info', (dataBack: any) => {
		console.log("EXCHANGE: ",dataBack);
		if (data.player1.id === 0)
		{
			data.player1.id = dataBack.myId;
			data.player1.name = dataBack.myName;
			data.player1.avatar = dataBack.myAvatar;
		}
		else if (data.player2.id === 0)
		{
			data.player2.id = dataBack.myId;
			data.player2.name = dataBack.myName;
			data.player2.avatar = dataBack.myAvatar;
		}
		setPlayerName1(data.player1.name);
		setPlayerName2(data.player2.name);
		//setGameStarted(true);
	});

	return () => {
	socket.off('gameUpdate');
		socket.off('connect');
		socket.off('game-start');
		socket.off('pong-init-setup');
		socket.off('bounce');
		socket.off('paddle-movement');
		socket.off('exchange-info');
	};
	}, [socket]);

const updateGame = () => {
	// console.log('lets start the game1');
	// if (gameStarted === true)
	// {
	const canvas = canvasRef.current!;
	if (!canvas)
	{
		console.log("canvas is null");
		return;
	}

	// if (!gameStarted)
	// 	return;

		const ctx = canvas.getContext('2d')!;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const newBallX = data.ball.pos_x + data.ball.speed_x;
	const newBallY = data.ball.pos_y + data.ball.speed_y;
	if ((data.ball.speed_x > 20) || (data.ball.speed_x < - 20)) {
		data.ball.speed_x = 20;
		data.ball.speed_y = 20;
	}
	if ((newBallX < 0) || (newBallX > canvas.width)) {
		data.ball.speed_x = -data.ball.speed_x;
	}
	if ((newBallY < 10 && (newBallX >= data.player1.pos_x && newBallX <= data.player1.pos_x + paddleSize)) 
	|| (newBallY > canvas.height - 20 && (newBallX >= data.player2.pos_x && newBallX <= data.player2.pos_x + paddleSize))) {
		data.ball.speed_y = -data.ball.speed_y * 1.05;
		data.ball.speed_x = data.ball.speed_x * 1.05;
	}
	if (newBallY < 0) {
		data.score2++;
		setPlayerScore2(data.score2);
		data.ball.pos_x = canvas.width / 2;
		data.ball.pos_y = canvas.height / 2;
		data.ball.speed_x = 3;
		data.ball.speed_y = 5;
	}
	else if(newBallY > canvas.height) {
		data.score1++;
		setPlayerScore1(data.score1);
		data.ball.pos_x = canvas.width / 2;
		data.ball.pos_y = canvas.height / 2;
		data.ball.speed_x = -3;
		data.ball.speed_y = -5;
	}
	else{
		data.ball.pos_x = newBallX;
		data.ball.pos_y = newBallY;
	}
	ctx.fillStyle = 'pink';
	if (cowLogo) {
	ctx.drawImage(cowLogoImage, data.ball.pos_x, data.ball.pos_y, 40, 40);
	}
	ctx.beginPath();
	ctx.roundRect(data.player2.pos_x, canvas.height - 20, paddleSize, 10, 5);
	ctx.roundRect(data.player1.pos_x, 10, paddleSize, 10, 5);
	ctx.fill();
	// }
	// make the overall data equal to the new data
	
};

	const SendInfo = (roomToSend: string) => {
		console.log('game-start-> message: ', {roomName: roomToSend, myId: content?.user, myName: content?.username, myAvatar: content?.avatar});
		socket.emit('exchange-info', {roomName: roomToSend, myId: content?.user, myName: content?.username, myAvatar: content?.avatar});
	};

	const gameOver = () => {
		socket.emit('game-over', { roomName: roomName});
	//fetch-> post score to batabse
	};

const Paddles = () => {
	socket.emit('paddle-movement', { playerNumber: playerNumber, data: data, newDir: newDir});}

const sendGame = () => {
	console.log('sendGame', roomName);
	socket.emit('join-game', { roomName: roomName});
};

const Bounce = (newBallx: number, newBally: number, newSpeedx: number, newSpeedy: number) => {
	socket.emit('bounce', newBallx, newBally, newSpeedx, newSpeedy);
};

const CreatePongRoom = () => {
	const roomNamePrompt = prompt("Enter a name for the new Game:");
	console.log("creating room:", roomNamePrompt);
	socket.emit('create-room', {
		roomName: roomNamePrompt,
	client: content?.user
	});
};

	const handleKeyPress = (e: React.KeyboardEvent, data: GameData) => {
	const speed = 30;
	switch (e.key) {
		case 'ArrowLeft':
		data.player2.pos_x =  data.player2.pos_x - speed;
		break;
		case 'ArrowRight':
		data.player2.pos_x = data.player2.pos_x + speed;
		break;
		case 'a':
		data.player1.pos_x = data.player1.pos_x - speed;
		break;
		case 'd':
		data.player1.pos_x =  data.player1.pos_x + speed;
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
		<span>{playerName1}: {playerScore1}</span>
		<br/>
		<span>{playerName2}: {playerScore2}</span>
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
	<button onClick={gameOver}>Game Over</button>
	</div>
	);
};

export default GameSocket;
