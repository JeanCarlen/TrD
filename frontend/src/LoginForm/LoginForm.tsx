import React, { useState } from 'react';
import { Link } from 'react-router-dom'

// import './index.css';

function LoginForm() {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    // return data;

    //if (data.success) {
		//console.log(1);
	  //} else {
		//console.log(2);
	  //}
  };

  return (
    <div className='login-container'>
      <form className ="login-form" onSubmit={handleSubmit}>
        <input className='login-input'
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input className='login-input'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='login-button'
        type="submit">Log in with your 42 account</button>
      </form>
    </div>
  );
}

export default LoginForm;
