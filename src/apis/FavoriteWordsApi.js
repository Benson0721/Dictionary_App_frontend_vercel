import axios from "axios";
const baseURL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000";

export const getFavoriteWords = async (userID, listID) => {
  try {
    const res = await axios.get(`${baseURL}/${userID}/lists/${listID}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (e) {
    return { error: "Get Favorite words Fail!" };
  }
};

export const getAllFavoriteWords = async (userID) => {
  try {
    const res = await axios.get(`${baseURL}/${userID}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (e) {
    return { error: "Get Favorite words Fail!" };
  }
};

export const addFavoriteWord = async (userID, listID, newWord) => {
  try {
    await axios.post(
      `${baseURL}/${userID}/lists/${listID}/favorites`,
      {
        newWord: newWord,
      },
      {
        withCredentials: true,
      }
    );
    return { success: "Add Favorite Success!" };
  } catch (e) {
    return { error: "Add Favorite Fail!" };
  }
};

export const removeFavoriteWord = async (userID, listID, wordID) => {
  try {
    await axios.delete(
      `${baseURL}/${userID}/lists/${listID}/favorites/${wordID}`,
      {
        withCredentials: true,
      }
    );
    return { success: "Delete Favorite Success!" };
  } catch (e) {
    return { error: "Delete Favorite Fail!" };
  }
};
