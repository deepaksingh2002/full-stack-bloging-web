import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getUserProfile,
  logoutUser,
  updateUserAvatar,
} from "../features/auth/authThunks";
import {
  clearAuthState,
  selectAuthError,
  selectAuthLoading,
  selectAuthMessage,
  selectAuthUser,
} from "../features/auth/authSlice";
import { deletePost, getAllPosts } from "../features/post/postThunks";
import { selectAllPosts } from "../features/post/postSlice";
import { Contaner } from "../components";

const getUserId = (user) =>
  user?._id || user?.id || user?.userId || user?.data?._id || null;

const getDisplayName = (user) =>
  user?.username ||
  user?.fullName ||
  user?.name ||
  user?.data?.username ||
  user?.data?.fullName ||
  "User";

const getUserEmail = (user) =>
  user?.email || user?.data?.email || "";

const getUserBio = (user) =>
  user?.bio || user?.about || user?.data?.bio || "";

const getAvatarUrl = (user) =>
  user?.avatar?.url ||
  user?.avatar ||
  user?.profilePic?.url ||
  user?.profilePic ||
  user?.image ||
  "";

const getPostOwnerId = (post) =>
  post?.owner?._id ||
  post?.owner?.id ||
  (typeof post?.owner === "string" ? post.owner : null) ||
  post?.author?._id ||
  post?.author?.id ||
  post?.authorId ||
  post?.userId ||
  post?.ownerId ||
  null;

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const message = useSelector(selectAuthMessage);
  const allPosts = useSelector(selectAllPosts);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getAllPosts());

    return () => {
      dispatch(clearAuthState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    setAvatarPreview("");
    setAvatarFile(null);
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const myPosts = useMemo(() => {
    const currentUserId = getUserId(user);
    if (!currentUserId || !Array.isArray(allPosts)) return [];
    return allPosts.filter((post) => getPostOwnerId(post) === currentUserId);
  }, [allPosts, user]);

  const totalViews = useMemo(
    () => myPosts.reduce((sum, post) => sum + Number(post?.views || 0), 0),
    [myPosts]
  );

  const totalLikes = useMemo(
    () =>
      myPosts.reduce((sum, post) => {
        const likesCount =
          post?.likesCount ??
          (Array.isArray(post?.likes) ? post.likes.length : Number(post?.likes) || 0);
        return sum + Number(likesCount || 0);
      }, 0),
    [myPosts]
  );

  const handleSelectAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      await dispatch(updateUserAvatar(formData)).unwrap();
      setAvatarFile(null);
      setAvatarPreview("");
    } catch {
      // error handled by slice/UI
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post permanently?")) return;

    try {
      await dispatch(deletePost(postId)).unwrap();
      dispatch(getAllPosts());
    } catch {
      alert("Failed to delete post.");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch {
      alert("Logout failed. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-gray-50 dark:bg-slate-900">
        <Contaner>
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center dark:bg-slate-800 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Profile not available</h2>
            <p className="text-gray-600 mt-2 dark:text-slate-300">Please login again to view your profile.</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:opacity-90"
            >
              Go to Login
            </button>
          </div>
        </Contaner>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-16 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <Contaner>
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="rounded-3xl border border-gray-200/80 bg-white/95 shadow-xl p-5 sm:p-6 md:p-8 dark:bg-slate-800/95 dark:border-slate-700">
            <div className="flex flex-col xl:flex-row gap-6 xl:items-center xl:justify-between">
              <div className="flex items-center gap-4 sm:gap-5 md:gap-6 min-w-0">
                <div className="relative">
                  <img
                    src={avatarPreview || getAvatarUrl(user) || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={getDisplayName(user)}
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-gray-200 dark:border-slate-600 shadow-md"
                  />
                  <label className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center cursor-pointer border-2 border-white shadow">
                    <input type="file" accept="image/*" className="hidden" onChange={handleSelectAvatar} />
                    <span className="text-sm font-bold">+</span>
                  </label>
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-slate-100 truncate">
                    {getDisplayName(user)}
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base truncate dark:text-slate-300">{getUserEmail(user)}</p>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed dark:text-slate-400 max-w-2xl">
                    {getUserBio(user) || "Add a short bio to complete your profile."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full xl:w-auto">
                <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-center min-w-[96px] sm:min-w-[110px] dark:bg-slate-900 dark:border-slate-700">
                  <p className="text-2xl font-black text-gray-900 dark:text-slate-100">{myPosts.length}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Posts</p>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-center min-w-[96px] sm:min-w-[110px] dark:bg-slate-900 dark:border-slate-700">
                  <p className="text-2xl font-black text-gray-900 dark:text-slate-100">{totalViews}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Views</p>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-center min-w-[96px] sm:min-w-[110px] dark:bg-slate-900 dark:border-slate-700">
                  <p className="text-2xl font-black text-gray-900 dark:text-slate-100">{totalLikes}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Likes</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/profile/settings"
                className="h-10 px-4 inline-flex items-center rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90"
              >
                Update Profile
              </Link>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="h-10 px-4 inline-flex items-center rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
              >
                {loading ? "Please wait..." : "Logout"}
              </button>
            </div>

            {avatarFile && (
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handleUploadAvatar}
                  disabled={loading}
                  className="h-10 px-4 inline-flex items-center rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Uploading..." : "Upload Avatar"}
                </button>
                <button
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview("");
                  }}
                  className="h-10 px-4 inline-flex items-center rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </section>

          {message && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 font-medium dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 font-medium dark:bg-red-950/30 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          <section className="rounded-3xl border border-gray-200 bg-white shadow-lg p-5 sm:p-6 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-slate-100">My Posts</h2>
              <Link
                to="/add-post"
                className="h-10 px-4 inline-flex items-center rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90"
              >
                New Post
              </Link>
            </div>

            {myPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-10 px-5 text-center dark:border-slate-600 dark:bg-slate-900">
                <p className="text-gray-700 font-semibold dark:text-slate-200">You have not created any posts yet.</p>
                <p className="text-gray-500 text-sm mt-1 dark:text-slate-400">Start sharing your story now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {myPosts.map((post) => (
                  <div key={post._id} className="rounded-2xl border border-gray-200 overflow-hidden bg-white dark:bg-slate-900 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={post.thumbnail || "https://via.placeholder.com/600x400?text=No+Image"}
                      alt={post.title}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-4 space-y-2.5">
                      <h3 className="font-bold text-gray-900 line-clamp-2 dark:text-slate-100">{post.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Views: {post.views || 0}</p>
                      <div className="flex gap-2 pt-2">
                        <Link
                          to={`/post/${post._id}`}
                          className="flex-1 text-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          View
                        </Link>
                        <Link
                          to={`/edit-post/${post._id}`}
                          className="flex-1 text-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </Contaner>
    </div>
  );
}

export default React.memo(Profile);
