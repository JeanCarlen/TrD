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
import Profiles from './Social/Profiles';
import { useNavigate } from 'react-router-dom';
import {Routes as Router, Route, Navigate, Outlet} from 'react-router-dom';
import RegisterButton from './LoginForm/RegisterButton';
import Cookies from 'js-cookie';
import { isToken } from 'typescript';
import decodeToken from './helpers/helpers';
import { useParams } from 'react-router-dom';


type Props = {}

const PrivateRoutes = () => {
	const isRegistered = Cookies.get('registered');
	const isToken: string|undefined  = Cookies.get('token');
	let content: {username: string, user: number};
	const { authenticated } = useContext(AuthContext)

	if (!isToken || isToken == undefined){
		content = { username: 'default', user: 0};
		return <Navigate to='/login' replace />
	}
	else
	{
		content = decodeToken(isToken);
		return <Outlet />
	}

}
const Routes = (props: Props) => {
	const navigate = useNavigate();
	return (
		<div className='loginTest'>
				<Router>
				<Route path="/login" element={<RegisterButton />} />
				<Route element={<PrivateRoutes />}>
					<Route path="/Home" element={<Home />} />
					{/* <Route path="/users" element={<Users />} /> */}
					<Route path="/game" element={<Game />} />
					<Route path="/chats" Component={Chat} />
					{/* element={<Chat />} /> */}
					<Route path="/statistics" element={<Stats />} />
					{/* <Route path="/profiles" element={<Profiles />} /> */}
					<Route path="/profiles/:users" element={<Profiles />} />
					{/* <Route path="/profile" element={<Profiles />} /> */}
					<Route path="/Logout" element={<Logout />} />
				<Route path='*' element={<Navigate to='/login' replace />} />
				</Route>
			</Router>
		</div>
	)
}

export default Routes
