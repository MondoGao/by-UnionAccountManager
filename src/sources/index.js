export const publibPath = '/1.0/';

export const commonFetch = async (...fetchArgs) => {
  const extraConfig = {
    headers: {},
  };
  const token = window.localStorage.getItem('token');
  if (token) {
    extraConfig.headers.Authorization = `Bearer ${token}`;
  }

  const resp = await fetch(fetchArgs[0], {
    ...extraConfig,
    ...fetchArgs[1],
  });
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

