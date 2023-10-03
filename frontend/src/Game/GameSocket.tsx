import React, { useState, useContext, useEffect, useRef } from "react";
import { WebsocketContext } from "../context/websocket.context";
import { io, Socket } from 'socket.io-client';
import PongGame	from './PongGame';

interface GameState {
	players: Player[];
	scores: Score[];
	events: GameEvent[];
  }
  
  interface Player {
	id: string;
	name: string;
	position: { x: number; y: number };
  }
  
  interface Score {
	playerId: string;
	score: number;
  }
  
  interface GameEvent {
	type: string;
	data: any;
  }
  
const GameSocket: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>();
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('gameCreated', (data: any) => {
		console.log(`Game Created! ID is: ${data.gameId}`);
		console.log(`${data.username} created Game: ${data.gameId}`);
    });

    return () => {
      socket.off('gameUpdate');
    };
  }, [socket]);

  const sendGame = () => {
    socket.emit('makeGame');
  };

  return (
	<div>
	<button onClick={sendGame}>Create Game</button>
	<PongGame/>
	</div>
    );
};

export default GameSocket;
