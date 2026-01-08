import React, { createContext, useState } from 'react';

export const SharedDataContext = createContext();

export const SharedDataProvider = ({ children }) => {
  const [loginInfo, setloginInfo] = useState({
    status: false,
    message: '',
    type: null
  });

  return (
    <SharedDataContext.Provider value={{ loginInfo, setloginInfo }}>
      {children}
    </SharedDataContext.Provider>
  );
};