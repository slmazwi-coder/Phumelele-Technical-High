import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const DATA_VERSION = 'pths-v1';
if (localStorage.getItem('data_version') !== DATA_VERSION) {
  Object.keys(localStorage)
    .filter(k => k.startsWith('pths_'))
    .forEach(k => localStorage.removeItem(k));
  localStorage.setItem('data_version', DATA_VERSION);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
