import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import App from './components/App';
import reducers from './reducers';
import { fetchElements } from './actions';

// /* eslint-disable no-underscore-dangle */
// const ext = window.__REDUX_DEVTOOLS_EXTENSION__;
// const devtoolMiddleware = ext && ext();
// /* eslint-enable */

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    // devtoolMiddleware,
  ),
);

store.dispatch(fetchElements());

ReactDOM.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
