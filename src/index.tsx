import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import Main from './Main'; // ★ここを Main に変更

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Main /> {/* ★ここも Main に変更 */}
  </React.StrictMode>
);
