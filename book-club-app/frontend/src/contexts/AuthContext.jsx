import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_TOKEN_KEY, clearAuthToken, getAuthToken, setAuthToken } from "../services/api.js";
import * as authService from "../services/authService.js";

const AuthContext = createContext(null);

function getStoredToken() {
  return getAuthToken();
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = getStoredToken();

    if (!currentToken) {
      setToken(null);
      setUser(null);
      return null;
    }

    try {
      const currentUser = await authService.getCurrentUser();
      setToken(currentToken);
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      clearSession();
      return null;
    }
  }, [clearSession]);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      setIsLoading(true);
      await refreshUser();

      if (isMounted) {
        setIsLoading(false);
      }
    }

    loadSession();

    function handleUnauthorized() {
      clearSession();
    }

    function handleStorage(event) {
      if (event.key === AUTH_TOKEN_KEY && !event.newValue) {
        clearSession();
      }
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    window.addEventListener("storage", handleStorage);

    return () => {
      isMounted = false;
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
      window.removeEventListener("storage", handleStorage);
    };
  }, [clearSession, refreshUser]);

  const login = useCallback(async (payload) => {
    const result = await authService.login(payload);

    if (result.token) {
      setAuthToken(result.token);
      setToken(result.token);
    }

    if (result.user) {
      setUser(result.user);
    } else {
      await refreshUser();
    }

    return result;
  }, [refreshUser]);

  const register = useCallback(async (payload) => {
    const result = await authService.register(payload);

    if (result.token) {
      setAuthToken(result.token);
      setToken(result.token);
    }

    if (result.user) {
      setUser(result.user);
    } else {
      await refreshUser();
    }

    return result;
  }, [refreshUser]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
