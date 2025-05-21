import localforage from "localforage";
import { signUp } from "../../../apis/UserApi.js";

export const registerAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const userData = Object.fromEntries(formData);
    const response = await signUp(userData);
    if (response.error) {
      return { error: response.error };
    }
    await localforage.setItem("user", response);
    return { id: response.id, username: response.username };
  } catch (e) {
    console.error("Error in signUp:", e.response?.data?.error || e.message);
    return { error: e.response?.data?.error || "註冊錯誤，請重新操作" };
  }
};
