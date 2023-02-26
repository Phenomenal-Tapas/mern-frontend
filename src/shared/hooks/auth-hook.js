import { useCallback, useEffect, useState } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [tokenExpiredIn, setTokenExpiredIn] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid, token, expirationTime) => {
    setToken(token);
    setUserId(uid);

    const tokenExpirationTime =
      expirationTime || new Date(new Date().getTime() + 2000 * 60 * 60);

    setTokenExpiredIn(tokenExpirationTime);

    localStorage.setItem(
      "user",
      JSON.stringify({
        userId: uid,
        token: token,
        expiredIn: tokenExpirationTime.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpiredIn(null);
    setUserId(null);
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    if (token && tokenExpiredIn) {
      const timeExpiredIn = tokenExpiredIn.getTime() - new Date().getTime();

      logoutTimer = setTimeout(logout, timeExpiredIn);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpiredIn]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user"));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiredIn) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiredIn)
      );
    }
  }, [login]);

  return { userId, token, login, logout };
};
