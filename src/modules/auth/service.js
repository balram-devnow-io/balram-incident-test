import { loginUser } from './action';

export default function(dispatch) {
  function login(params) {
    return dispatch(loginUser(params));
  }

  return {
    login
  };
}
