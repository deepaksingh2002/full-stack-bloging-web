import React, { useEffect } from 'react';
import parse from 'html-react-parser';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPostById, deletePost } from '../features/post/postThunks';
import { Button, Contaner } from '../components';
import { selectSinglePost, selectPostLoading } from '../features/post/postSlice';
import {getCurrentUser} from '../features/auth/authThunks'

export default function Post() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const post = useSelector(selectSinglePost);
  const loading = useSelector(selectPostLoading);
  const user = useSelector(getCurrentUser);

  const isAuthor = post && user ? post.author?._id === user._id : false;

  useEffect(() => {
    if (slug) {
      dispatch(getPostById(slug))
        .unwrap()
        .catch(() => navigate("/"));
    } else {
      navigate("/");
    }
  }, [slug, dispatch, navigate]);

  const deletepost = async () => {
    if (!post?._id) return;
    await dispatch(deletePost(post._id));
    navigate("/");
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-8 text-center">
        <p>Post not found.</p>
      </div>
    );
  }

  return (
    <div className="py-2 bg-light text-dark">
      <Contaner>
        {/* Thumbnail */}
        <div className="relative w-full h-[40vh] sm:h-[60vh] rounded-2xl overflow-hidden shadow-xl mb-10">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover"
          />

          {isAuthor && (
            <div className="absolute top-5 right-5 flex gap-3 z-10">
              <Link to={`/edit-post/${post._id}`}>
                <Button bgColor="bg-primary" className="text-white shadow">
                  Edit
                </Button>
              </Link>
              <Button
                bgColor="bg-red-500"
                onClick={deletepost}
                className="text-white shadow"
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-primary leading-tight mb-6">
          {post.title}
        </h1>

        {/* Content */}
        <div className="browser-css text-lg text-gray-700 leading-relaxed">
          {parse(post.content)}
        </div>
      </Contaner>
    </div>
  );
}
