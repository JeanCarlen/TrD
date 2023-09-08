import React, { useEffect } from 'react';
import Cookies from 'js-cookie'
import logo from '../cow.svg';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { useState } from 'react';
import Home from '../pages/Home';
import schoollogo from '../42_Logo.svg';
import '../pages/Home.css'
import './RegisterButton.css'


const RegisterButton: React.FC = () => {
	const navigate = useNavigate();
	const [password, setPassword] = useState('');
	const [confirmpassword, setConfirmPassword] = useState('');
	const [open, setIsOpen] = useState(false);
	const [username, setUsername] = useState('');
	const [passwordsMatch, setPasswordsMatch] = useState(true); // State to track password matching

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

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		setPasswordsMatch(e.target.value === confirmpassword); // Check if passwords match
	  };

	const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value);
		setPasswordsMatch(e.target.value === password); // Check if passwords match
	  };

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!passwordsMatch)
			// Passwords don't match, show an error message or take appropriate action
			alert('Passwords do not match');
		else if (username.trim() === '' || password.trim() === '' || confirmpassword.trim() === '') {
		  	alert('Fields cannot be empty');
		} else {
		  // Passwords match, you can proceed with form submission or other actions
			Cookies.set('registered', 'true', { expires: 0.00496 }); // Expires in 5 min days
			navigate('/Home');
		}
		// If not empty, call the onLogin callback with the entered values
		//   RegisterButton(username, password);
	};

	const handleRegisterClick = () => {
		Cookies.set('registered', 'true', { expires: 0.00496 }); // Expires in 5 min days
		alert('You are now registered!');
		navigate('/Home');
	};


	const openForm = () => {
		setIsOpen(true);
		const test = document.getElementById("id1") as HTMLInputElement
		test.style.display = "none";
	}

	const closeForm = () => {
		Cookies.set('registered', 'true', { expires: 0.00496 }); // Expires in 5 min days
		setIsOpen(false);
		RegisterButton(username, password);
		navigate('/Home');
		  // If not empty, call the onLogin callback with the entered values
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
			<img className='schoollogo' src={schoollogo}/>
		</button>
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
          onChange={handlePasswordChange}/>
		  <input className='login-input'
          type="text"
          placeholder="Confirm your password"
          value={confirmpassword}
          onChange={handleConfirmPasswordChange} />
     	{!passwordsMatch && <p className='warnings'>Passwords do not match</p>}
		  <button className='login-button2' disabled={!passwordsMatch} type="submit" onClick={handleSubmit}>Submit</button>
		{/* {<div>You are logged in!</div>} */}
		</form>
		</div>}
	</div>
	</div>
  );
};

export default RegisterButton;
