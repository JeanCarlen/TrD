import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import Sidebar from './Components/Sidebar';
import Users from './pages/Users';
import Game from './pages/LetsPlay';
import Chat from './pages/Chat';
import Stats from './pages/Stats';
import SignIn from './pages/SingIn';
import Home from './pages/Home';
import Logout from './pages/LogOut';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { BrowserRouter as Router} from "react-router-dom";
import Login from './LoginForm/LoginForm';
import { useNavigate } from 'react-router-dom';
import {Routes as Router, Route, Navigate, Outlet} from 'react-router-dom';
import RegisterButton from './LoginForm/RegisterButton';
import Cookies from 'js-cookie';


type Props = {}

const PrivateRoutes = () => {
	const isRegistered = Cookies.get('registered');
	const { authenticated } = useContext(AuthContext)

	if (isRegistered != 'true'){

		return <Navigate to='/login' replace />
	}

	return <Outlet />
}

const Routes = (props: Props) => {
	const navigate = useNavigate();
	return (
		<div className='loginTest'>
				<Router>
                <Route path="/login" element={<RegisterButton />} />
                <Route element={<PrivateRoutes />}>
                  <Route path="/Home" element={<Home />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/chats" element={<Chat />} />
                  <Route path="/statistics" element={<Stats />} />
                  <Route path="/Logout" element={<Logout />} />
				  <Route path='*' element={<Navigate to='/login' replace />} />
                </Route>
         	</Router>
        </div>
	)
}

export default Routes

