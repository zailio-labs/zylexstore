import React, { useState, useEffect } from "react";
import "./mail.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { makeid } from '../../fn/fn';
import { socket } from '../../socket';
import useMetadata from '../../helmet';

const Mail = () => {
  const helmet = useMetadata('register');
  const location = useLocation();
  const storedUser = localStorage.getItem('AUTH-T');
  const User = storedUser ? JSON.parse(storedUser) : {};
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

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
      navigate('/', { replace: true });
    }
  }, [User, location.pathname, navigate]);

  useEffect(() => {
    const handleRegisterResponse = (response) => {
      if (response === 'already used username') {
        setError('Username already taken');
      } else if (response === 'already used mail') {
        setError(`'${email}' already used!`);
      } else if (response === true) {
        const from_ref_id = User?.from_ref_id || false;
        socket.emit('mail-register', {
          mail: email,
          id: makeid(12),
          from_ref_id,
          next_my_ref: makeid(7),
          password,
          username,
          typeLogin: email.includes('@') ? 'email' : 'wa',
        });
        setInfoMessage("Check your mailbox, we sent an email");
        setContent("Sending...");
      }
    };

    const handleRegisterSend = (message) => {
      if (message === false) {
        setInfoMessage("There was a problem with email registration");
        setStatusMessage('<p onClick="wa()">click here to try with WhatsApp</p>');
      } else {
        setInfoMessage("Mail sent successfully");
      }
    };

    socket.on('checked-register', handleRegisterResponse);
    socket.on('register-send', handleRegisterSend);

    return () => {
      socket.off('checked-register', handleRegisterResponse);
      socket.off('register-send', handleRegisterSend);
    };
  }, [email, password, username, User]);

  const wa = () => {
    setError('');
    setInfoMessage('');
    setStatusMessage('');
    setEmail('');
    document.getElementById("email").type = 'number';
    document.getElementById("email").placeholder = 'Enter your WhatsApp number with country code';
  };

  const submit = (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setStatusMessage('');

    if (username.match(/[A-Z!@#$%^&*()_+-]/g)) {
      setError("Username must be in lowercase characters without symbols!");
    } else if (password.length < 8) {
      setError("Password must contain 8 or more characters");
    } else {
      socket.emit('check-register', {
        username: username.trim(),
        mail: email,
        type: email.includes('@') ? 'email' : 'wa',
      });
    }
  };

  return (
    <div>
      {helmet}
      <div className="information-register" style={{ display: infoMessage ? 'block' : 'none' }}>
        <p id="message-register">{infoMessage}</p>
        <p id="status-register" dangerouslySetInnerHTML={{ __html: statusMessage }}></p>
      </div>
      <form className="mail-register" onSubmit={submit}>
        <h2>Send SMS</h2>
        <div className="error" style={{ display: error ? 'block' : 'none' }}>
          <p id="p">{error}</p>
        </div>
        <input type="text" placeholder="Username" required id="u_name" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" required id="email" placeholder="E-mail address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required id="pass" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">SEND OTP</button>
      </form>
    </div>
  );
}

export default Mail;
