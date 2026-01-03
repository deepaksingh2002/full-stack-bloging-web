import { createAsyncThunk } from "@reduxjs/toolkit";
import { postService } from "./postApi";

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postService.getAllPosts(params);
      // FIXED: already returns response.data, so no need for .json
      return response;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch posts";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getPostById = createAsyncThunk(
  "posts/getPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.getPostById(postId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch post"
      );
    }
  }
);


export const searchPosts = createAsyncThunk(
  "posts/searchPosts",
  async (query, { rejectWithValue }) => {
    try {
      if (!query || typeof query !== "string") {
        return rejectWithValue("Valid search query is required");
      }

      const response = await postService.searchPosts(query);
      return response;
    } catch (error) {
      const errorMessage = error.message || "Failed to search posts";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (data, { rejectWithValue }) => {
    try {
      if (!data.title || !data.content) {
        return rejectWithValue("Title and content are required");
      }

      if (data.title.trim().length < 3) {
        return rejectWithValue("Title must be at least 3 characters");
      }

      if (data.content.trim().length < 10) {
        return rejectWithValue("Content must be at least 10 characters");
      }

      const response = await postService.createPost(data);
      return response;
    } catch (error) {
      const errorMessage = error.message || "Failed to create post";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, data }, { rejectWithValue }) => {
    try {
      if (!postId || typeof postId !== "string") {
        return rejectWithValue("Valid post ID is required");
      }
      if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
        return rejectWithValue("Valid update data is required");
      }

      const response = await postService.updatePost(postId, data);
      return response;
    } catch (error) {
      const errorMessage = error.message || "Failed to update post";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      if (!postId || typeof postId !== "string") {
        return rejectWithValue("Valid post ID is required");
      }

      await postService.deletePost(postId);
      return { _id: postId };
    } catch (error) {
      const errorMessage = error.message || "Failed to delete post";
      return rejectWithValue(errorMessage);
    }
  }
);