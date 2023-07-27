import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './components/index.css';
import { RecoilRoot } from 'recoil';


import App from './components/App';
import { BrowserRouter as Router } from "react-router-dom";


ReactDOM.render(
    <RecoilRoot>
    <Router>
        <App />
    </Router>
  </RecoilRoot>,
  document.getElementById('root')
);