import React from 'react'; // ★この1行が足りなかった！
import ReactDOM from 'react-dom/client';
import './style.css';
import App from './App'; // 

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
