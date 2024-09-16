import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from '@web3-react/core'
import { store } from './redux/store';

function getLibrary(provider) {
  console.log("providerprovider");
  return new Web3Provider(provider);
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store} >
      <Web3ReactProvider getLibrary={(getLibrary)}>
        <App />
      </Web3ReactProvider>
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
