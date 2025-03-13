export const saveItem = (key, data) => {
  try {
    localStorage.setItem(key, data);
    return;
  } catch (error) {
    return { error };
  }
};
