import React, { useEffect } from "react";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPostById, deletePost } from "../features/post/postThunks";
import {
  selectSinglePost,
  selectPostLoading,
  selectPostError,
} from "../features/post/postSlice";
import {
  selectAuthUser,
} from "../features/auth/authSlice";
import { Contaner } from "../components";

function Post() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();

  const post = useSelector(selectSinglePost);
  const loading = useSelector(selectPostLoading);
  const error = useSelector(selectPostError);
  const currentUser = useSelector(selectAuthUser);

  //FIX: correct author check
  const isAuthor = Boolean(
    post?.owner?._id && currentUser?._id &&
    post.owner._id === currentUser._id
  );

  //FIX: fetch by ID (matches your route)
  useEffect(() => {
    if (!postId) {
      navigate("/");
      return;
    }

    dispatch(getPostById(postId))
      .unwrap()
      .catch((err) => {
        console.error("Failed to fetch post:", err);
      });
  }, [postId, dispatch, navigate]);

  const handleDeletePost = async () => {
    if (!post?._id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await dispatch(deletePost(postId)).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
          </div>
          <h1 className="text-lg font-semibold text-gray-700">
            Loading post...
          </h1>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }


  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Post Not Found
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error || "The post you're looking for doesn't exist."}</p>
                </div>

                <div className="mt-4">
                  <Link to="/">
                    <button className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200">
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back to Home
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <article className="py-8 bg-gray-50 min-h-screen">
      <Contaner>
        <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden shadow-lg mb-8 bg-gray-200">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {isAuthor && (
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <Link to={`/edit-post/${post._id}`}>
                <button className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 shadow-lg transition duration-200">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
              </Link>

              <button
                onClick={handleDeletePost}
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 shadow-lg transition duration-200"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {post.author?.name && (
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium">{post.author.name}</span>
            </div>
          )}

          {post.createdAt && (
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          )}

          {post.status && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                post.status === "active" || post.status === "published"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
          {post.title}
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-12">
          {post.content ? (
            parse(post.content)
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-500">No content available</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-200"
            >
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C9.589 12.938 10 12.002 10 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3c.875 0 1.668-.337 2.25-.843m0 6L9 17m0 0a9 9 0 018.716-13.342"
                />
              </svg>
              Share Post
            </button> */}

            <Link to="/all-post">
              <button className="inline-flex items-center px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition duration-200">
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Posts
              </button>
            </Link>
          </div>
        </div>
      </Contaner>
    </article>
  );
}

export default Post;