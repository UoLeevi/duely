import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'styles';

// // concurrent mode
// ReactDOM.unstable_createRoot(
//   document.getElementById('root')
// ).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// legacy mode
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
