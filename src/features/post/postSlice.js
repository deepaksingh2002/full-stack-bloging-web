import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
} from "./postThunks";

const initialState = {
  posts: [],
  singlePost: null,
  loading: false,
  error: null,
  message: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const postSlice = createSlice({
  name: "post",
  initialState,

  reducers: {
    clearPostMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    clearSinglePost: (state) => {
      state.singlePost = null;
    },
    clearAllPosts: (state) => {
      state.posts = [];
      state.singlePost = null;
      state.message = null;
      state.error = null;
      state.pagination = initialState.pagination;
    },
  },

  extraReducers: (builder) => {
    builder
      // GET ALL POSTS
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        
        if (Array.isArray(payload)) {
          state.posts = payload;
        } else if (payload.data && Array.isArray(payload.data)) {
          state.posts = payload.data;
          if (payload.pagination) {
            state.pagination = payload.pagination;
          }
        } else if (payload.posts && Array.isArray(payload.posts)) {
          state.posts = payload.posts;
        } else {
          state.posts = [];
        }
        state.error = null;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
        state.posts = [];
      })

      // GET POsts

    builder
      .addCase(getMyPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getMyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      // GET POST BY ID
    builder
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePost = action.payload; 
        state.error = null;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch post";
        state.singlePost = null;
      });

      // SEARCH POSTS
    builder
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        
        if (Array.isArray(payload)) {
          state.posts = payload;
        } else if (payload.data && Array.isArray(payload.data)) {
          state.posts = payload.data;
        } else if (payload.posts && Array.isArray(payload.posts)) {
          state.posts = payload.posts;
        } else {
          state.posts = [];
        }
        state.error = null;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to search posts";
        state.posts = [];
      })

      // CREATE POST

    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        
        const payload = action.payload;
        const newPost = payload.data || payload;
        
        // Add to posts array if not already there
        if (newPost._id && !state.posts.find(p => p._id === newPost._id)) {
          state.posts.unshift(newPost);
        }
        
        state.message = "Post created successfully";
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create post";
        state.message = null;
      })

      // UPDATE POST
    builder
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        
        const payload = action.payload;
        const updatedPost = payload.data || payload;
        
        if (updatedPost._id) {
          state.posts = state.posts.map((p) =>
            p._id === updatedPost._id ? updatedPost : p
          );
          if (state.singlePost?._id === updatedPost._id) {
            state.singlePost = updatedPost;
          }
        }
        state.message = "Post updated successfully";
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update post";
        state.message = null;
      })

      // DELETE POST
    builder
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        
        const deletedPostId = action.payload._id;
        state.posts = state.posts.filter((p) => p._id !== deletedPostId);
        
        if (state.singlePost?._id === deletedPostId) {
          state.singlePost = null;
        }
        state.message = "Post deleted successfully";
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete post";
        state.message = null;
      });
  },
});

export const { clearPostMessage, clearSinglePost, clearAllPosts } = postSlice.actions;
export default postSlice.reducer;

// Selectors
export const selectAllPosts = (state) => {
  return state.post?.posts || [];
};

export const selectSinglePost = (state) => {
  return state.post?.singlePost || null;
};

export const selectPostLoading = (state) => {
  return state.post?.loading || false;
};

export const selectPostError = (state) => {
  return state.post?.error || null;
};

export const selectPostMessage = (state) => {
  return state.post?.message || null;
};

export const selectPostPagination = (state) => {
  return state.post?.pagination || initialState.pagination;
};

export const selectPostCount = (state) => {
  return state.post?.posts?.length || 0;
};

export const selectPostsEmpty = (state) => {
  return (state.post?.posts?.length || 0) === 0;
};

export const selectPostById = (state, postId) => {
  return state.post?.posts?.find(p => p._id === postId);
};

export const selectPostsByCategory = (state, category) => {
  return state.post?.posts?.filter(p => p.category === category) || [];
};