import React, {useContext} from 'react';
import logo from './cow.svg';
import './App.css';
import './index.css';
import Sidebar from './Components/Sidebar';
import { BrowserRouter as Router, Route, BrowserRouter} from "react-router-dom";
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Routes from "./PrivateRoute"
import './Game/PongGame.css'
import { WebsocketContextProvider, socket, WebsocketContext } from './context/websocket.context';


function App() {
  return (
		<div className='App'>
			<WebsocketContextProvider value={socket}>
				<BrowserRouter>
					<Routes />
				</BrowserRouter>
			</WebsocketContextProvider>
		</div>
  );
}

export default App;
