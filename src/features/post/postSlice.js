import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
  togglePostLike,
  getLikedPosts,
} from "./postThunks";

const postAdapter = createEntityAdapter({
  selectId: (post) => post._id,
});

const initialState = postAdapter.getInitialState({
  loading: false,
  error: null,
  message: null,
  optimisticLikeByRequest: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
});

const normalizePostCategory = (post) => {
  if (!post || typeof post !== "object") return post;
  const resolvedCategory =
    post.category ??
    post.catagry ??
    post.catagory ??
    post.categoryName ??
    post.postCategory ??
    post.topic;

  if (!resolvedCategory) return post;

  return {
    ...post,
    category: resolvedCategory,
  };
};

const extractPostList = (payload) => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.posts)
        ? payload.data.posts
        : Array.isArray(payload?.posts)
          ? payload.posts
          : [];
  if (Array.isArray(list)) return list.map(normalizePostCategory);
  return [];
};

const mergeWithExistingLikeState = (incomingPosts = [], entities = {}) =>
  incomingPosts.map((post) => {
    const existing = entities[post?._id];
    if (!existing) return post;

    const hasIncomingIsLiked = typeof post?.isLiked === "boolean";
    const hasIncomingLikesCount = typeof post?.likesCount === "number";

    return {
      ...post,
      isLiked: hasIncomingIsLiked ? post.isLiked : existing.isLiked,
      likesCount: hasIncomingLikesCount ? post.likesCount : existing.likesCount,
    };
  });

const extractSinglePost = (payload) =>
  normalizePostCategory(
    payload?.data?.post ||
    payload?.post ||
    payload?.data ||
    payload ||
    null
  );

const extractLikeState = (payload = {}) => {
  const base = payload?.data || payload;
  const postLike = base?.post || base?.likedPost || base;

  const postId =
    postLike?.postId ||
    postLike?._id ||
    base?.postId ||
    null;

  const likesCountRaw =
    postLike?.likesCount ??
    postLike?.likeCount ??
    base?.likesCount ??
    (Array.isArray(postLike?.likes) ? postLike.likes.length : postLike?.likes);

  const likedRaw =
    postLike?.isLiked ??
    postLike?.liked ??
    postLike?.hasLiked ??
    postLike?.likedByCurrentUser ??
    base?.isLiked ??
    base?.liked;

  return {
    postId,
    likesCount: Number.isFinite(likesCountRaw) ? likesCountRaw : undefined,
    isLiked: typeof likedRaw === "boolean" ? likedRaw : undefined,
  };
};

const extractLikedPosts = (payload = {}) => {
  const base = payload?.data || payload;
  const rawList = Array.isArray(base)
    ? base
    : Array.isArray(base?.posts)
      ? base.posts
      : Array.isArray(base?.likedPosts)
        ? base.likedPosts
        : Array.isArray(base?.data)
          ? base.data
          : [];

  return rawList
    .map((item) => {
      const post =
        item?.post ||
        item?.postId ||
        item?.likedPost ||
        item?.postDetails ||
        item;

      const postId =
        (typeof post === "string" ? post : null) ||
        post?._id ||
        post?.id ||
        item?.postId?._id ||
        item?.postId?.id ||
        item?.post?._id ||
        item?.post?.id ||
        item?._id;

      if (!postId) return null;

      if (typeof post === "string") {
        return { _id: postId, isLiked: true };
      }

      return {
        ...normalizePostCategory(post),
        _id: postId,
        isLiked: true,
      };
    })
    .filter(Boolean);
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearPostMessage: (state) => {
      state.error = null;
      state.message = null;
    },
    clearSinglePost: (state) => {
      postAdapter.removeAll(state);
    },
    clearAllPosts: (state) => {
      postAdapter.removeAll(state);
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        const incoming = extractPostList(action.payload);
        postAdapter.setAll(state, mergeWithExistingLikeState(incoming, state.entities));
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
      })
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        const post = extractSinglePost(action.payload);
        if (post?._id) {
          postAdapter.upsertOne(state, post);
        }
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch post";
      })
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const incoming = extractPostList(action.payload);
        postAdapter.setAll(state, mergeWithExistingLikeState(incoming, state.entities));
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to search posts";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        const newPost = extractSinglePost(action.payload);
        if (newPost?._id) {
          postAdapter.addOne(state, newPost);
          state.message = "Post created successfully";
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPost = extractSinglePost(action.payload);
        if (updatedPost?._id) {
          postAdapter.updateOne(state, { id: updatedPost._id, changes: updatedPost });
          state.message = "Post updated successfully";
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        postAdapter.removeOne(state, action.payload);
        state.message = "Post deleted successfully";
      })
      .addCase(togglePostLike.pending, (state, action) => {
        const postId = action.meta.arg;
        const post = state.entities[postId];
        if (!post) return;

        const previousIsLiked = Boolean(post.isLiked ?? post.liked ?? false);
        const previousLikesCount =
          post.likesCount ??
          (Array.isArray(post.likes) ? post.likes.length : Number(post.likes) || 0);

        state.optimisticLikeByRequest[action.meta.requestId] = {
          postId,
          previousIsLiked,
          previousLikesCount,
        };

        postAdapter.updateOne(state, {
          id: postId,
          changes: {
            isLiked: !previousIsLiked,
            likesCount: Math.max(0, previousLikesCount + (previousIsLiked ? -1 : 1)),
          },
        });
      })
      .addCase(togglePostLike.fulfilled, (state, action) => {
        delete state.optimisticLikeByRequest[action.meta.requestId];
        const fallbackPostId = action.meta.arg;
        const { postId, likesCount, isLiked } = extractLikeState(action.payload);
        const targetPostId = postId || fallbackPostId;

        if (!targetPostId || !state.entities[targetPostId]) return;

        const changes = {};
        if (typeof likesCount === "number") changes.likesCount = likesCount;
        if (typeof isLiked === "boolean") changes.isLiked = isLiked;

        if (Object.keys(changes).length > 0) {
          postAdapter.updateOne(state, {
            id: targetPostId,
            changes,
          });
        }
      })
      .addCase(togglePostLike.rejected, (state, action) => {
        const snapshot = state.optimisticLikeByRequest[action.meta.requestId];
        if (!snapshot) return;

        const { postId, previousIsLiked, previousLikesCount } = snapshot;
        delete state.optimisticLikeByRequest[action.meta.requestId];

        if (!postId || !state.entities[postId]) return;

        postAdapter.updateOne(state, {
          id: postId,
          changes: {
            isLiked: previousIsLiked,
            likesCount: previousLikesCount,
          },
        });
      })
      .addCase(getLikedPosts.fulfilled, (state, action) => {
        const likedPosts = extractLikedPosts(action.payload);
        likedPosts.forEach((post) => {
          if (!post?._id) return;
          const existing = state.entities[post._id];
          const likesCount =
            typeof post.likesCount === "number"
              ? post.likesCount
              : existing?.likesCount;
          postAdapter.upsertOne(state, {
            ...existing,
            ...post,
            isLiked: true,
            likesCount,
          });
        });
      });
  },
});

export const { clearPostMessage, clearSinglePost, clearAllPosts } = postSlice.actions;
export default postSlice.reducer;

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectTotal: selectPostCount,
} = postAdapter.getSelectors((state) => state.post);

export const selectPostLoading = (state) => state.post.loading;
export const selectPostError = (state) => state.post.error;
export const selectSinglePost = (state, postId) => state.post.entities[postId] || null;
