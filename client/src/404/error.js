// src/components/NotFound.js

import React from 'react';
import { useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page <code>{location.pathname}</code> does not exist.</p>
    </div>
  );
};

export default NotFound;
