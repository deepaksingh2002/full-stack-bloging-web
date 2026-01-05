import React, { useEffect } from "react";
import { Contaner, PostForm } from "../components";
import { getPostById } from "../features/post/postThunks";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function EditPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();

  const { post, loading } = useSelector((state) => state.post);

  useEffect(() => {
    if (!postId) {
      navigate("/all-post");
      return;
    }

    dispatch(getPostById(postId));
  }, [postId, dispatch, navigate]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!post) return <div className="text-center py-8 text-red-500">Post not found</div>;

  return (
    <div className="py-8">
      <Contaner>
        <PostForm post={post} />
      </Contaner>
    </div>
  );
}

export default EditPost;
