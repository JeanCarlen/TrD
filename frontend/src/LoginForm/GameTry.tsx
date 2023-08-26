import React from 'react';
import logo from '../cow.svg';
import './Game.css';

const GameBox: React.FC = () => {

  return (
	<div>
        <p>
          Here is your custom pong experience
        </p>
		<div className="CusRect"></div>
	</div>
  );
};

export default GameBox;