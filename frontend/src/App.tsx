import React, {useEffect, useContext} from 'react';
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
import { WebsocketContextProvider, gsocket, WebsocketContext } from './context/websocket.context';
import { ToastContainer, toast } from 'react-toastify';
import { gsocket } from './context/websocket.context';

function App() {

  return (
		<div className='text-center w-full h-full overflow-auto pt-24 px-2.5 min-h-screen bg-center bg-cover box-border relative h-14 bg-gradient-to-r from-violet-500 to-fuchsia-500'>
			<Provider store={store}>
			<WebsocketContextProvider value={socket}>
				<BrowserRouter>
					<Routes />
				</BrowserRouter>
			</WebsocketContextProvider>
			<ToastContainer/>
			</Provider>
		</div>
  );
}

export default App;
