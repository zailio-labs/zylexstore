import React, { useState, useEffect, useContext } from 'react';
import './reset.css';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { socket } from '../../socket';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SharedDataContext } from '../../store';

const Reset = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setloginInfo } = useContext(SharedDataContext);
  const { code, forgot } = useParams();
  const [eyeSeePass, setEyeSeePass] = useState(false);
  const [eyeSeeConfirm, setEyeSeeConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

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
    if (code.length !== 12) {
      setloginInfo({
        status: true,
        message: 'The service is currently unavailable',
        type: 'error'
      });
      navigate('/login', { replace: true });
    } else {
      socket.emit('reset-data', { code, forgot });
      socket.on('reset-response', (response) => {
        if (!response) {
          setloginInfo({
            status: true,
            message: 'Server returned not OK status code.',
            type: 'error'
          });
          navigate('/login', { replace: true });
        }
      });
    }

    return () => {
      socket.off('reset-response');
    };
  }, [code, forgot, setloginInfo, navigate]);

  const handlePasswordToggle = () => {
    setEyeSeePass(!eyeSeePass);
  };

  const handleConfirmToggle = () => {
    setEyeSeeConfirm(!eyeSeeConfirm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8 || confirm.length < 8) {
      setError("Password must contain at least 8 characters.");
      setPassword("");
      setConfirm("");
      setTimeout(() => setError(''), 2500);
    } else if (password !== confirm) {
      setError("Password and confirm password do not match.");
      setPassword("");
      setConfirm("");
      setTimeout(() => setError(''), 2500);
    } else {
      socket.emit('reset-pass', { code, password });
      socket.on('reset-status', (status) => {
        if (!status) {
          setError("You have already used that password, try another.");
          setTimeout(() => setError(''), 3000);
        } else {
          setloginInfo({
            status: true,
            message: 'Congratulations! Your password has been successfully reset.',
            type: 'info'
          });
          navigate('/login', { replace: true });
        }
      });
    }
  };

  return (
    <div className="reset-main">
      <form className="reset-form" onSubmit={handleSubmit}>
        <h2>Enter your new password</h2>
        {error && (
          <div className="reset-error">
            <p>{error}</p>
          </div>
        )}
        <div className="reset-pass">
          <input
            type={eyeSeePass ? 'text' : 'password'}
            className="reset-pass-hold"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i className="icon" onClick={handlePasswordToggle}>
            {eyeSeePass ? <FaEyeSlash /> : <FaEye />}
          </i>
        </div>
        <div className="reset-pass-confirm">
          <input
            type={eyeSeeConfirm ? 'text' : 'password'}
            className="reset-confirm-hold"
            placeholder="Confirm your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <i className="icon" onClick={handleConfirmToggle}>
            {eyeSeeConfirm ? <FaEyeSlash /> : <FaEye />}
          </i>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

export default Reset;
