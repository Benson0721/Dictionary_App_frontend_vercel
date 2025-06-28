import axios from "axios";
const baseURL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000";

export async function login(userData) {
  try {
    const { username, password } = userData;
    const response = await axios.post(
      `${baseURL}/login`,
      {
        username,
        password,
      },
      { withCredentials: true }
    );
    return { id: response.data._id, username: response.data.username };
  } catch (e) {
    console.error("Error in login:", e.response?.data?.error || e.message);
    return { error: e.response?.data?.error || "帳號或密碼輸入錯誤!" };
  }
}

export async function signUp(userData) {
  try {
    const { email, username, password } = userData;
    const response = await axios.post(`${baseURL}/register`, {
      email,
      username,
      password,
    });
    return { id: response.data._id, username: response.data.username };
  } catch (e) {
    console.error("Error in signUp:", e.response?.data?.error || e.message);
    return { error: e.response?.data?.error || "註冊錯誤，請重新操作" };
  }
}

export async function checkAuth() {
  const res = await axios.get(`${baseURL}/checkAuth`, {
    withCredentials: true, // 讓瀏覽器傳送 Cookie
  });
  return res.data;
}

export async function logout() {
  await axios.get(`${baseURL}/logout`, {
    withCredentials: true, 
  });
}
