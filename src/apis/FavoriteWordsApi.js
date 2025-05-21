import axios from "axios";
const baseURL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL
    : window.location.origin;

export const getFavoriteWords = async (userID, listID) => {
  try {
    const res = await axios.get(`${baseURL}/api/${userID}/lists/${listID}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (e) {
    return { error: "Get Favorite words Fail!" };
  }
};

export const getAllFavoriteWords = async (userID) => {
  try {
    const res = await axios.get(`${baseURL}/api/${userID}`, {
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
      `${baseURL}/api/${userID}/lists/${listID}/favorites`,
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
      `${baseURL}/api/${userID}/lists/${listID}/favorites/${wordID}`,
      {
        withCredentials: true,
      }
    );
    return { success: "Delete Favorite Success!" };
  } catch (e) {
    return { error: "Delete Favorite Fail!" };
  }
};
