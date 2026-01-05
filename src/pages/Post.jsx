import React, { useEffect } from "react";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPostById, deletePost } from "../features/post/postThunks";
import { selectSinglePost, selectPostLoading, selectPostError } from "../features/post/postSlice";
import { selectAuthUser } from "../features/auth/authSlice";
import { Contaner } from "../components";

function Post() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();

  const post = useSelector(selectSinglePost);
  const loading = useSelector(selectPostLoading);
  const error = useSelector(selectPostError);
  const currentUser = useSelector(selectAuthUser);

  // Only show buttons for the owner
  const isOwner = Boolean(post?.owner?._id && post.owner._id === currentUser._id);

  // Fetch the post by ID
  useEffect(() => {
    if (!postId) {
      navigate("/");
      return;
    }

    dispatch(getPostById(postId));
  }, [postId, dispatch, navigate]);

  const handleDelete = async () => {
    if (!post?._id) return;

    if (!window.confirm("Delete this post permanently?")) return;

    try {
      await dispatch(deletePost(post._id)).unwrap();
      navigate("/all-post");
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-post/${post._id}`);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error || !post) return <div className="text-center py-8 text-red-500">{error || "Post not found"}</div>;

  return (
    <article className="py-8 bg-gray-50 min-h-screen">
      <Contaner>
        <div className="relative w-full h-[50vh] rounded-2xl overflow-hidden shadow-lg mb-8 bg-gray-200">
          {post.thumbnail ? (
            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">No Image</div>
          )}

          {isOwner && (
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">Category: {post.catagry}</p>
        <div className="prose max-w-none">{parse(post.content || "<p>No content available</p>")}</div>
        <p className="text-gray-400 text-sm mt-4">Published on: {formatDate(post.createdAt)}</p>

        <Link to="/all-post">
          <button className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
            Back to Posts
          </button>
        </Link>
      </Contaner>
    </article>
  );
}

export default Post;
