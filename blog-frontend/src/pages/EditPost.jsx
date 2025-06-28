import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import useApi from '../hooks/useApi';
import { getPostBySlug, updatePost } from '../services/api';
import { 
  ArrowLeft, 
  Edit3, 
  AlertCircle, 
  CheckCircle, 
  FileText,
  Clock,
  Calendar,
  Eye,
  Save,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useBlog } from '../context/BlogContext';

const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { callApi: fetchPostApi, loading: loadingPost, data: post, error: fetchError } = useApi();
  const { callApi: updatePostApi, loading: updating, error: updateError } = useApi();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { refreshPosts } = useBlog();

  useEffect(() => {
    fetchPostApi(getPostBySlug, slug);
  }, [slug, fetchPostApi]);

  const handleSubmit = async (updatedData) => {
    try {
      await updatePostApi(updatePost, slug, updatedData);
      setShowSuccessMessage(true);
      refreshPosts();
      // Show success message briefly before navigating
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      console.error('Update post error:', err);
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  const handleRetry = () => {
    fetchPostApi(getPostBySlug, slug);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Success Overlay
  if (showSuccessMessage) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Post Updated Successfully!</h3>
          <p className="text-gray-600">Redirecting to admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Loading State
  if (loadingPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="flex flex-col items-center space-y-6">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Post</h3>
                <p className="text-gray-600">Fetching post data for editing...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (fetchError || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
              <p className="text-gray-600 mb-6">
                {fetchError || "The post you're trying to edit could not be found or failed to load."}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <RefreshCw size={20} />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={handleBack}
                  className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Back to Dashboard</span>
                </button>
              </div>

              {/* Debug Information (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-8 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Debug Information
                  </summary>
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <pre className="text-xs text-gray-600 overflow-auto">
                      {JSON.stringify({ slug, post, fetchError }, null, 2)}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const postData = post.data || post;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Edit3 size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Edit Post
                  </h1>
                  <p className="text-gray-600">
                    Update and improve your content
                  </p>
                </div>
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center space-x-3">
              <a
                href={`/posts/${postData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                <Eye size={16} />
                <span>Preview</span>
              </a>
            </div>
          </div>
        </div>

        {/* Post Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar size={16} className="text-blue-500" />
                <span>Created: {formatDate(postData.createdAt)}</span>
              </div>
              {postData.updatedAt && postData.updatedAt !== postData.createdAt && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock size={16} className="text-green-500" />
                  <span>Updated: {formatDate(postData.updatedAt)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Published
              </span>
            </div>
          </div>
        </div>

        {/* Update Error Message */}
        {updateError && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-red-500">
            <div className="flex items-center space-x-3">
              <AlertCircle size={24} className="text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Error Updating Post</h3>
                <p className="text-red-600">{updateError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Post Form */}
        <PostForm 
          initialData={postData}
          onSubmit={handleSubmit} 
          isEditing={true}
          isLoading={updating}
        />

        {/* Loading Overlay */}
        {updating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Updating Your Post</h3>
              <p className="text-gray-600">Please wait while we save your changes...</p>
            </div>
          </div>
        )}

        {/* Floating Save Reminder */}
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Save size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Remember to save</p>
              <p className="text-xs text-gray-600">Your changes are not saved automatically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
