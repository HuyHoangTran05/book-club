const AUTH_TOKEN_KEY = "auth_token";

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem("token");
}

export function getCurrentUser() {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
