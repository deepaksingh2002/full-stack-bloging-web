import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  changeUserPassword,
} from "./authThunks";

const initialState = {
  user: null,
  loading: false,
  error: null,
  message: null,
  isAuthenticated: false,
  authChecked: false, 
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // CURRENT USER
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        // console.log("getCurrentUser FULFILLED:", action.payload);
        state.loading = false;
        state.user = action.payload?.user || action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        // console.log("getCurrentUser REJECTED:", action.payload);
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      });


    // PROFILE
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload?.user || state.user;
      });

    // UPDATE PROFILE
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload?.user || state.user;
        state.message = action.payload?.message;
      });

    // UPDATE AVATAR
    builder
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.user = action.payload?.user || state.user;
        state.message = action.payload?.message;
      });

    // CHANGE PASSWORD
    builder
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.message = action.payload?.message;
      });

    // LOGOUT
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });

    /** ================= ADD MATCHERS LAST ================= */

    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;


export const selectAuthUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthMessage = (state) => state.auth.message;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

