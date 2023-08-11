import logo from './cow.svg';
import './App.css';
import LoginForm from './LoginForm/LoginForm'
import './index.css'; // Import your custom CSS file

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
        <div className="login-container">
          <form className="login-form">
            <input className="login-input" type="text" placeholder="Username" />
            <input className="login-input" type="password" placeholder="Password" />
            <button className="login-button">Log In</button>
        </form>
      </div>
      </header>
    </div>
  );
}

export default App;
