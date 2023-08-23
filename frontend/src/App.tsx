import React from 'react';
import logo from './cow.svg';
import './App.css';
import './index.css';
import LoginForm from './LoginForm/LoginForm';
import Sidebar from './Components/Sidebar';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Users from './pages/Users';
import Game from './pages/LetsPlay';
import Chat from './pages/Chat';
import Stats from './pages/Stats';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        </p>
        <a>
          Hello loosers
        </a>
        <div>
          <>
           <Router>
            <Sidebar/>
            <div className='loginTest'>
              <LoginForm/>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/game" element={<Game />} />
                <Route path="/chats" element={<Chat />} />
                <Route path="/statistics" element={<Stats />} />
              </Routes>
            </div>
           </Router>
          </>
          </div>
      </header>
     </div>
  );
}

export default App;
