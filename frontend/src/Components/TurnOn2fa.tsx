import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import decodeToken from '../helpers/helpers';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@chakra-ui/react'

const TurnOn2fa: React.FC<{}> = () => {
	const [active, setActive] = useState(false)
	const [qrCode, setQrCode] = useState('')
	const [code, setCode] = useState('')
	const [token, setToken] = useState('')
	useEffect(() => {
		const token: string|undefined = Cookies.get('token')
		if (token) {
			setToken(token)
		}
	}, [])

	const updateCode = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCode(e.target.value)
	}

	const activate = async (e: React.FormEvent) => {
		setActive(true)
		const response = await fetch('http://localhost:8080/api/auth/2fa/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		});
		const data = await response.text()
		setQrCode(data)
	}

	const turnOn = async (e: React.FormEvent) => {
		if (code === '') {
			toast.error('Code cannot be empty.', {
				position: toast.POSITION.BOTTOM_LEFT,
				className: 'toast-error'
			})
			return ;
		}

		const response = await fetch('http://localhost:8080/api/auth/2fa/turn-on', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({code: code})
		})
		const data = await response.json()
		if (response.ok)
		{
			Cookies.set('token', data.token)
			toast.success(data.message[0], {
				position: toast.POSITION.BOTTOM_LEFT,
				className: 'toast-success'
			})
		}
	}

	const cancel = (e: React.FormEvent) => {
		setActive(false);
	}

	return (
		<>
		{ active ?
			<div>
				<img src={qrCode} alt="MFA Google Authenticator Configuration QR CODE" />
				<div>
					<input onChange={updateCode} type="text" value={code}></input>
					<Button colorScheme='pink' onClick={turnOn}>Activer</Button>
				</div>
					<Button colorScheme='pink' onClick={cancel}>Annuler</Button>
			</div>
		:
			<div>
				<Button colorScheme="pink" onClick={activate}>Turn On 2FA</Button>
			</div>
		}
		<ToastContainer />
		</>
	)
}

export default TurnOn2fa;