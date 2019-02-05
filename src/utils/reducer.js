import Immutable from 'immutable';

export function handleReducer(initial, handlers) {
  return (state = initial, action) => {
    const handler = handlers[action.type];

    if (!handler) {
      return state;
    }

    return handler(state, action);
  };
}

export function setPaginatorReducerState(state, action) {
  state = state.set('loading', false);
  state = state.set('error', {});
  state = state.set('meta', action.payload.meta);
  if (state.get('meta').currentPage != 1) {
    state = state.set('list', state.get('list').concat(action.payload.list));
  } else {
    state = state.set('list', action.payload.list);
  }
  return state.set('all', state.get('all').merge(action.payload.all));
}

export function setErrorReducerState(state, action) {
  state = state.set('errors', Immutable.Map(action.payload.errors));
  state = state.set('message', action.payload.message);
  state = state.set('code', action.payload.code);
  return state.set('statusCode', action.payload.statusCode);
}
