import React, { useState, useContext, useEffect, useRef } from "react";
import { WebsocketContext } from "../context/websocket.context";
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import decodeToken from '../helpers/helpers';
import PongGame	from './PongGame';
import { ThemeConsumer } from "styled-components";
import cowLogo from '../cow.png';
import {useNavigate} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

export interface GameData
{
	NameOfRoom: string,
	player1: Players,
	player2: Players,
	score1: number,
	score2: number,
	ball: Ball,
	bonus: Ball,
	started: boolean,
	converted: boolean,
	bonusconverted: boolean,
	paused: number,
	color: string,
	gameID: number,
	bonusActive: boolean,
	gameType: number,
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

function usePageVisibility() {
	const [isVisible, setIsVisible] = useState(!document.hidden);

	useEffect(() => {
	const handleVisibilityChange = () => {
		setIsVisible(!document.hidden);
	};

	window.addEventListener('visibilitychange', handleVisibilityChange);

	return () => {
		window.removeEventListener('visibilitychange', handleVisibilityChange);
	};
	}, []);
	return isVisible;
}


const GameSocket: React.FC = () => {
const [canvas, setCanvas] = useState(null);
const [shouldRun, setShouldRun] = useState(true);
let content: {username: string, user: number, avatar: string};
const bodyNavigate = useNavigate();
const token: string | undefined = Cookies.get("token");
const [player1, setPlayer1] = useState<string>('player1');
const [player2, setPlayer2] = useState<string>('player2');
let intervalId: number= 0;
let intervalBonus: number = 0;
let paddleSize: number = 1500;
let cowLogoImage: HTMLImageElement = new Image();
const canvasRef = useRef<HTMLCanvasElement>();
const isVisible = usePageVisibility();


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
	bonus: {
		pos_x : 100,
		pos_y : 100,
		speed_y: 1,
		speed_x: 2,
	},
	started: false,
	converted: false,
	bonusconverted: false,
	paused: 0,
	color: 'pink',
	gameID: 0,
	bonusActive: false,
	gameType: 0,
});

const socket = useContext(WebsocketContext);
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

useEffect(() => {
	const canvas = canvasRef.current!;
    if (!canvas) {
      console.log("canvas is null");
      setShouldRun(false);
    }
  }, [canvas]);

  if (!shouldRun) {
    return null;
  }

useEffect(() => {
	// once at the start of the component
	console.log('in the use effect');
	if(shouldRun)
		intervalId = window.setInterval(updateGame, 1000 / 30, data);
	window.addEventListener('keydown' , (e: KeyboardEvent<Element>) => handleKeyPress(e));

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
	intervalBonus = window.setInterval(() => {
	let rand = randomNumberInRange(1, 100);
		if(data.current.gameType === 1 && data.current.player1.pNumber === 1 && data.current.bonusActive === false)
		{
			if(rand >= 50)
			{
				console.log('bonus appear');
				socket.emit('bonus-pos', {	roomName: data.current.NameOfRoom,
											pos_x: randomNumberInRange(100,500),
											pos_y: randomNumberInRange(150,650),
											playerNumber: data.current.player1.pNumber,
											speed_x: data.current.bonus.speed_x, speed_y:data.current.bonus.speed_y});
			}
		}
	}
	, 5000);
	return () => {
		if(!data.current.started)
		{
		window.removeEventListener('keydown' , (e: KeyboardEvent<Element>) => handleKeyPress(e));
		window.clearInterval(intervalId);
		window.clearInterval(intervalBonus);
		}
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

	socket.on('goal', async (dataBack: {score1: number, score2: number}) => {
			console.log(`goal --> new score ${dataBack.score1} - ${dataBack.score2}` )
			data.current.ball.pos_x = 100;
			data.current.ball.pos_y = 100;
			data.current.ball.speed_x = 2;
			data.current.ball.speed_y = 1;
			data.current.score1 = dataBack.score1;
			data.current.score2 = dataBack.score2;
			data.current.converted = false;
			data.current.paused = 5;
			if (data.current.player1.pNumber === 1)
			{
				await postScore(dataBack.score1, dataBack.score2, 0, data.current.gameID);
				socket.emit('ready', {roomName: data.current.NameOfRoom});
			}

	});

	socket.on('ready', ()=>{
		data.current.paused=5;
		let intervalPause = setInterval(()=>{
			if (data.current.paused > 0){
				data.current.paused -= 1;
				console.log('paused: ', data.current.paused);
			}
		}, 1000);
		if (data.current.paused == 0)
			clearInterval(intervalPause);

	});

	socket.on('leave-game', (roomName: string) => {
		console.log(socket.id , ' left : ', roomName);
	});

	socket.on('paddle-send', (dataBack: any) => {
		if (dataBack.playerNumber === data.current.player1.pNumber)
			data.current.player1.pos_x = dataBack.pos_x;
		else if (dataBack.playerNumber === data.current.player2.pNumber)
			data.current.player2.pos_x = 600 - dataBack.pos_x - paddleSize;
	});

	socket.on('bonus-send', (dataBack: {roomName:string, pos_x: number, pos_y: number, playerNumber: number, speed_y: number, speed_x: number}) => {
		console.log('bonus recieved');
		data.current.bonusActive = true;
		if(dataBack.playerNumber === data.current.player1.pNumber)
		{
			data.current.bonus.pos_x = dataBack.pos_x;
			data.current.bonus.pos_y = dataBack.pos_y;
			data.current.bonus.speed_x = dataBack.speed_x;
			data.current.bonus.speed_y = dataBack.speed_y;
		}
		if(dataBack.playerNumber === data.current.player2.pNumber)
		{
			data.current.bonus.pos_x = 600 - dataBack.pos_x;
			data.current.bonus.pos_y = 800 - dataBack.pos_y;
			data.current.bonus.speed_x = -dataBack.speed_x;
			data.current.bonus.speed_y = -dataBack.speed_y;
			// data.current = convertBonus(data.current, 800, 600);
		}
	});

	socket.on('bonus-player', (dataBack: any) => {
		if (dataBack.playerNumber === 1)
		{
			console.log('bonus player 1');
			if (dataBack.playerNumber === data.current.player1.pNumber)
			{
				data.current.ball.speed_y = -6;
				data.current.bonusActive = false;

			}
			else if (dataBack.playerNumber === data.current.player2.pNumber)
			{
				data.current.ball.speed_y = 6;
				data.current.bonusActive = false;

			}
		}
		else if (dataBack.playerNumber === 2)
		{
			console.log('bonus player 2');
			if(dataBack.playerNumber === data.current.player1.pNumber)
			{
				data.current.ball.speed_y = 6;
				data.current.bonusActive = false;

			}
			else if (dataBack.playerNumber === data.current.player2.pNumber)
			{	
				data.current.ball.speed_y = -6;
				data.current.bonusActive = false;

			}
		}
		}
	);

	socket.on('exchange-info', async (dataBack: any) => {
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
			data.current.player2.pos_x = 600 - 10 - paddleSize;
		}
		if (data.current.player1.pNumber === 1)
		{
			setPlayer1(data.current.player1.name);
			setPlayer2(data.current.player2.name);
			if (data.current.player1.id !== 0 && data.current.player2.id !== 0)
			{
				let fetchback = await createMatch(data.current.player1.id, data.current.player2.id);
				data.current.gameID = fetchback.id;
				socket.emit('ready', {roomName: data.current.NameOfRoom});
			}
			data.current.bonus = 
			{
			pos_y: 100,
			pos_x: 100,
			speed_y: 1,
			speed_x: 3,
			}
			// socket.emit('bonus_pos', {roomName: data.current.NameOfRoom, bonus_pos_x: data.current.bonus.pos_x, bonus_pos_y: data.current.bonus.pos_y, pNumber: data.current.player1.pNumber, speed_x: data.current.bonus.speed_x, speed_y: data.current.bonus.speed_y});
		
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
		// if(data.current.player1.pNumber === 2)
		// 	data.current = convert(data.current, 800, 600);
	});

	socket.on('forfeit', async (dataBack: {player: number, max: number, gameID: number}) => {
		console.log('user ', dataBack.player, 'forfeited');
		if (dataBack.player !== data.current.player1.pNumber)
		{
			if (dataBack.gameID != 0)
				data.current.gameID = dataBack.gameID;
			if (data.current.player1.pNumber === 1)
				data.current.score1 = dataBack.max;
			else if (data.current.player1.pNumber === 2)
				data.current.score2 = dataBack.max;

			data.current.paused = 5;
			await postScore(data.current.score1, data.current.score2, 1, data.current.gameID);
			await delay(6000);
			try{
				bodyNavigate('/Home');
			}
			catch (e) {
				console.log('error sending home', e);
			}
		}
		else
		{
			try{
				bodyNavigate('/Home');
			}
			catch (e) {
				console.log('error sending home', e);
			}
		}
	});

	socket.on('game-over', async (dataBack: {score1: number, score2: number}) => {
		data.current.paused = 5;
		console.log('game over');
		let Fball: Ball = {
			pos_y: 40,
			pos_x: 300,
			speed_y: 0,
			speed_x: 0,
		}
		data.current.ball = Fball;
		if (data.current.player1.pNumber === 1)
			await postScore(dataBack.score1, dataBack.score2, 1, data.current.gameID);
		await delay(6000);
		try{
			bodyNavigate('/Home');
			console.log('cleared: ', clearInterval(intervalId)) ;
		}
		catch (e) {
			console.log('error sending home', e);
		}
		data.current.started = false;
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
		socket.off('forfeit');
		socket.off('game-over');
		socket.off('bonus-send');
		socket.off('bonus-player');
	};
	}, [socket]);

	useEffect(() => {
		socket.on('room-join-error', (err: Error) => {
			console.log("error in joining room: ", err);
			toast.error(err.message, {
				position: toast.POSITION.BOTTOM_LEFT,
				className: 'toast-error'});
		});

		return() => {
			socket.off('room-join-error');
		}
	}, [socket]);

	function randomNumberInRange(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function convert (data: GameData, height: number, width:number) {
		data.ball.speed_y *= -1;
		data.ball.speed_x *= -1;
		data.ball.pos_y = height - data.ball.pos_y;
		data.ball.pos_x = width - data.ball.pos_x;
		// convertBonus(data, height, width);
		data.converted = true;
		return data;
	}


	function convertBonus (data: GameData, height: number, width:number) {
		data.bonus.speed_y *= -1;
		data.bonus.speed_x *= -1;
		data.bonus.pos_y = height - data.bonus.pos_y;
		data.bonus.pos_x = width - data.bonus.pos_x;
		data.bonusconverted = true;
		return data;
	}

	useEffect(() => {
		if (isVisible) {
		  console.log('User came back to the page');
		//   socket.emit('user-left', {way: 0,roomName: data.current.NameOfRoom, playerNumber: data.current.player1.pNumber, time: Date.now()});
		} else
		{
		  console.log('User left the page');
		  socket.emit('user-left', {roomName: data.current.NameOfRoom, playerNumber: data.current.player1.pNumber, gameID: data.current.gameID});
		}
	  }, [isVisible]);
	  
const updateGame = async() => {
	if (!data.current.started)
	{
		console.log('game not started');
		return ;
	}
	const canvas = canvasRef.current!;
	if (!canvas)
	{
		console.log("canvas is null");
	}
	let ctx = null;
	if(canvas)
	{
	ctx = canvas.getContext('2d')!;
	if (data.current.player1.pNumber === 2 && !data.current.converted)
	{
		data.current = convert(data.current, canvas.height, canvas.width);
		//data.current = convertBonus(data.current, canvas.height, canvas.width);
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const newBallX = data.current.ball.pos_x + data.current.ball.speed_x;
	const newBallY = data.current.ball.pos_y + data.current.ball.speed_y;
	const newBonusX = data.current.bonus.pos_x + data.current.bonus.speed_x;
	const newBonusY = data.current.bonus.pos_y + data.current.bonus.speed_y;
	// limit max ball speed
	if ((data.current.ball.speed_x > 20) || (data.current.ball.speed_x < - 20)) {
		data.current.ball.speed_x = 20;
		data.current.ball.speed_y = 20;
	}
	// bounce off of left/right walls
	if ((newBallX < 0) || (newBallX > canvas.width)) {
		data.current.ball.speed_x = -data.current.ball.speed_x;
	}

	if(newBonusY < 0 || newBonusY > canvas.height) {
		data.current.bonus.speed_y = -data.current.bonus.speed_y;
	}

	if(newBonusX < 0 || newBonusX > canvas.width) {
		data.current.bonus.speed_x = -data.current.bonus.speed_x;
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

	if((newBonusY < 20 && (newBonusX >= data.current.player2.pos_x && newBonusX <= data.current.player2.pos_x + paddleSize)) || 
	(newBonusY > canvas.height - 20 && (newBonusX >= data.current.player1.pos_x && newBonusX <= data.current.player1.pos_x + paddleSize))) {
		if(data.current.bonusActive = true)
		{
			console.log('bonus collected');
			console.log('pnunber: ', data.current.player1.pNumber);
			data.current.bonusActive = false;
			data.current.bonus.pos_x = 100;
			data.current.bonus.pos_y = 100;

			if (data.current.player1.pNumber === 1)
			{
				socket.emit('bonus', {roomName: data.current.NameOfRoom, playerNumber: data.current.player1.pNumber});
			}
			if(data.current.player1.pNumber === 2)
			{
				socket.emit('bonus', {roomName: data.current.NameOfRoom, playerNumber: data.current.player1.pNumber});
			}
		}
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
		if(data.current.bonusActive === true)
		{
			data.current.bonus.pos_x = newBonusX;
			data.current.bonus.pos_y = newBonusY;
		}
	}
	// drawing elements - keep
	ctx.fillStyle = data.current.color;
	if (cowLogo) {
		ctx.drawImage(cowLogoImage, data.current.ball.pos_x - 20, data.current.ball.pos_y - 20, 40, 40);
	}
	if (data.current.paused > 0)
	ctx.fillText(data.current.paused.toString(), canvas.width / 2, canvas.height / 2);
	ctx.beginPath();
	if (data.current.bonusActive === true && data.current.gameType === 1)
	{
		ctx.arc(data.current.bonus.pos_x, data.current.bonus.pos_y, 10, 0, Math.PI * 2, true);
	}
	//adjuste ball to cow position
	ctx.roundRect(data.current.player2.pos_x, data.current.player2.pos_y, paddleSize, 10, 5);
	ctx.roundRect(data.current.player1.pos_x, canvas.height - 10, paddleSize, 10, 5);
	ctx.fill();
};
	}


	const SendInfo = (roomToSend: string) => {
		console.log('game-start-> message: ', {roomName: roomToSend, myId: content?.user, myName: content?.username, myAvatar: content?.avatar, playerNumber: data.current.player1.pNumber});
		socket.emit('exchange-info', {roomName: roomToSend, myId: content?.user, myName: content?.username, myAvatar: content?.avatar, playerNumber: data.current.player1.pNumber});
	};

const Paddles = (roomName: string, newDir: number) => {
	socket.emit('paddle-movement', {roomName:roomName, playerNumber: data.current.player1.pNumber, pos_x: data.current.player1.pos_x, newDir: newDir, speed: data.current.player1.speed});}

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

const sendhome = () => {
	try {
		const navigate = useNavigate();
		navigate('/home');
	}
	catch (e) {
		console.log('error sending home');
	}
}

const createMatch = async(user1ID: number, user2ID: number) => {
	const response = await fetch('http://localhost:8080/api/matches', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token,
		},
		body: JSON.stringify({user_1: user1ID, user_2: user2ID,})

	});
	if (response.ok)
	{
		const data = await response.json();
		return data;
	}
	else
	{
		console.log('error creating match');
	}

};

const postScore = async(score1: number, score2: number, over: number, gameID: number) => {
	const response = await fetch(`http://localhost:8080/api/matches/${gameID}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token,
		},
		body: JSON.stringify({
			score_1: score1,
			score_2: score2,
			status: over,
		})
	});
	if(!response.ok)
	{
		console.log('error posting score');
	}
};

const WaitingRoom = () => {
	socket.emit('waitList', {bonus : 0});
	data.current.gameType = 0;
};

const WaitingRoom_bonus = () => {
	socket.emit('waitList', {bonus : 1});
	data.current.gameType = 1;
};


	const handleKeyPress = (e: React.KeyboardEvent<Element>) => {
	switch (e.key) {
		case 'ArrowLeft':
		if(data.current.player1.pos_x >= 25)
			Paddles(data.current.NameOfRoom, -1);
		break;
		case 'ArrowRight':
		if(data.current.player1.pos_x <= 425)
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
	<button onClick={WaitingRoom}>Waiting Room</button>
	<button onClick={WaitingRoom_bonus}>Waiting Room bonus</button>
	<button onClick={()=>{data.current.color = 'pink'}}>PINK</button>
	<button onClick={()=>{data.current.color = 'blue'}}>BLUE</button>
	<ToastContainer/>
	</div>
	);
};

export default GameSocket;


/*
les différentes waitlist pour bonus ou pas de bonus n'ont pas d'impacte sur le bonus dans la partie
le bonus n'apparait pas la même chose sur les deux utilisateurs
la balle va trop vite quand le bonus est activé
le bonus n'ai pas activé quand la balle est sur le joueur 2

*/