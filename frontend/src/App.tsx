import React from 'react';
import logo from './cow.svg';
import './App.css';
import './index.css';
import Sidebar from './Components/Sidebar';
import { BrowserRouter as Router, Route, BrowserRouter} from "react-router-dom";
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Routes from "./PrivateRoute"
import './Game/PongGame.css'

function App() {
  return (
        <div className='App'>
          {/* <LoginForm /> */}
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
          {/* <> */}
           {/* <Router>
            <Sidebar/>
            <div className='loginTest'>
              <Routes>
                <Route path="/login" element={<SignIn />} />
                <Route element={<PrivateRoutes />}>
                  <Route path='/' element={<Home />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/chats" element={<Chat />} />
                  <Route path="/statistics" element={<Stats />} />
                </Route>
              </Routes>
            </div>
           </Router> */}
          {/* </> */}
          </div>
  );
}

export default App;
