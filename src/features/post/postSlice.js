import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "./postThunks";

const initialState = {
  posts: [],
  post: null,
  loading: false,
  error: null,
  message: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearPostMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ============ GET ALL POSTS ============
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.posts = [];
      })

      // ============ GET POST BY ID ============
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
        state.error = null;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.post = null;
      })

      // ============ CREATE POST ============
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
        state.message = "Post created successfully";
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      })

      // ============ UPDATE POST ============
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        state.message = "Post updated successfully";
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      })

      // ============ DELETE POST ============
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((p) => p._id !== action.payload);
        state.message = "Post deleted successfully";
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      });
  },
});

export const { clearPostMessage } = postSlice.actions;
export default postSlice.reducer;

// ============ SELECTORS ============
export const selectAllPosts = (state) => state.post?.posts || [];
export const selectPostLoading = (state) => state.post?.loading || false;
export const selectPostError = (state) => state.post?.error || null;
export const selectPostMessage = (state) => state.post?.message || null;
export const selectSinglePost = (state) => state.post?.post || null; // ✅ FIXED