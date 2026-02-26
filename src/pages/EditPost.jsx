import React, { useEffect } from "react";
import { Contaner, PostForm } from "../components";
import { getPostById } from "../features/post/postThunks";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPostById,
  selectPostError,
  selectPostLoading,
} from "../features/post/postSlice";

function EditPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();

  const post = useSelector((state) => selectPostById(state, postId));
  const loading = useSelector(selectPostLoading);
  const error = useSelector(selectPostError);

  useEffect(() => {
    if (!postId) {
      navigate("/all-post");
      return;
    }

    dispatch(getPostById(postId));
  }, [postId, dispatch, navigate]);

  if (loading && !post) return <div className="text-center py-8 text-gray-700 dark:text-slate-200">Loading...</div>;
  if (!loading && !post) {
    return (
      <div className="text-center py-8 text-red-500 dark:text-red-300">
        {error || "Post not found"}
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16 min-h-screen bg-gray-50 dark:bg-slate-900">
      <Contaner>
        <PostForm post={post} />
      </Contaner>
    </div>
  );
}

export default EditPost;
