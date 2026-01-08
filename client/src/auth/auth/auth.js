import React, { useEffect } from "react";
import "./auth.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { socket } from '../../socket';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { code, type, otp } = useParams();

  useEffect(() => {
    const getCurrPath = sessionStorage.getItem("currentUrl");
    if (!getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('previousUrl', undefined);
    } else if (location.pathname !== getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('previousUrl', getCurrPath);
    }
    if (!type || type !== 'auth') {
      navigate("/register", { replace: true });
    }

    socket.emit('authentication-send', code);

    const handleAuthNotFound = () => {
      navigate("/register", { replace: true });
    };

    const handleAuthError = (e) => {
      const errorElement = document.querySelector('.authentication-error');
      if (errorElement) {
        errorElement.style.display = 'block';
        const errorText = errorElement.querySelector('p');
        if (errorText) {
          errorText.innerText = e;
        }
      }
    };

    const handleAuthSuccess = (pkod) => {
      localStorage.setItem('AUTH-T', JSON.stringify(pkod));
      navigate("/", { replace: true });
    };

    socket.on('authentication-not-found', handleAuthNotFound);
    socket.on('authentication-error', handleAuthError);
    socket.on('authentication-success', handleAuthSuccess);

    return () => {
      socket.off('authentication-not-found', handleAuthNotFound);
      socket.off('authentication-error', handleAuthError);
      socket.off('authentication-success', handleAuthSuccess);
    };
  }, [code, type, navigate, location.pathname]);

  const submit = (e) => {
    e.preventDefault();
    const errorElement = document.querySelector('.authentication-error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
    const mail = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    if (password.length < 8) {
      if (errorElement) {
        errorElement.style.display = 'block';
        const errorText = errorElement.querySelector('p');
        if (errorText) {
          errorText.innerText = 'Password must contain 8 or more characters';
        }
      }
    } else {
      socket.emit('authentication-validate', { mail, password, otp, code });
    }
  };

  return (
    <div>
      <form onSubmit={submit} className="authentication-form">
        <h2>AUTHENTICATION</h2>
        <div className="authentication-error" style={{ display: 'none' }}>
          <p align="center"></p>
        </div>
        <input type="email" placeholder="Enter your email id" name="email" />
        <input type="password" placeholder="Password" name="password" />
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

export default Auth;
