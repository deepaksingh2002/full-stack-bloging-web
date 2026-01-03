import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "./authApi";

const handleError = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong";

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await AuthService.register(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await AuthService.login(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthService.logout();
      return res.data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

// CURRENT USER
export const getCurrentUser = createAsyncThunk(
  "auth/currentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthService.currentUser({
        skipAuthRefresh: true, 
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);


// PROFILE
export const getUserProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthService.profile();
      return res.data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

// UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await AuthService.updateProfile(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

// UPDATE AVATAR
export const updateUserAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await AuthService.updateAvatar(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

// CHANGE PASSWORD
export const changeUserPassword = createAsyncThunk(
  "auth/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await AuthService.changePassword(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);
