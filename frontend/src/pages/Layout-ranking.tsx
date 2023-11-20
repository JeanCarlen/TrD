import React from "react";
import { useState } from "react";
import './Stats.css';
import { gameData, User } from "./Stats";

type ranking = {
	user_id: number,
	username: string,
	avatar: string,
	ranking: number,
}

type props = {
	token: string,
}

const LayoutRanking: React.FC<props> = ({token}: props) => {
	const [ranked, setRanked] = useState(false);
	const [rankList, setRankList] = useState<ranking[]>([]);

	const fetchMatches = async () => {
		const response = await fetch('http://localhost:8080/api/matches/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
			});
			let data = await response.json();
			if (response.ok)
			{
				console.log("Successfully fetched all matches", data);
				return (data);
			}
			else
				console.log("Error fetching all matches", data);
	};

	const createUser = async (user_id: number, user_data: User) => {
		rankList[user_id] = {user_id: user_id, username: user_data.username, avatar: user_data.avatar, ranking: 0}
	}

	const calculateRanking = async () => {
		let matchList: gameData[] = await fetchMatches();
		let tempList: ranking[] = rankList;
		await Promise.all(matchList.map(async (match) => {
			if (tempList[match.user_1] === undefined)
				await createUser(match.user_1, match.user_1_data);
			if (tempList[match.user_2] === undefined)
				await createUser(match.user_2, match.user_2_data);
			if (match.score_1 > match.score_2)
			{
				console.log('ranklist: ',tempList);
				console.log('user1: ', tempList[match.user_1], match.user_1);
				console.log('user2: ', tempList[match.user_2], match.user_2);
				tempList[match.user_1].ranking += 2;
				tempList[match.user_2].ranking -= 1;
			}
			else if (match.score_1 < match.score_2)
			{
				tempList[match.user_2].ranking += 2;
				tempList[match.user_1].ranking -= 1;
			}
		}));
		await tempList.sort((a: ranking, b: ranking) => (a.ranking > b.ranking) ? -1 : 1);
		console.log('ranklist: ',tempList);
		setRankList(tempList);
		setRanked(true);
	}

	return (
		<div>
			{ranked ? <div style={{overflowY: 'scroll'}}>
				{rankList.map((line: ranking, index: number) => {
					return (
						<div className="game-stats">
							<div className="box" style={{width: '15vh'}}>{line.username}</div>
							<div className="box">#{index + 1}</div>
						</div>
					)
				})}
				</div> : <button onClick={calculateRanking}>Fetch matches</button>}


		</div>
	);
};

export default LayoutRanking;