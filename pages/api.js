import axios from "axios";

const api = axios.create({
  baseURL: "https://todo-app-api-1454.onrender.com",
});

export default api;