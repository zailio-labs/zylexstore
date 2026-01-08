import React, { useEffect, useState } from 'react';
import './forgot.css';
import { socket } from '../../socket';
import { useLocation } from "react-router-dom";

const Forgot = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const getCurrPath = sessionStorage.getItem("currentUrl");
    if (!getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('previousUrl', undefined);
    } else if (location.pathname !== getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('previousUrl', getCurrPath);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleForgotInfo = (response) => {
      setIsSending(false);
      if (response === 'no mail') {
        setErrorMessage("Unable to process your request");
        setInfoMessage('');
      } else {
        setInfoMessage("Successfully sent reset mail, check your mailbox!");
        setErrorMessage('');
      }
    };

    socket.on('forgot-info', handleForgotInfo);

    return () => {
      socket.off('forgot-info', handleForgotInfo);
    };
  }, []);

  const send = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('Sending...');
    setIsSending(true);

    socket.emit('check-forgot', { mail: email });
  };

  return (
    <div className="forgot-main">
      <form onSubmit={send} className="forgot-form">
        <h2>Enter your Email id</h2>
        {errorMessage && (
          <div className="error-forgot">
            <p>{errorMessage}</p>
          </div>
        )}
        <p className="forgot-info">
          Oops, forgot your password? No worries! Please enter your email address below to begin the password recovery process. We'll send you a link to reset your password shortly. Thank you for your cooperation!
        </p>
        <input
          type="email"
          placeholder="Enter your email address!"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {infoMessage && (
          <p className="info-forgot">{infoMessage}</p>
        )}
        <button type="submit" disabled={isSending}>
          {isSending ? 'SENDING...' : 'SUBMIT'}
        </button>
      </form>
    </div>
  );
};

export default Forgot;
