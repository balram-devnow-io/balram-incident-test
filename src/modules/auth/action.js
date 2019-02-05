import * as constants from './constants';
import { CALL_API } from '../../middlewares/api';
import { normalize } from './utils/Normalizer';

const API = {
  login(params) {
    return {
      [CALL_API]: {
        types: [constants.REQUEST_USER_LOGIN, constants.FAILURE_USER_LOGIN, constants.SUCCESS_USER_LOGIN],
        endpoint: 'user/auth',
        method: 'POST',
        body: params,
        type: 'json',
        normalizer: normalize
      }
    };
  }
};

export function loginUser(params) {
  return dispatch => {
    return dispatch(API.login(params));
  };
}