import React from 'react';
import ReactDOM from 'react-dom';
import ReceivedData from './components/ReceivedData';
import MainInput from './components/MainInput'
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';

/* eslint-disable no-underscore-dangle */
const ext = window.__REDUX_DEVTOOLS_EXTENSION__;
const devtoolMiddleware = ext && ext();
/* eslint-enable */

const store = createStore(
    reducers,
    compose(
        applyMiddleware(thunk),
        devtoolMiddleware,
    ),
);

ReactDOM.render(
    <Provider store={store}>
        <MainInput />
        <ReceivedData />
    </Provider>, 
document.getElementById('root'));
