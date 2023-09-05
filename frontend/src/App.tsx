import logo from './cow.svg';
import './App.css';
import './index.css';
import LoginForm from './LoginForm/LoginForm';
import Sidebar from './Components/Sidebar';
import { BrowserRouter as Router, Route, BrowserRouter} from "react-router-dom";
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Routes from "./PrivateRoute"
import './LoginForm/PongGame.css'
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Notification from './Components/notif';

function App() {
	const [backendError, setBackendError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [info, setInfo] = useState(false);
  
	const handleBackendRequest = async () => {
	  try {
		// Make your backend request here
		const response = await fetch('http://localhost:3001/login');
  
		if (!response.ok) {
		  // Handle the error and set the backendError state
		  const errorData = await response.json();
		  setBackendError(errorData.message);
		  return;
		}
  
		// Process the response as normal
  
		// Show success notification
		setSuccess(true);
	  } catch (error) {
		console.error('An error occurred:', error);
		// Handle the error, and you can set the backendError state here as well if needed
  
		// Show error notification
		setBackendError('An error occurred.');
	  }
	};
  
	const handleInfo = () => {
	  // Show info notification
	  setInfo(true);
	};
  
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes />
		  <ToastContainer />
    		<Notification error={backendError} success={success} info={info} />
        </BrowserRouter>
      </header>
    </div>
  );

}

export default App;
