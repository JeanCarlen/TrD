import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Cookies from 'js-cookie'
import decodeToken from '../helpers/helpers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../pages/Chat.css'
import { useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa'

const Enter2Fa: React.FC<{}> = () => {
	const [token, setToken] = useState('')
	const [tokenContent, setTokenContent] = useState<JWTPayload>()
	const [code, setCode] = useState('');
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate()

	useEffect(() => {
		const token: string | undefined = Cookies.get("token");
		if (token !== undefined) {
			let content: JWTPayload = decodeToken(token)
			setToken(token)
			setTokenContent(content)
		}
		if (!token)
			navigate('/Login');
	}, [])

	const updateCode = (e: React.ChangeEvent<HTMLInputElement>) =>{
		setCode(e.target.value);
	}

	const authenticate = async (e: React.FormEvent) => {
		setLoading(true);
		const response = await fetch('http://localhost:8080/api/auth/2fa/authenticate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({code: code})
		})
		const data = await response.json()
		setLoading(false);
		if (response.ok)
		{
			Cookies.set('token', data.token);
			navigate('/Home');
		}
		else
		{
			toast.error(data.message[0], {
				position: toast.POSITION.BOTTOM_LEFT,
				className: 'toast-error'
			})
		}
	}

	return (
		<>
			{ loading ? <><FaIcons.FaSpinner className="spinner"/></>:<></>}
			<h3>Authentification multi-facteurs</h3>
			<p>Entrez le code fourni par votre application dans le champ ci-dessous, puis cliquez sur "Valider"</p>
			<input type="text" value={code} onChange={updateCode}></input>
			<p>{code}</p>
			<button onClick={authenticate}>Se connecter</button>
		</>
	)
}

export default Enter2Fa;