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
  roomName: string,
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
  const [content, setContent] = useState<{username: string, user: number, avatar: string}>();
  const [roomName, setRoomName] = useState<string>('');
  const [playerNumber, setPlayerNumber] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const token: string | undefined = Cookies.get("token");
  const intervalIdRef = useRef<number | null>(null);
  let intervalId: number= 0;
  let paddleSize: number = 1300;
  let newDir: number = 0;
  let cowLogoImage: HTMLImageElement = new Image();
  let canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>();

  let data: GameData = {
    roomName: '',
    player1: {
      id: 1,
      name: '',
      avatar: '',
      pos_y: 200,
      pos_x: 600,
    },
    player2: {
      id: 2,
      name: '',
      avatar: '',
      pos_y: 100,
      pos_x: 500,
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
    intervalId = window.setInterval(updateGame, 1000 / 60);
    cowLogoImage.src = cowLogo;
    socket.connect(); 
    // updateGame(data);
  },[]);

  useEffect(() => {

    if (token === undefined) {
      return;
      }
    setContent(decodeToken(token));

	socket.on('connect', () => {
	  console.log(socket.id);
	  console.log('Connected');
	  });

    socket.on('game-start', (data: GameData) => {
      console.log('game-start');
      setGameStarted(true);
    });
    
    socket.on('pong-init-setup', (playerNumber: number) => {
      console.log('recieved player number: ' + playerNumber);
      setPlayerNumber(playerNumber);
    });
  
    socket.on('bounce', (ball: Ball)=> {
      console.log('bounce');
      data.ball = ball;
    });
    
    socket.on('goal', (newScore: number, data: GameData) => {
      console.log('Game finished');

    });

    socket.on('paddle-movement', (newy1: number, newy2: number) => {
      console.log('paddle-movement');
      data.player1.pos_y = newy1;
      data.player2.pos_y = newy2;
    });

    return () => {
      socket.off('gameUpdate');
    };
    }, [socket]);

  const upateGame = (data: GameData) => {
    // console.log('lets start the game1');
    // if (gameStarted === true)
    // {
      console.log('lets start the game2');
      const canvas = canvasRef.current!;
      if (!canvas) return;
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
        data.ball.pos_x = canvas.width / 2;
        data.ball.pos_y = canvas.height / 2;
        data.ball.speed_x = 3;
        data.ball.speed_y = 5;
      }
      else if(newBallY > canvas.height) {
        data.score1++;
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
      ctx.drawImage(cowLogoImage, data.ball.pos_x, data.ball.pos_y, 20, 20);
      }
      ctx.beginPath();
      ctx.roundRect(data.player1.pos_x, canvas.height - 20, paddleSize, 10, 5);
      ctx.roundRect(data.player2.pos_x, 10, paddleSize, 10, 5);
      ctx.fill();
    // }
  };
  
	const gameOver = () => {
		socket.emit('game-over', { roomName: data.roomName});
    //fetch-> post score to batabse
	};

  const Paddles = () => {
    socket.emit('paddle-movement', { playerNumber: playerNumber, data: data, newDir: newDir});}

  const sendGame = () => {
	socket.emit('join-game', { roomName: data.roomName});
  };

  const Bounce = (newBallx: number, newBally: number, newSpeedx: number, newSpeedy: number) => {
    socket.emit('bounce', newBallx, newBally, newSpeedx, newSpeedy);
  };

  const CreatePongRoom = () => {
    const roomName = prompt("Enter a name for the new Game:");
    console.log("creating room:", roomName);
    socket.emit('create-room', {
        roomName: roomName,
      client: content?.user
    });
  };

  let updateGame:any = upateGame.bind(this);

  return (
	<div>
	<button onClick={CreatePongRoom}>Create Room</button>
	<input
	  type="text"
	  placeholder="Enter room name"
	  value={roomName}
	  onChange={(e) => setRoomName(e.target.value)}
	/>
	<button onClick={sendGame}>Join {data.roomName}</button>
	<button onClick={gameOver}>Game Over</button>
  {/* <PongGame/> */}
	</div>
    );
};

export default GameSocket;
