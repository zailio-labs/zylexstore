import React, { useEffect, useContext, useState } from "react";
import "./login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { socket } from '../../socket';
import { SharedDataContext } from '../../store';
import useMetadata from '../../helmet';

function LoginForm() {
  const helmet = useMetadata('login');
  const location = useLocation();
  const { loginInfo, setloginInfo } = useContext(SharedDataContext);
  const storedUser = localStorage.getItem('AUTH-T');
  const User = storedUser ? JSON.parse(storedUser) : {};
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const getCurrPath = sessionStorage.getItem("currentUrl");
    if (!getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('previousUrl', undefined);
    } else if (location.pathname !== getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('previousUrl', getCurrPath);
    }

    if (User && User.reg_pkocd) {
      if (sessionStorage.getItem("previousUrl")) {
        navigate(sessionStorage.getItem("previousUrl"), { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }

    if (loginInfo.status === true) {
      const { message, type } = loginInfo;
      setloginInfo({
        status: false,
        message: '',
        type: null
      });
      handleLoginMessage(message, type);
    }
  }, [User, loginInfo, location.pathname, navigate, setloginInfo]);

  const handleLoginMessage = (message, type) => {
    const ebox = document.querySelector(".login-error");
    const eboxv = document.querySelector(".login-error p");

    ebox.style.display = 'block';
    eboxv.style = `color:${type === 'error' ? 'red' : 'green'};font-size:17px;text-align:center;`;
    eboxv.innerText = message;

    setTimeout(() => {
      ebox.style.display = 'none';
    }, 3500);
  };

  const checkMail = async (e) => {
    e.preventDefault();
    if (!email) {
      setLoginError("Please fill the email address!");
    } else if (!password || password.length < 8) {
      setLoginError("Please fill the password option, it must contain 8 characters");
    } else {
      socket.emit('login-confirm', { mail: email, password });
      setLoginError('');
    }
  };

  useEffect(() => {
    const handleLoginValidate = (a) => {
      const ebox = document.querySelector(".login-error");
      const eboxv = document.querySelector(".login-error p");

      if (a === 'user not found') {
        ebox.style.display = 'block';
        eboxv.style = 'color:red;font-size:17px;text-align:center;';
        eboxv.innerText = "User not found!";
      } else if (a === 'password mismatch') {
        ebox.style.display = 'block';
        eboxv.style = 'color:red;font-size:17px;text-align:center;';
        eboxv.innerText = "Invalid password, try again later!";
      } else {
        localStorage.setItem('AUTH-T', JSON.stringify(a));
        if (sessionStorage.getItem("previousUrl")) {
          navigate(sessionStorage.getItem("previousUrl"), { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    };

    socket.on('login-validate', handleLoginValidate);

    return () => {
      socket.off('login-validate', handleLoginValidate);
    };
  }, [navigate]);

  return (
    <div>
      {helmet}
      <div className="login-form">
        <h2>Login to your account</h2>
        <form onSubmit={checkMail} noValidate>
          <div className="login-error" style={{ display: loginError ? 'block' : 'none' }}>
            <p>{loginError}</p>
          </div>
          <label htmlFor="inputEmail">Email id or Username</label>
          <input
            type="email"
            id="inputEmail"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="inputPassword">Password</label>
          <input
            type="password"
            id="inputPassword"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <p id="reg">
            Don't have an account? 
            <Link to="/register">
              <span> Register</span>
            </Link>
          </p>
        </form>
      </div>
      <div>
        <p className="forgot">
          Did you forget your password? 
          <Link to="/forgot">
            <span> Click here!</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
