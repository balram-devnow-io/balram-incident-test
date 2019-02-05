import Immutable from 'immutable';
import {
  REQUEST_USER_LOGIN,
  FAILURE_USER_LOGIN,
  SUCCESS_USER_LOGIN,
  REQUEST_PASSWORD_RESET
} from './constants';
import { handleReducer } from '../../utils/reducer';
// import cookie from 'react-cookie';

const initialState = Immutable.Map({
  loading: false,
  error: {},
});

const handlers = {};

handlers[REQUEST_USER_LOGIN] = (state) => {
  return state.set('loading', true);
};

handlers[FAILURE_USER_LOGIN] = (state, action) => {
  state = state.set('loading', false);
  return state.set('error', action.payload);
};

handlers[SUCCESS_USER_LOGIN] = (state, action) => {
  const auth = action.payload;
  const loggedInUser = auth.users.all.get(auth.users.list[0]);
  // cookie.save('token', auth.token, { path: '/' });
  // cookie.save('active_user_guid', loggedInUser.get('guid'), { path: '/' });
  // cookie.save('active_account_guid', loggedInUser.get('accountGuid'), { path: '/' });

  state = state.set('loading', false);
  return state.set('error', {});
};

export default handleReducer(initialState, handlers);
