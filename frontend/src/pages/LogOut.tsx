import React, {useContext} from "react";
// import styled from 'styled-components'
import './Home.css'
import Sidebar from '../Components/Sidebar'
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { WebsocketContext } from "../context/websocket.context";
import {Routes as Router, Route, Navigate, Outlet} from 'react-router-dom';
import { globalSocket } from "../PrivateRoute";
import { useSelector } from 'react-redux';
import { setUserStatus } from '../Redux-helpers/action';
import { useDispatch } from 'react-redux';
import { gsocket } from "../context/websocket.context";
// import {isRegistered} from '../PrivateRoute'


type Props = {}

const Logout = (props: Props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	// const socket = useContext(WebsocketContext);
	// const socket = globalSocket;
	// Cookies.set('registered', 'false', {expires: 7});
	let tokenVal = Cookies.get('token');
	if (!tokenVal)
		tokenVal = '';
	Cookies.set('token', tokenVal, { expires: -7})
	dispatch(setUserStatus('Offline'));
	gsocket.disconnect();
	return <Navigate to='/login' replace />
}

export default Logout;

