import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import logo from '../cow.svg';
import { AuthContext } from '../AuthContext';
import '../index.css';
import Home from '../pages/Home';
import App from '../App';


// function LoginForm() {

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const response = await fetch('http://localhost:3001/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username, password }),
//     });

    // const data = await response.json();

    // return data;

    //if (data.success) {
		//console.log(1);
	  //} else {
		//console.log(2);
	  //}
  // };
const Login = () => {
  // const [isActive, setIsActive] = useState<boolean>(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {authenticated, setAuthenticated} = useContext(AuthContext)

  const navigate = useNavigate();
  const handleLogin = () => {
      // e.preventDefault(); {
    //   const response = await fetch('http://localhost:3001/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    //   body: JSON.stringify({ username, password }),
      setAuthenticated(true)
      navigate('/Home')
    //   const data = await response.json();
    }

  return (
    <div>
     <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to our Trance&Dance
        </p>
      {/* <div className='login-container'>
      <form className ="login-form">
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
          /> */}
        <button className='login-button'
        type="submit" onClick={() => handleLogin()}>Log in with your 42 account</button>
      {/* </form> */}
    {/* </div> */}
  </div>
  );
}

export default Login;
// onSubmit={handleLogin}
