import React, { useEffect } from 'react';
import Cookies from 'js-cookie'
import logo from '../cow.svg';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { useState } from 'react';
import Home from '../pages/Home';


const RegisterButton: React.FC = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
  	const [password, setPassword] = useState('');
	const [repassword, confirmPassword] = useState('');
	const [open, setIsOpen] = useState(false);


	const handleWelcome = () => {
		const isRegisteredCheck = Cookies.get('registered');
		// If the user is registered, redirect to the Home page
		if (isRegisteredCheck === 'true') {
			navigate('/Home');
		}
	}

	const handleLogin = async () => {
		const response = await fetch('http://localhost:8080/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});
		const data = await response.json()
		console.log(data);
	}

	useEffect(() => {
		handleWelcome();
	}, []);

	const handleRegisterClick = () => {
		Cookies.set('registered', 'true', { expires: 0.00496 }); // Expires in 7 days
		alert('You are now registered!');
		navigate('/Home');
	};

	const openForm = () => {
		setIsOpen(true);
		const test = document.getElementById("id1") as HTMLInputElement
		test.style.display = "none";
	}

	const closeForm = () => {
		setIsOpen(false);
	}

  return (
	  <div >
     <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to our Trance&Dance
        </p>
		<div className='loginbox'>
		<div id="id1">
		<div className="container_row">
		<button className='login-button' onClick={handleRegisterClick}>
		Log in with your 42 account</button>
	</div>
		<form className ="login-form">
        <input className='login-input'
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
		    <input className='login-input'
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
		</form>
	<div className="container_row">
		<button className='login-button'
			type="submit" onClick={() => handleLogin()}>Log in</button>
			</div>
		<p style={{fontSize: 18}}>
			OR
		</p>
	<div className="container_row">
		<button className='login-button2'
		type="submit" onClick={openForm}>Create new account</button>
		{/* <Form open={open}/> */}
		</div>
		</div>
		{open && <div>
		<p>
			Please enter the requested details
		</p>
		<form className ="login-form">
        <input className='login-input'
          type="text"
          placeholder="Add your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
		    <input className='login-input'
          type="text"
          placeholder="Add your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
		    <input className='login-input'
          type="text"
          placeholder="Reconfirm your password"
          value={repassword}
          onChange={(e) => confirmPassword(e.target.value)}
          />
		  <button className='login-button2'
		type="submit" onClick={closeForm}>Submit</button>
		{<div>You are logged in!</div>}
		</form>
		</div>}
	</div>
	</div>
  );
};

export default RegisterButton;
