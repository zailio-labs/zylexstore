import React from 'react';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import { SharedDataProvider } from './store';

const element = document.getElementById('root');

const root = createRoot(element);
root.render(
  <SharedDataProvider>
    <App />
  </SharedDataProvider>
);
