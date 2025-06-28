import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPosts } from '../services/api';

const BlogContext = createContext();

export const useBlog = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await getPosts();
      setPosts(response.data.data); // <-- fix: use the array of posts
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const refreshPosts = () => {
    fetchPosts();
  };

  const value = {
    posts,
    isLoading,
    error,
    refreshPosts
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};
