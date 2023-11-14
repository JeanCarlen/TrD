import React, {useState, useEffect} from "react";
import './Stats.css';
import Sidebar from "../Components/Sidebar";
import LayoutGamestats from "./Layout-gamestats";
import LayoutPlayerstats from "./Layout-playerstats"
import Cookies from 'js-cookie'
import decodeToken from '../helpers/helpers'

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

	const [gameFetched, setGameFetched] = useState<boolean>(false);
	const [alldata, setAllData] = useState<gameData[]>([]);
	const token: string|undefined = Cookies.get("token");
	let content: {username: string, user: number, avatar: string};

	const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

	useEffect (() => {
		fetchMatches();
	}, []);


	const fetchMatches = async () => {
		const response = await fetch('http://localhost:8080/api/matches', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
			});
		if (response.ok)
		{
			let data = await response.json();
			data.sort((a: gameData, b: gameData) => (a.id > b.id) ? 1 : -1);
			setGameFetched(true);
			setAllData(data.reverse());
		}
		else
		{
			console.log("Error fetching matches");
		}
	}

	if (token != undefined)
      content = decodeToken(token);
    else
      content = { username: 'default', user: 0, avatar: 'http://localhost:8080/images/default.png'}

	return (
    <div className='stats-container'>
      <Sidebar />
      <div className='text'>
      </div>
      <div className='grid' style={{paddingBottom:"10vh"}}>
          {/* <h2>Match History</h2> */}
        <div className='history_1' style={{overflowY:"auto"}}>
			<LayoutPlayerstats data={alldata} User={content}/>
		</div>

		{gameFetched ? 
			<div className='history_1'>
			{alldata.map((stat: gameData) => {
					return (
						<LayoutGamestats display={stat} userID={content.user}/>
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
