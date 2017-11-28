import { publibPath, commonFetch } from './index';

export const getList = async () => {
  return commonFetch('users.getList');
};

export const create = async (formData) => {
  return commonFetch('users.create', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const login = async ({ accountType, identity, pwd }) => {
  return commonFetch(`users.login?accountType=${accountType}&identity=${identity}&pwd=${pwd}`);
};
