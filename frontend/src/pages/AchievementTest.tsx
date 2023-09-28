import React, {useState, useEffect} from 'react';
import Sidebar from '../Components/Sidebar';
import Cookies from 'js-cookie';
import './Stats.css';
import { autoGetFetch } from '../helpers/helpers';

type achievementData={
	id: number;
	title: string;
	description: string;
	objective: number;
}

const AchTest: React.FC = () => {
	
	const [achieve, setAchieve] = useState([]);
	const [fetched, setFetched] = useState<boolean>(false);

	
	const GetAchieve = async() => {
		setFetched(false);
		const token = Cookies.get('token');

		const response = await fetch ('http://localhost:8080/api/achievments', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		})
		const data =  await response.json();
		//const print = JSON.stringify(data);
		if (response.ok)
		{
			setAchieve(data);
			setFetched(true);
		}
	}

	useEffect(() => {
		GetAchieve();
	}, []);
	
	// setAchieve(autoGetFetch("achievments"));
	// setFetched(true)

	return(
		<div>
			<Sidebar/>
			ACHIEVE! and be amazed!
			<br/>
			<div className="grid">
			{fetched ? <div className="history_1">
				{achieve.map((achievement: achievementData) => {
					return (
						<div key={achievement.id} className="game-stats" style={{flexDirection: "column"}}>
						<div className='box'>title: {achievement.title}</div>
						<div className='box'>description: {achievement.description}</div>
						</div>
					);
				})}
			</div> : <div className="history_1"> Loading...</div>}
			</div>
			<button onClick={GetAchieve}>
				NO ACHIEVE?
			</button>
		</div>
	)
}

export default AchTest