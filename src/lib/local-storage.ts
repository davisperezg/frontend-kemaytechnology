export const getLocal = (val: string) => {
  return localStorage.getItem(val);
};

export const setLocal = (key: string, val: string) => {
  return localStorage.setItem(key, val);
};

export const deleteLocal = (val: string) => {
  return localStorage.removeItem(val);
};

export const clearAllLocal = () => {
  return localStorage.clear();
};
