import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import decodeToken from '../helpers/helpers';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const TurnOn2fa: React.FC<{}> = () => {
	const [active, setActive] = useState(false)
	const [qrCode, setQrCode] = useState('')
	const [code, setCode] = useState('')
	const [token, setToken] = useState('')
	const [tokenContent, setTokenContent] = useState<JWTPayload>()

	useEffect(() => {
		const token: string|undefined = Cookies.get('token')
		if (token) {
			let content: JWTPayload = decodeToken(token)
			setToken(token)
			setTokenContent(content)
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
		if (code == '') {
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
			setTokenContent(decodeToken(data.token))
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
					<button onClick={turnOn}>Activer</button>
				</div>
					<button onClick={cancel}>Annuler</button>
			</div>
		:
			<div>
				<button onClick={activate}>Turn On 2FA</button>
			</div>
		}
		<ToastContainer />
		</>
	)
}

export default TurnOn2fa;