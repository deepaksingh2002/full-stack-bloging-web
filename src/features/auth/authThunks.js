import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData) => {
    return await authApi.register(formData);
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData) => {
    return await authApi.login(formData);
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    return await authApi.logout();
  }
);

// CURRENT USER
export const getCurrentUser = createAsyncThunk(
  "auth/currentUser",
  async () => {
    return await authApi.currentUser();
  }
);
