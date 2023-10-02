import React, {useState, useEffect} from 'react';
import Sidebar from '../Components/Sidebar';
import Cookies from 'js-cookie';
import './Stats.css';
import { autoGetFetch } from '../helpers/helpers';
import decodeToken from '../helpers/helpers';

type achievementData={
	id: number;
	title: string;
	description: string;
	objective: number;
}

const AchTest: React.FC = () => {
	
	const [achieve, setAchieve] = useState([]);
	const [userAchieve, setUserAchieve] = useState([]);
	// const [userId, setUserId] = useState<number>(0);
	const [fetched, setFetched] = useState<boolean>(false);
	const [userFetched, setUserFetched] = useState<boolean>(false);
	const [posted, setPosted] = useState<boolean>(false);


	const CreateAchieve = async() => {
		setPosted(false);
		const token: string|undefined = Cookies.get("token");
		let content: {username: string, user: number};
		if (token != undefined)
		{
			content = decodeToken(token);
		}
		else
			content = { username: 'default', user: 0};
		const response = await fetch ('http://localhost:8080/api/userachievments', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
			body: JSON.stringify({current:0, user_id: content.user, achievment_id:1})
		})
		setPosted(true);
		GetUserAchieve();
	}
	
	const GetUserAchieve = async() => {
		setUserFetched(false);
		const token: string|undefined = Cookies.get("token");
		let content: {username: string, user: number};
		if (token != undefined)
		{
			content = decodeToken(token);
		}
		else
			content = { username: 'default', user: 0};

		const response = await fetch (`http://localhost:8080/api/userachievments/users/${content.user}`, {
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
			setUserAchieve(data);
			setUserFetched(true);
			console.log("user: ",content.user);
		}
	}

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
		GetUserAchieve();
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
			{userFetched ? <div className="history_1">
				{/* {userAchieve.map((achievement: achievementData) => {
					return (
						<div key={achievement.id} className="game-stats" style={{flexDirection: "column"}}>
						<div className='box'>title: {achievement.title}</div>
						<div className='box'>description: {achievement.description}</div>
						</div>
					);
				})} */}
				{JSON.stringify(userAchieve)}
			</div> : <div className="history_1"> Loading...</div>}
			</div>
			<button onClick={GetAchieve}>
				NO ACHIEVE?
			</button>
			<button onClick={CreateAchieve}>
				ADD USER ACHIEVE
			</button>
		</div>
	)
}

export default AchTest