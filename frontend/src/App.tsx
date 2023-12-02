import React from 'react';
import './App.css';
import './index.css';
import { BrowserRouter as BrowserRouter} from "react-router-dom";
import Routes from "./PrivateRoute"
import './Game/PongGame.css'
import { Provider } from 'react-redux';
import store from './Redux-helpers/store';
import { WebsocketContextProvider, socket } from './context/websocket.context';
import { ToastContainer, toast } from 'react-toastify';

function App() {

  return (
		<div className='App'>
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
