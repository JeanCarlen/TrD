import React from "react";
import './Stats.css';

const LayoutGamestats: React.FunctionComponent = () => {
	return (
	<div className="game-stats">
	<h2>PLAYERS</h2>
	<div className='box'>SCORE</div>
	<div className='box'>TIME</div>
	<div className='box'>LAYOUT</div>
	<div className='box'>GAMETYPE</div>
	<div className='box'>ENEMY</div>
	<div className='box'>CR CHANGES</div>
	</div>
	)
}


export default LayoutGamestats;