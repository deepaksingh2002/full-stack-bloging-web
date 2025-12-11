import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../features/post/postThunks';
import { 
  selectAllPosts, 
  selectPostLoading, 
  selectPostError 
} from '../features/post/postSlice';
import { Container, PostCard } from '../components';


function PostsList() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const loading = useSelector(selectPostLoading);
  const error = useSelector(selectPostError);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  // Loading State
  if (loading) {
    return (
      <div className="w-full py-8 text-center">
        <h1 className="text-lg font-semibold">Loading posts...</h1>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-red-500 font-semibold">❌ {error}</p>
        <button 
          onClick={() => dispatch(getAllPosts())}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty State
  if (posts.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-gray-500">No posts found.</p>
      </div>
    );
  }

  // Success State
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap -mx-2">
          {posts.map((post) => (
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2" key={post._id}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default PostsList;