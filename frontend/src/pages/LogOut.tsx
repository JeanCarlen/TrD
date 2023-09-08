import React from "react";
// import styled from 'styled-components'
import './Home.css'
import Sidebar from '../Components/Sidebar'
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {Routes as Router, Route, Navigate, Outlet} from 'react-router-dom';
// import {isRegistered} from '../PrivateRoute'

type Props = {}

const Logout = (props: Props) => {
	const navigate = useNavigate();
	Cookies.set('registered', 'false', {expires: 7});
	return <Navigate to='/login' replace />
}

export default Logout;

