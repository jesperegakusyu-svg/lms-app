import React from 'react'; // ★この1行が足りなかった！
import ReactDOM from 'react-dom/client';
import App from './App'; // ※ファイル名をAppに変えた場合
// もしファイル名が App.tsx のままなら import App from './App'; にしてください
// 念のため、今回は前回ファイル名変更した「App」前提で書きます

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
