import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify'

const TurnOff2fa: React.FC<{}> = () => {
	const [token, setToken] = useState('');
	const [code, setCode] = useState('');

	useEffect(() => {
		const token: string|undefined = Cookies.get('token')
		if (token) {
			setToken(token)
		}
	}, [])

	const turnOff = async (e: React.FormEvent) => {
		const response = await fetch('http://localhost:8080/api/auth/2fa', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({code: code})
		})
		const data = await response.json()
		console.log (data);
		Cookies.set('token', data.token)
		toast.success(data.message[0], {
			position: toast.POSITION.BOTTOM_LEFT,
			className: 'toast-success'
		})
	}

	const updateCode = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCode(e.target.value);
	}

	return (
		<>
			<div>
				<input onChange={updateCode} type="text" value={code}></input>
				<button onClick={turnOff}>Désactiver</button>
			</div>
			<ToastContainer />
		</>
	)
}

export default TurnOff2fa;