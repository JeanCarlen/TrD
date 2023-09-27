import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Cookies from 'js-cookie'
import decodeToken from '../helpers/helpers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TurnOn2fa from '../Components/TurnOn2fa';
import TurnOff2fa from '../Components/TurnOff2fa';

const MFASetup: React.FC<{}> = () => {
	const [token, setToken] = useState('')
	const [tokenContent, setTokenContent] = useState<JWTPayload>()

	useEffect(() => {
		const token: string | undefined = Cookies.get("token");
		if (token != undefined) {
			let content: JWTPayload = decodeToken(token)
			setToken(token)
			setTokenContent(content)
		}
	}, [])


	return (
		<>
			<Sidebar />
			<h3>MFA SETUP PAGE</h3>
			{ !tokenContent?.twofaenabled ?
				<TurnOn2fa />
			:
				<TurnOff2fa />
			}
		</>
	)
}

export default MFASetup;