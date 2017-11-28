import * as R from 'ramda';

export const publicPath = '/1.0/';

export const commonFetch = async (url = '', config = {}) => {
  const extraConfig = {
    headers: {},
  };
  const token = window.localStorage.getItem('token');
  if (token) {
    extraConfig.headers.Authorization = `Bearer ${token}`;
  }

  const resp = await fetch(`${publicPath}${url}`, R.mergeDeepRight(extraConfig, config));
  let data;

  try {
    data = await resp.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return data.data;
  } catch (e) {
    if (!data && (resp.status < 200 || resp.status >= 400)) {
      throw new Error(resp.statusText);
    }

    throw e;
  }
};

