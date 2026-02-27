import api from "./axios";

export const loginApi = (data) =>
  api.post("/api/auth/login", data);

export const changePasswordApi = (data) =>
  api.post("/api/auth/change-password", data);

export const createEmployeeApi = (data) =>
  api.post("/api/auth/create-employee", data);

export const getMeApi = () =>
  api.get("/api/auth/me");