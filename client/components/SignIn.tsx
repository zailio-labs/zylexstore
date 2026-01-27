"use client";

import React, { useState } from 'react';
import { AuthModal } from './AuthModal';

const SignIn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleSwitchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <>
      <button
        onClick={() => {
          setMode('signin');
          setIsOpen(true);
        }}
        className="text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect"
      >
        Login
      </button>
      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={mode}
        onSwitchMode={handleSwitchMode}
      />
    </>
  );
};

export default SignIn;
