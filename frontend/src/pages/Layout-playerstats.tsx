import React from "react";
import './Stats.css';
import { gameData } from "./Stats";
import {ChakraProvider,} from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'


type Props = {
	data: gameData[],
	User: {username: string, user: number, avatar: string},
}

const LayoutPLayerstats: React.FunctionComponent<Props> = ({data, User}: Props) => {
	

	let wins: number = 0;
	let loss: number = 0;
	let percentage: number = 0;

	data.forEach((element)=> {
		if (element.status === 0)
			return;
		if (element.user_1 === User?.user)
		{
			if (element.score_1 > element.score_2)
				wins++;
			else
				loss++;
		}
		else if (element.user_2 === User?.user)
		{
			if (element.score_2 > element.score_1)
				wins++;
			else
				loss++;
		}
	});

	if (wins + loss > 0)
		percentage = Math.round((wins / (wins + loss)) * 100);
	else
		percentage = 0;

	return (
	<ChakraProvider>
	<div className="game-stats">
	<Avatar size="2xl" src={User?.avatar}/>
	<h2>{User?.username}</h2>
	<div className='box' style={{color:"green"}}>wins: {wins}</div>
	<div className='box' style={{color:"red"}}>loss: {loss}</div>
	<div className='box'>Win rate: {percentage}%</div>
	</div>
	</ChakraProvider>
	)
}


export default LayoutPLayerstats;