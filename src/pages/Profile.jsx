import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUserProfile } from "../features/auth/authThunks";


const Profile = () => {
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);
  const { posts, loading: postLoading } = useSelector((state) => state.post);

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f7f2df] flex justify-center p-6">
      <div className="w-full max-w-2xl border-2 border-gray-700 rounded-lg p-6 bg-[#f7f2df]">

        {/* Profile Info */}
        <div className="flex items-center gap-6 mb-6">
          <img
            src={user.avatar || defaultAvatar}
            alt="avatar"
            className="w-24 h-24 rounded-full border-2 border-gray-700 object-cover"
          />
          <div>
            <p className="text-lg font-semibold">@{user.username}</p>
            <p className="text-gray-700">{user.fullName}</p>
          </div>
        </div>

        {/* Followers */}
        <div className="flex gap-12 mb-6">
          <div>
            <p className="text-xl font-bold underline">
              {user.subscribersCount || 0}
            </p>
            <p>followers</p>
          </div>
          <div>
            <p className="text-xl font-bold underline">
              {user.subscribedToCount || 0}
            </p>
            <p>following</p>
          </div>
        </div>

        {/* Posts */}
        <div className="border-2 border-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Posts</h2>

          {postLoading && <p>Loading posts...</p>}

          {!postLoading && posts.length === 0 && (
            <p className="text-gray-600">No posts yet</p>
          )}

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="border border-gray-600 rounded p-3"
              >
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-gray-700 text-sm">
                  {post.content?.slice(0, 120)}...
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
