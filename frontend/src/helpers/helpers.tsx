import jwt_decode from "jwt-decode";
import {useState} from 'react';
import Cookies from 'js-cookie';

export default function decodeToken(token: string): JWTPayload {

	const payload: JWTPayload= jwt_decode(token)
	return (payload);
}

export function  AutoGetFetch(path: string): any
{
	const [achieve, setAchieve] = useState([]);
	const [fetched, setFetched] = useState<boolean>(false);

	const GetAchieve = async(fetchPath: string) => {
		const token = Cookies.get('token');

		const response = await fetch (`http://localhost:8080/api/${fetchPath}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		})
		const data =  await response.json();
		if (response.ok)
		{
			setAchieve(data);
			setFetched(true);
		}
	}

	GetAchieve(path);
	while (!fetched)
	{console.log("waiting...");}
	return (achieve);
}