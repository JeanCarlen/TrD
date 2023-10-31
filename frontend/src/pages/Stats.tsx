import React, {useState, useEffect} from "react";
import './Stats.css';
import Sidebar from "../Components/Sidebar";
import LayoutGamestats from "./Layout-gamestats";
import LayoutPlayerstats from "./Layout-playerstats"
import { autoGetFetch } from "../helpers/helpers";

export interface gameInfo{
	score1: number,
	score2: number,
	player1: string,
	player2:string,
};

export type User = {
	username: string,
	login42: string,
	avatar: string,
}

export type gameData = {
	id: number,
	score_1: number,
	score_2: number,
	status: number // 0 = ongoing, 1 = finished
	status_text_en: string,
	status_text_fr: string,
	user_1: number,
	user_1_data: User,
	user_2: number,
	user_2_data: User,
}

const Stats: React.FunctionComponent = () => {
  

	const [gameFetched, setGameFetched] = useState<boolean>(false)

	const data1: gameInfo= {
		score1: 11,
		score2: 2,
		player1: 'Steve',
		player2: 'Patrick',
	}
	
	const data2: gameInfo= {
		score1: 6,
		score2: 11,
		player1: 'Steve',
		player2: 'Jcarlen',
	}

	const alldata: gameInfo[]= [data1, data2];

	const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

	const yourFunction = async () => {
		await delay(5000);
		setGameFetched(true);
	  };

	useEffect (() => {
		yourFunction();
	}, []);

	return (
    <div className='stats-container'>
      <Sidebar />
      <div className='text'>
      </div>
      <div className='grid' style={{paddingBottom:"10vh"}}>
          {/* <h2>Match History</h2> */}
        <div className='history_1' style={{overflowY:"auto"}}>
			<LayoutPlayerstats/>
		</div>

		{gameFetched ? 
			<div className='history_1'>
			{alldata.map((achievement) => {
					return (
						<LayoutGamestats {...achievement}/>
					);
			})}
			</div>
			: <div className='history_1' style={{fontSize:"25px"}}>Loading...</div>
		}
        
        <div className='hf'>
          <h2>Achievements</h2>
          <div className='box'>
            here is bobby, bobby is a nice dude
        </div>
        </div>
      </div>
      </div>
  )
}

export default Stats;
