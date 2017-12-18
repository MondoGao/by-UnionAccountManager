import { commonFetch } from './index';

export const getList = async () => commonFetch('users.getList');

export const getById = async id => commonFetch(`users.getByID?_id=${id}`);

const createAlterFunc = type => async formData => commonFetch(`users.${type}`, {
  method: 'POST',
  body: JSON.stringify(formData),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const create = createAlterFunc('create');
export const update = createAlterFunc('update');

export const login = async ({ accountType, identity, pwd }) => commonFetch(`users.login?accountType=${accountType}&identity=${identity}&pwd=${pwd}`);
