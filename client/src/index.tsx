import { Global } from '@emotion/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import reportWebVitals from './reportWebVitals';
import reset from './reset';
// cutcard때 폰트 설정이 없었음.
ReactDOM.render(
  <React.StrictMode>
    <Global styles={reset} />
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();