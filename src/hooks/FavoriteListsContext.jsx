import { createContext, useEffect, useState, useContext, useMemo } from "react";

import {
  getFavoriteLists,
  addFavoriteList,
  updateFavoriteLists,
  deleteFavoriteList,
} from "../apis/FavoriteListApi";

import localforage from "localforage";
import AuthContext from "./AuthContext";

export const FavoriteListsContext = createContext({
  lists: [],
  favoriteWords: [],
  currentList: null,
  setLists: () => {},
  setCurrentList: () => {},
  fetchLists: async () => {},
  addLists: async () => {},
  updateLists: async () => {},
  deleteLists: async () => {},
});

export const FavoriteListsContextProvider = (props) => {
  const [lists, setLists] = useState([]);

  const [currentList, setCurrentList] = useState(null);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (user?.id && user?.username) {
      fetchLists(user.id);
    }
  }, [user, setUser]);

  const fetchLists = async () => {
    try {
      const data = await getFavoriteLists(user.id);
      const { favLists } = data;
      setLists(favLists);
    } catch (e) {
      console.error(e.message);
    }
  };
  const addLists = async (newList) => {
    const user = await localforage.getItem("user");
    if (user) {
      try {
        setLists((prev) =>
          Array.isArray(prev) ? [...prev, newList] : [newList]
        );
        await addFavoriteList(user.id, newList);
        return await fetchLists();
      } catch (e) {
        console.error(e.message);
        return await fetchLists();
      }
    }
  };
  const updateLists = async (updatedLists) => {
    const user = await localforage.getItem("user");
    if (user) {
      try {
        await updateFavoriteLists(user.id, updatedLists);
        await fetchLists();
      } catch (e) {
        console.error(e.message);
        await fetchLists();
      }
    }
  };
  const deleteLists = async (listID) => {
    const user = await localforage.getItem("user");
    if (user) {
      try {
        setLists((prevLists) => prevLists.filter((list) => list.id !== listID));
        await deleteFavoriteList(user.id, listID);
        await fetchLists();
      } catch (e) {
        console.error(e.message);
        await fetchLists();
      }
    }
  };

  const contextValue = useMemo(
    () => ({
      lists,
      currentList,
      setLists,
      setCurrentList,
      fetchLists,
      addLists,
      updateLists,
      deleteLists,
    }),
    [lists, fetchLists]
  );

  return (
    <FavoriteListsContext.Provider value={contextValue}>
      {props.children}
    </FavoriteListsContext.Provider>
  );
};

export default FavoriteListsContext;
