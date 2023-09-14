import React from 'react';
import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../pages/Chat.css';

interface User{
	id: string;
	name: string;
	// email: string;
	// avatar: string;
	// otp_enabled: string;
}

interface Authresponse{
	token: string;
	user: User;
}

const GoogleAuth: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);


	const onSuccess = async (rep: any) => {
		  const response = await fetch('http://localhost:8080/api/auth/otp/generate', {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({ token: rep?.tokenId }),
		  });

		  if (response.ok) {
			const result: Authresponse = await response.json();
			setUser(user);
		  } else {
			console.log("Error:", response.status, response.statusText);
		  }
		}
	return (
		<div>
		<button className='sendButton'>Google Sign-In Example</button>
		{/* <GoogleOAuthProvider
		  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
		>
		  { <GoogleLogin
			onSuccess={onSuccess}
			// buttonText="Sign in with Google"
		  /> }
		</GoogleOAuthProvider> */}
	  </div>
	);
};


export default GoogleAuth;


