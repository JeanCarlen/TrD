import React, {useState} from 'react';
import Sidebar from '../Components/Sidebar';
import Cookies from 'js-cookie';

const AchTest: React.FC = () => {
	
	const [achieve, setAchieve] = useState('');
	
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
			console.log("YOU DID CLICK THE BUTTON MOTHERFUCKER")
			console.log(data);
		}
	}

	return(
		<div>
			<Sidebar/>
			ACHIEVE!
			<br/>
			{/* {achieve.map((elem) => (
				<div key=(elem.id)>
				<h2>(elem.title)</h2>
				<h2>(elem.description)</h2>
				</div>
			))} */}
			<pre>{JSON.stringify(achieve, null, 2)}</pre>
			<br/>
			<button onClick={GetAchieve}>
				NO ACHIEVE?
			</button>
		</div>
	)
}

export default AchTest