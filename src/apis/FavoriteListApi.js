import axios from "axios";
const baseURL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000";

export const getFavoriteLists = async (userID) => {
  try {
    const res = await axios.get(`${baseURL}/${userID}/lists`, {
      withCredentials: true,
    });
    return res.data;
  } catch (e) {
    return { error: "Get Favorites Fail!" };
  }
};

export const addFavoriteList = async (userID, newList) => {
  try {
    const res = await axios.post(
      `${baseURL}/${userID}/lists`,
      {
        data: newList,
      },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (e) {
    return { error: "Add Favorite Fail!" };
  }
};

export const deleteFavoriteList = async (userID, listID) => {
  try {
    await axios.delete(`${baseURL}/${userID}/lists/${listID}`, {
      withCredentials: true,
    });
    return { success: "Delete Favorite Success!" };
  } catch (e) {
    return { error: "Delete Favorite Fail!" };
  }
};

export const updateFavoriteLists = async (userID, updatedLists) => {
  try {
    const res = await axios.patch(
      `${baseURL}/${userID}/lists`,
      {
        listUpdates: updatedLists.map((list) => ({
          listId: list._id,
          icon: list.icon,
          name: list.name,
        })),
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.lists;
  } catch (e) {
    return { error: "Update Lists Fail!" };
  }
};
