import React from "react";
import './Home.css'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
// import {Routes as Navigate} from 'react-router-dom';
import { setUserStatus } from '../Redux-helpers/action';
import { useDispatch } from 'react-redux';
import { gsocket } from "../context/websocket.context";

type Props = {};
  
const Logout: React.FC<Props> = (props: Props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	let tokenVal = Cookies.get('token');
	if (!tokenVal) tokenVal = '';
	Cookies.set('token', tokenVal, { expires: -7 });
	dispatch(setUserStatus(0));
	gsocket.disconnect();
	navigate("/login");

	return (<h1>Goodbye</h1>);

};

export default Logout;

