import React from 'react';
import logo from '../cow.svg';
import './Game.css';


interface Position {
  x_position: number;
  y_position: number;
  yBall: number;
  xBall: number;
  
}

const GameBox: React.FC = () => {

  return (
	<div>
        <p>
          Here is your custom pong experience
        </p>
    <div className="containergame">
		<div className="field" content="width=device-width"> </div>
      <img src={logo} className='ball'/>
    <div className='middleLine'></div>
    	<div className='paddle1'></div>
    	<div className='paddle2'></div>
        <h1 className="player_1_score">0</h1>
        <h1 className="player_2_score">0</h1>
        <p className="message">
            Press Enter to Play Pong
        </p>
    </div>
    </div>
  );
};

export default GameBox;
