import { createAsyncThunk } from "@reduxjs/toolkit";
import { postService } from "./postApi";

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postService.getAllPosts(params);
      return response;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch posts";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getMyPosts = createAsyncThunk(
  "post/getMyPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await postService.getAllPosts();
      return res.data.data.posts;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
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
  "post/create",
  async (formData, { rejectWithValue }) => {
    try {
      return await postService.createPost(formData);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/update",
  async ({ postId, formData }, { rejectWithValue }) => {
    try {
      return await postService.updatePost(postId, formData);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/delete",
  async (postId, { rejectWithValue }) => {
    try {
      await postService.deletePost(postId);
      return postId;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);