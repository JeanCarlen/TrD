import React, {useState, useEffect} from 'react';
import Sidebar from '../Components/Sidebar';
import Cookies from 'js-cookie';

interface achlist{
	id: number,
	title: string,
	description: string,
	objective: number,
}

const AchTest: React.FC = () => {
	
	const [achieve, setAchieve] = useState([]);
	const [fetched, setFetched] = useState<boolean>(false);
	const [parsed, setParsed] = useState();

	
	const GetAchieve = async() => {
		
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
			console.log(achieve[0]);
			console.log(achieve[1]);
			setFetched(true);
			console.log("BUTTON TIME!");
		}
	}

	useEffect(() => {
		GetAchieve();
	}, []);


	return(
		<div>
			<Sidebar/>
			ACHIEVE!
			<br/>
			{fetched ?
			<p>
				{achieve.map((employee) => {
					return (
						<div key={employee.id}>
						<h2>title: {employee.title}</h2>
						<h2>description: {employee.description}</h2>

						<hr />
						</div>
					);
				})}
			</p> : <p> NOT FETCHED YET</p>}
			<button onClick={GetAchieve}>
				NO ACHIEVE?
			</button>
		</div>
	)
}

export default AchTest