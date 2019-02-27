//Get React from installed node_modules
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router' ;
import { BrowserRouter, Route, Link } from 'react-router-dom';
import App from './components/app';

//Take this component's generated HTML  and put it on the page (in the DOM)
//ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
    <App/>
    , document.getElementById('root'));


