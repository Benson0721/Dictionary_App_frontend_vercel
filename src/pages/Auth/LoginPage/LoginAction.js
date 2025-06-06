import localforage from "localforage";
import { login } from "../../../apis/UserApi.js";

export const loginAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const userData = Object.fromEntries(formData);
    const response = await login(userData);
    if (response.error) {
      return { error: response.error };
    }
    await localforage.setItem("user", response);
    return { id: response.id, username: response.username };
  } catch (e) {
    console.error("Error in login:", e.response?.data?.error || e.message);
    return { error: e.response?.data?.error || "帳號或密碼輸入錯誤!" };
  }
};
