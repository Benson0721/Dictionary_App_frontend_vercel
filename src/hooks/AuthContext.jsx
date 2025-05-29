import { createContext, useEffect, useState, useMemo } from "react";
import localforage from "localforage";

import { checkAuth, logout } from "../apis/UserApi";

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  checkSession: async () => {},
  setIsLoggedIn: () => {},
  setUser: () => {},
  logoutHandler: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await checkAuth();
        if (res.isAuthenticated) {
          const newUser = {
            id: res.user._id,
            username: res.user.username,
          };
          await localforage.setItem("user", newUser);
          setUser(newUser);
          setIsLoggedIn(true);
          setIsLoading(false);
        } else {
          await localforage.clear(); // Session 遺失就清空前端儲存的資料

          setUser(null);
          setIsLoggedIn(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session 檢查失敗:", error);
        await localforage.clear();
        setUser(null);
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const logoutHandler = async () => {
    await localforage.removeItem("user", () => {
      console.log("user removed");
    });
    await logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      user,
      setUser,
      logoutHandler,
      setIsLoggedIn,
      isLoading,
    }),
    [isLoggedIn, user, setUser, logoutHandler, setIsLoggedIn, isLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
