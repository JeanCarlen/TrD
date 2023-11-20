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
import { Provider } from 'react-redux';
import store from './Redux-helpers/store';
import { WebsocketContextProvider, socket, WebsocketContext } from './context/websocket.context';

function App() {
  return (
		<div className='App'>
			<Provider store={store}>
			<WebsocketContextProvider value={socket}>
				<BrowserRouter>
					<Routes />
				</BrowserRouter>
			</WebsocketContextProvider>
			</Provider>
		</div>
  );
}

export default App;
