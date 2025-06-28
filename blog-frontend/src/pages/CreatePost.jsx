import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import useApi from "../hooks/useApi";
import { createPost } from "../services/api";
import { useBlog } from "../context/BlogContext";

const CreatePost = () => {
  const navigate = useNavigate();
  const { callApi: createPostApi, loading, error } = useApi();
  const { refreshPosts } = useBlog();

  const handleSubmit = async (postData) => {
    try {
      await createPostApi(createPost, postData);
      refreshPosts();
      navigate("/admin");
    } catch (err) {
      console.error("Create post error:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Post
      </h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <PostForm onSubmit={handleSubmit} />
      {loading && (
        <div className="mt-4 text-center text-gray-600">Creating post...</div>
      )}
    </div>
  );
};

export default CreatePost;
