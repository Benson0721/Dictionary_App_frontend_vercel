import { createContext, useEffect, useState } from "react";
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

  useEffect(() => {
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
      } else {
        await localforage.clear(); // Session 遺失就清空前端儲存的資料
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Session 檢查失敗:", error);
      await localforage.clear();
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        setUser,
        logoutHandler,
        setIsLoggedIn,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
