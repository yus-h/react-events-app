//Get React from installed node_modules
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router' ;
import { BrowserRouter, Route, Link } from 'react-router-dom';
import App from './components/app';
import reduxThunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';


import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(reduxThunk))
);

//Take this component's generated HTML  and put it on the page (in the DOM)
//ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    , document.querySelector('#root')
);

