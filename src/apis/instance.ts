import axios, { AxiosInstance } from "axios";
import { SERVER_HOST } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const customAxios: AxiosInstance = axios.create({
  baseURL: SERVER_HOST,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json"
  },
});

// AsyncStorage.getItem 함수: 비동기 > 요청 인터셉터로 토큰을 동적 추가
customAxios.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
    return config;
  },
  (error) => {
    console.error("Interceptor error:", error);
    return Promise.reject(error);
  }
);

export { customAxios };
