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

let data = useRef<GameData>({
	NameOfRoom: '',
	player1: {
		pNumber: 0,
		id: 0,
		name: 'Bob',
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
		pos_y: 100,
		pos_x: 0,
		speed: 25,
	},
	score1: 0,
	score2: 0,
	ball: {
		pos_y: 100,
		pos_x: 100,
		speed_y: 3,
		speed_x: 5,
	},
});

const socket = useContext(WebsocketContext);

useEffect(() => {
	// once at the start of the component
	intervalId = window.setInterval(updateGame, 1000 / 60, data);
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
		data.current.player1.pNumber= playerNumber;
		});

	socket.on('bounce', (ball: Ball)=> {
		console.log('bounce');
		data.current.ball = ball;
	});

	socket.on('goal', (newScore: number, dataGame: GameData) => {
	//data = dataGame;

	});

	socket.on('paddle-send', (dataBack: any) => {
	console.log('paddle-movement -> playerNumber= ', dataBack);
		if (dataBack.playerNumber === data.current.player1.pNumber)
			data.current.player1.pos_x = dataBack.pos_x;
		else if (dataBack.playerNumber === data.current.player2.pNumber)
			data.current.player2.pos_x = dataBack.pos_x;
	});

	socket.on('exchange-info', (dataBack: any) => {
		console.log("EXCH1ANGE: ",dataBack);
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
		setPlayerName1(data.current.player1.name);
		setPlayerName2(data.current.player2.name);
		//setGameStarted(true);
	});

	return () => {
		socket.off('gameUpdate');
		socket.off('connect');
		socket.off('game-start');
		socket.off('pong-init-setup');
		socket.off('bounce');
		socket.off('paddle-send');
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

	const newBallX = data.current.ball.pos_x + data.current.ball.speed_x;
	const newBallY = data.current.ball.pos_y + data.current.ball.speed_y;
	if ((data.current.ball.speed_x > 20) || (data.current.ball.speed_x < - 20)) {
		data.current.ball.speed_x = 20;
		data.current.ball.speed_y = 20;
	}
	if ((newBallX < 0) || (newBallX > canvas.width)) {
		data.current.ball.speed_x = -data.current.ball.speed_x;
	}
	if ((newBallY < 10 && (newBallX >= data.current.player1.pos_x && newBallX <= data.current.player1.pos_x + paddleSize))
	|| (newBallY > canvas.height - 20 && (newBallX >= data.current.player2.pos_x && newBallX <= data.current.player2.pos_x + paddleSize))) {
		data.current.ball.speed_y = -data.current.ball.speed_y * 1.05;
		data.current.ball.speed_x = data.current.ball.speed_x * 1.05;
	}
	if (newBallY < 0) {
		data.current.score2++;
		setPlayerScore2(data.current.score2);
		data.current.ball.pos_x = canvas.width / 2;
		data.current.ball.pos_y = canvas.height / 2;
		data.current.ball.speed_x = 3;
		data.current.ball.speed_y = 5;
	}
	else if(newBallY > canvas.height) {
		data.current.score1++;
		setPlayerScore1(data.current.score1);
		data.current.ball.pos_x = canvas.width / 2;
		data.current.ball.pos_y = canvas.height / 2;
		data.current.ball.speed_x = -3;
		data.current.ball.speed_y = -5;
	}
	else{
		data.current.ball.pos_x = newBallX;
		data.current.ball.pos_y = newBallY;
	}
	ctx.fillStyle = 'pink';
	if (cowLogo) {
	ctx.drawImage(cowLogoImage, data.current.ball.pos_x + 20, data.current.ball.pos_y + 20, 40, 40);
	}
	ctx.beginPath();
	ctx.arc(data.current.ball.pos_x, data.current.ball.pos_y, 10, 0, Math.PI * 2, true);
	ctx.roundRect(data.current.player2.pos_x, canvas.height - 20, paddleSize, 10, 5);
	ctx.roundRect(data.current.player1.pos_x, 10, paddleSize, 10, 5);
	ctx.fill();
	// }
	// make the overall data equal to the new data

};

	const SendInfo = (roomToSend: string) => {
		console.log('game-start-> message: ', {roomName: roomToSend, myId: content?.user, myName: content?.username, myAvatar: content?.avatar, playerNumber: data.current.player1.pNumber});
		socket.emit('exchange-info', {roomName: roomToSend, myId: content?.user, myName: content?.username, myAvatar: content?.avatar, playerNumber: data.current.player1.pNumber});
	};

	const gameOver = () => {
		socket.emit('game-over', { roomName: roomName});
	//fetch-> post score to batabse
	};

const Paddles = (roomName: string, playerNumber: number, newDir: number) => {
	socket.emit('paddle-movement', {roomName:roomName, playerNumber: data.current.player1.pNumber, pos_x: data.current.player1.pos_x, newDir: newDir, speed: data.current.player1.speed});}

const sendGame = () => {
	console.log('sendGame', roomName);
	data.current.NameOfRoom = roomName;
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

	const handleKeyPress = (e: React.KeyboardEvent) => {
	const speed = 30;
	switch (e.key) {
		case 'ArrowLeft':
		Paddles(data.current.NameOfRoom, playerNumber, -1);
		//data.player2.pos_x =  data.player2.pos_x - speed;
		break;
		case 'ArrowRight':
		Paddles(data.current.NameOfRoom, playerNumber, 1);
		//data.player2.pos_x = data.player2.pos_x + speed;
		break;
		case 'a':
		//data.player1.pos_x = data.player1.pos_x - speed;
		break;
		case 'd':
		//data.player1.pos_x =  data.player1.pos_x + speed;
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
