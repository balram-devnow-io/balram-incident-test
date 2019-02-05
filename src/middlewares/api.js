import fetch from 'isomorphic-fetch';
// import cookie from 'react-cookie';
import _ from 'lodash';
import { config } from '../config';

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(endpoint, method, headers, body, type, formData) {
  const fullUrl = (endpoint.indexOf(config.API_URL) === -1) ? config.API_URL + endpoint : endpoint;

  headers = _.assign({
    'Accept': 'application/json',
    'Version': 'v1'
  }, headers);

  if (type === 'json') {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  if (formData === true) {
    let data = new FormData();
    Object.keys(body).forEach(function(fieldName) {
      if (typeof body[fieldName] === 'object' && !(body[fieldName] instanceof File) && !(body[fieldName] instanceof Blob)) {
        Object.keys(body[fieldName]).forEach(function(key)  {
          data.append(fieldName + '[' + key + ']', body[fieldName][key]);
        })
      } else {
        data.append(fieldName, body[fieldName]);
      }
    })
    body = data;
  }

  // if (cookie.load('token')) {
  //   headers['X-Auth-Token'] = cookie.load('token');
  // }

  // if (cookie.load('token')) {
  //   headers['X-Auth-Token'] = cookie.load('token');
  // }

  const opts = {
    method,
    headers,
    body
  };

  return fetch(fullUrl, opts);
}

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];

  if (typeof callAPI === 'undefined' || callAPI === null) {
    return next(action);
  }

  let { endpoint } = callAPI;

  const {
    types,
    method = 'GET',
    headers = {},
    body,
    type,
    formData = false,
    page = null,
    normalizer
  } = callAPI;

  if (typeof endpoint !== 'string') {
    throw new Error('Expected endpoint URL to be string.');
  }

  if (normalizer && typeof normalizer !== 'function') {
    throw new Error('Specify the normalizer to be a function.');
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }

  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  if (page != null) {
    const separator = endpoint.indexOf('?') !== -1 ? '&' : '?';
    endpoint = `${endpoint}${separator}page=${page}`;
  }

  const [requestType, failureType, successType] = types;
  const actionWith = data => {
    const finalAction = _.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  };

  next(actionWith({ type: requestType }));

  return callApi(endpoint, method, headers, body, type, formData).then(
    (response) => {
      if (response.status === 204) {
        return next(actionWith({
          type: successType
        }));
      }

      return response.json().then(json => {
        if (json.error) {
          return next(actionWith({
            payload: json,
            type: failureType
          }));
        } else {
          if (normalizer) {
            json = normalizer(json);
          }
          return next(actionWith({
            payload: json,
            type: successType
          }));
        }
      });
    }
  );
};
