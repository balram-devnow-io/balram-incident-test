import Immutable from 'immutable';
import { normalizeSingle as normalizeUser } from '../../user/utils/Normalizer';

export function normalize(response) {
  const users = normalizeUser(response.user).users;

  return {
    token: response.token,
    users,
  }
};
