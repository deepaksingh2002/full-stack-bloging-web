import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, updateUserAvatar } from "../features/auth/authThunks";
import { getAllPosts, deletePost } from "../features/post/postThunks";
import { selectAuthUser } from "../features/auth/authSlice";
import { selectAllPosts } from "../features/post/postSlice";
import { useParams, Link, useNavigate } from "react-router-dom";

function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  const currentUser = useSelector(selectAuthUser);
  const allPosts = useSelector(selectAllPosts);

  const isOwner = currentUser?._id === userId;
  const userPosts = allPosts.filter((p) => p.owner === userId);

  const [avatarFile, setAvatarFile] = useState(null);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  useEffect(() => {
    if (!userId) return navigate("/");

    dispatch(getUserProfile(userId));
    dispatch(getAllPosts());
  }, [dispatch, userId, navigate]);

  const handleAvatarChange = (e) => {
    if (!e.target.files?.[0]) return;
    setAvatarFile(e.target.files[0]);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setUpdatingAvatar(true);
    await dispatch(updateUserAvatar(avatarFile));
    setAvatarFile(null);
    setUpdatingAvatar(false);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    await dispatch(deletePost(postId)).unwrap();
    dispatch(getAllPosts());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-20">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="relative">
          <img
            src={currentUser?.avatar || "/default-avatar.png"}
            alt={currentUser?.name}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
          />
          {isOwner && (
            <label className="absolute bottom-0 right-0 cursor-pointer bg-white border rounded-full p-1 hover:bg-gray-100 transition">
              <input type="file" className="hidden" onChange={handleAvatarChange} />
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </label>
          )}
          {avatarFile && (
            <button
              onClick={handleAvatarUpload}
              className="absolute bottom-0 left-0 bg-blue-500 px-3 py-1 text-white rounded-full text-sm hover:bg-blue-600 transition"
              disabled={updatingAvatar}
            >
              {updatingAvatar ? "Updating..." : "Save"}
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl font-semibold">{currentUser?.name}</h1>
            {isOwner && (
              <button className="border px-4 py-1 rounded hover:bg-gray-100 transition">
                Edit Profile
              </button>
            )}
          </div>

          <div className="flex gap-8 mb-4 text-sm font-medium">
            <span>{userPosts.length} posts</span>
            <span>100 followers</span>
            <span>150 following</span>
          </div>

          {currentUser?.bio && (
            <p className="text-gray-700">{currentUser.bio}</p>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-2">
        {userPosts.map((post) => (
          <div key={post._id} className="relative group overflow-hidden rounded">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-32 md:h-48 object-cover transform group-hover:scale-110 transition duration-300"
            />
            {isOwner && (
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                <Link to={`/edit-post/${post._id}`}>
                  <button className="bg-blue-500 px-3 py-1 text-white rounded hover:bg-blue-600 transition text-sm">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProfile;
