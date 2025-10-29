// Utility helpers for user-scoped localStorage keys

export const getActiveUserKey = () => {
  const userKey = localStorage.getItem("current_user_key");
  return userKey || "guest";
};

export const makeUserScopedKey = (base) => {
  const key = getActiveUserKey();
  return `${base}_${key}`;
};

export const setActiveUserKey = (key) => {
  if (!key) return;
  localStorage.setItem("current_user_key", key);
};

export const clearActiveUserKey = () => {
  localStorage.removeItem("current_user_key");
};


