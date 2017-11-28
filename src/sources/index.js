export const publibPath = `/1.0/`;

export const commonFetch = async (...fetchArgs) => {
  const resp = await fetch(...fetchArgs);
  let data;

  try {
    data = await resp.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return data;
  } catch (e) {
    if (!data && (resp.status < 200 || resp.status >= 400)) {
      throw new Error(resp.statusText);
    }

    throw e;
  }
};

