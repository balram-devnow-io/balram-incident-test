const setObject = (object, key, value) => {

  if (typeof key === 'undefined') {
    return object;
  }

  let keys = key.split('.');
  const len = keys.length;
  let index;

  for (index = 1; index < len; index++) {
    key = keys.shift();

    if (!object.hasOwnProperty(key) || typeof (object[key]) !== 'object') {
      object[key] = {};
    }

    object = object[key];
  }
  object[keys.shift()] = value;
};

export default function formHelper() {

  function setParams(params) {
    let key;
    for (key in params) {
      if (key.indexOf('.') !== -1) {
        setObject(params, key, params[key]);
        delete params[key];
      }
    }
    return params;
  }

  return {
    setParams,
  };
}
