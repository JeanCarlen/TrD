import React, { useEffect } from 'react';
import Cookies from "js-cookie";
import { gsocket } from "./context/websocket.context";
import { useNavigate } from "react-router-dom";




const MoveAction: React.FC = () => {
	const token: string | undefined = Cookies.get("token");
	const navigate = useNavigate();

	useEffect(()=>{
		if (token === undefined)
		{
			gsocket.disconnect()
			navigate('/login');
			return ;
		}
		else
			gsocket.emit('moveRoom');
		return;
	},[]);
}

export default MoveAction;