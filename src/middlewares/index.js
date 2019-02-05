import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router'
import api from './api';

export default (history) => {
  return applyMiddleware(api, routerMiddleware(history), thunk);
};
