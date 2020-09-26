import React from 'react';
import { toast } from 'react-toastify';
import { Provider } from 'react-redux';
import Router from './router/router';
import createStore from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/index.scss';
import 'react-toastify/dist/ReactToastify.min.css';

toast.configure();
const store = createStore();

const App = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App;
