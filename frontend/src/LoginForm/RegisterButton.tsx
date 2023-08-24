import React, { useEffect } from 'react';
import Cookies from 'js-cookie'
import logo from '../cow.svg';
import { useNavigate } from 'react-router-dom';


const RegisterButton: React.FC = () => {
	const navigate = useNavigate();


	const handleWelcome = () => {
		const isRegisteredCheck = Cookies.get('registered');
		// If the user is registered, redirect to the Home page
		if (isRegisteredCheck === 'true') {
			navigate('/Home');
		}
	}

	useEffect(() => {
		handleWelcome();
	}, []);

	const handleRegisterClick = () => {
		Cookies.set('registered', 'true', { expires: 7 }); // Expires in 7 days
		alert('You are now registered!');
		navigate('/Home');
	};

  return (
	<div>
     <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to our Trance&Dance
        </p>
    <button className='login-button' onClick={handleRegisterClick}>
      Log in with your 42 account
    </button>
	</div>
  );
};

export default RegisterButton;
