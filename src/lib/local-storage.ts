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

export const loadState = () => {
  try {
    const serializedState = localStorage.get("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    console.log(`En localstorage ${e}`);
  }
};
