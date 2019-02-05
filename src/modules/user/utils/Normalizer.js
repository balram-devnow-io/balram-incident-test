import Immutable from 'immutable';

export function normalizeSingle(response) {
  return {
    users: {
      all: Immutable.Map([[response.guid, Immutable.Map(response)]]),
      list: [response.guid],
    },
  };
};

export function normalizeArray(response) {
  let normalizedResponse = {};

  response.data.forEach(item => {
    if (!Object.keys(normalizedResponse).length) {
      normalizedResponse = normalizeSingle(item);
    } else {
      const user = normalizeSingle(item);
      if (normalizedResponse.users && user.users) {
        normalizedResponse.users.all = normalizedResponse.users.all.merge(user.users.all);
        normalizedResponse.users.list = normalizedResponse.users.list.concat(user.users.all);
      }
    }
  });

  if (response.meta) {
    normalizedResponse.users.meta = {
      count: response.meta.pagination.count,
      total: response.meta.pagination.total,
      currentPage: response.meta.pagination.current_page,
      perPage: response.meta.pagination.per_page,
      totalPages: response.meta.pagination.total_pages,
    }
  }

  return normalizedResponse;
};
