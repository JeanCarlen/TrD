import React, { useEffect } from "react";
import Cookies from "js-cookie";
import logo from "../cow.svg";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { useState } from "react";
import schoollogo from "../42_Logo.svg";
import "../pages/Home.css";
import "./RegisterButton.css";
import decodeToken from "../helpers/helpers";
import { toast } from "react-toastify";

const RegisterButton: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [open, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true); // State to track password matching
  const [showPassword, setShowPassword] = useState(false);
  const [valid, setValid] = useState<boolean>(false);
  const [token, setToken] = useState("");
  const [tokenContent, setTokenContent] = useState<JWTPayload>();

  useEffect(() => {
    // handleWelcome();
    const token: string | undefined = Cookies.get("token");
    if (token) {
      let content: JWTPayload = decodeToken(token);
      setToken(token);
      setTokenContent(content);
    }
    if (tokenContent && !tokenContent?.twofaenabled) {
      navigate("/Home");
    } else if (tokenContent && tokenContent?.twofaenabled)
      navigate("/authenticate");
  }, []);

  // Create a first achievment
  // const FirstAchievement = async () => {
  //   const isRegisteredCheck = Cookies.get("token");
  //   const response = await fetch("http://localhost:8080/api/auth/achievement", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + isRegisteredCheck,
  //     },
  //     body: JSON.stringify({
  //       title: "You Logged IN!",
  //       description: "You get this for logginng in for the first time!",
  //       objective: 1,
  //     }),
  //   });
  // };

  const handleLogin = async () => {
    if (username.trim() === "" || password.trim() === "") {
      toast.error("Fields cannot be empty.", {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "toast-error",
      });
      return;
    }
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      Cookies.set("token", data.token);
      navigate("/Home");
    } else {
      for (let i = 0; i < data.message.length; i++) {
        toast.error(data.message[i], {
          position: toast.POSITION.BOTTOM_LEFT,
          className: "toast-error",
        });
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error("Passwords do not match.", {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "toast-error",
      });
      return;
    } else if (
      username.trim() === "" ||
      password.trim() === "" ||
      confirmpassword.trim() === ""
    ) {
      toast.error("Fields cannot be empty.", {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "toast-error",
      });
      return;
    }
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        confirm_password: confirmpassword,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      Cookies.set("token", data.token);
      navigate("/Home");
    } else {
      for (let i = 0; i < data.message.length; i++) {
        toast.error(data.message[i], {
          position: toast.POSITION.BOTTOM_LEFT,
          className: "toast-error",
        });
      }
    }
  };

  const validatePassword = (input: string): boolean => {
    const hasCapitalLetter = /[A-Z]/.test(input);
    const hasNumber = /\d/.test(input);
    const isMinimumLength = input.length >= 8;
    return hasCapitalLetter && hasNumber && isMinimumLength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setValid(validatePassword(newPassword));
    setPasswordsMatch(e.target.value === confirmpassword); // Check if passwords match
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === password); // Check if passwords match
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const openForm = () => {
    setIsOpen(true);
    const test = document.getElementById("id1") as HTMLInputElement;
    test.style.display = "none";
  };

  const closeForm = () => {
    setIsOpen(false);
    RegisterButton(username, password);
    navigate("/Home");
    // If not empty, call the onLogin callback with the entered values
  };

  return (
    <div>
      <img src={logo} className="App-logo" alt="logo" />
      <p>Welcome to our Trance&Dance</p>
      <div className="loginbox">
        <div id="id1">
          <div className="container_row">
            <button className="login-button">
              <a
                href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-9ce743a9d6e296d270c36a928c02e3adc101d43c3a7905d66c9a2727b7640ad9&redirect_uri=https%3A%2F%2Ftrd.laendrun.ch%2Fapi%2Fauth%2Fcallback&response_type=code"
                rel="noopener noreferrer"
              >
                <img className="schoollogo" src={schoollogo} />
              </a>
            </button>
          </div>
          <form className="login-form">
            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
          <div className="container_row">
            <button
              className="login-button"
              type="submit"
              onClick={() => handleLogin()}
            >
              Log in
            </button>
          </div>
          <p style={{ fontSize: 18 }}>OR</p>
          <div className="container_row">
            <button className="login-button2" type="submit" onClick={openForm}>
              Create new account
            </button>
          </div>
        </div>
        {open && (
          <div>
            <p>Please enter the requested details</p>
            <form className="login-form">
              <input
                className="login-input"
                type="text"
                placeholder="Add your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                placeholder="Add your password"
                value={password}
                onChange={handlePasswordChange}
              />
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmpassword}
                onChange={handleConfirmPasswordChange}
              />
              <p>Password must meet the following criteria:</p>
              <ul>
                <li>At least one capital letter (A-Z)</li>
                <li>At least one number (0-9)</li>
                <li>Minimum length of 8 characters</li>
              </ul>
              {valid ? (
                <p className="authorized">Password is valid</p>
              ) : (
                <p className="warnings">Password is not valid.</p>
              )}
              {!passwordsMatch && (
                <p className="warnings">Passwords do not match</p>
              )}
              {!passwordsMatch || !valid ? (
                <button
                  className="login-button2"
                  disabled={true}
                  type="submit"
                  onClick={handleRegister}
                >
                  Submit
                </button>
              ) : (
                <button
                  className="login-button2"
                  disabled={false}
                  type="submit"
                  onClick={handleRegister}
                >
                  Submit
                </button>
              )}
              {/* {<div>You are logged in!</div>} */}
            </form>
          </div>
        )}
        {/* <Notification error={error} success={success} info={info} /> */}
      </div>
    </div>
  );
};

export default RegisterButton;
