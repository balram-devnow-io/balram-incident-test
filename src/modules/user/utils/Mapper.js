import Entity from './Entity';

class Mapper {

  constructor(state) {
    this.state = state;
  }

  get(userGuid) {
    const users = this.state.users.get('all');
    const user = users.get(userGuid);

    if (user !== undefined) {
      return new Entity(user.toJS());
    }

    return null;
  }

  getAll(list = []) {
    if (!list.length) {
      list = this.state.users.get('list')
    }

    return list.map((userGuid) => this.get(userGuid));
  }
}

export default Mapper;
