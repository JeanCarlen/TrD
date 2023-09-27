import React from "react";
import './Stats.css';
import { gameInfo } from "./Stats";

const LayoutGamestats: React.FunctionComponent<gameInfo> = ({score1, score2, player1, player2}: gameInfo) => {
	
	let winLoose: string;

	if (score1 > score2)
		winLoose = 'WON';
	else
		winLoose = 'LOST';

	return (
	<div className="game-stats">
	<div className='box' style={{fontSize:"25px"}}>{player1} - {player2}</div>
	<div className='box'>{score1}</div>
	<div className='box'>{score2}</div>
	<div className='box' style={winLoose=='WON' ? {color:"green"} : {color:"RED"}}>{winLoose}</div>
	</div>
	)
}


export default LayoutGamestats;