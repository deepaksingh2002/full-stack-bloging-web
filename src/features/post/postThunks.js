import { createAsyncThunk } from "@reduxjs/toolkit";
import { postService } from "./postApi";

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to create post"
      );
    }
  }
);

export const getAllPosts = createAsyncThunk(
  "posts/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postService.getAllPosts();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch posts"
      );
    }
  }
);

export const getPostById = createAsyncThunk(
  "posts/getById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.getPostById(postId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch post"
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ postId, data }, { rejectWithValue }) => {
    try {
      const response = await postService.updatePost(postId, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to update post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (postId, { rejectWithValue }) => {
    try {
      await postService.deletePost(postId);
      return postId; // Return the deleted post ID
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to delete post"
      );
    }
  }
);