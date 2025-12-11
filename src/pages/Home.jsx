import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../features/post/postThunks';
import { selectAllPosts, selectPostLoading } from "../features/post/postSlice";
import { Contaner, PostCard } from '../components';


function Home() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const loading = useSelector(selectPostLoading);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(getAllPosts());
    }
  }, [dispatch, posts.length]);

  if (loading) {
    return (
      <div className="w-full py-8 text-center">
        <h1>Loading posts...</h1>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <p>No posts found.</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Contaner>
        <div className="flex flex-wrap -mx-2">
          {posts.slice(0, 4).map((post) => (
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2" key={post._id}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </Contaner>
    </div>
  );
}

export default Home;
