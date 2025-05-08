const API_URL = 'http://localhost:5000/';
const axios = require("axios");
const instance = axios.create({
    baseURL: API_URL,
});
instance.defaults.withCredentials = true;
instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await instance.get("user/refresh");
          return instance(originalRequest);
        } catch (error) {
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
export {instance};