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
          <LoginForm/>
          <>
           <Router>
            <Sidebar/>
            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
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
