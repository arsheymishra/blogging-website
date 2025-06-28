import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import SlugGenerator from './SlugGenerator';
import { Save, Edit3, Eye, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const PostForm = ({ initialData, onSubmit, isEditing, isLoading }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setSlug(initialData.slug);
    }
  }, [initialData]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!content.trim() || content === '<p><br></p>') {
      newErrors.content = 'Content is required';
    }

    if (!slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({ title: title.trim(), content, slug: slug.trim() });
    }
  };

  const getWordCount = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    return plainText.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = () => {
    const wordsPerMinute = 200;
    const wordCount = getWordCount();
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                {isEditing ? <Edit3 size={20} className="text-white" /> : <Save size={20} className="text-white" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Post' : 'Create New Post'}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? 'Update your existing blog post' : 'Share your thoughts with the world'}
                </p>
              </div>
            </div>
            
            {/* Preview Toggle */}
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isPreviewMode 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye size={16} />
              <span>{isPreviewMode ? 'Edit Mode' : 'Preview'}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Post Title</h2>
              {title && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {title.length}/200
                </span>
              )}
            </div>
            
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title for your post..."
              className={`w-full px-4 py-3 text-lg border rounded-lg transition-all duration-200 ${
                errors.title 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } focus:ring-2 focus:outline-none`}
              required
            />
            
            {errors.title && (
              <div className="flex items-center space-x-2 mt-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">{errors.title}</span>
              </div>
            )}
          </div>

          {/* Slug Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <SlugGenerator
              title={title}
              value={slug}
              onChange={setSlug}
              isEditable={isSlugEditable || isEditing}
              error={errors.slug}
            />

            {isEditing && (
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="edit-slug"
                  checked={isSlugEditable}
                  onChange={() => setIsSlugEditable(!isSlugEditable)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="edit-slug" className="ml-2 text-sm text-gray-700">
                  Allow slug editing (use with caution - may break existing links)
                </label>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Content</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{getWordCount()} words</span>
                <span>~{getReadingTime()} min read</span>
              </div>
            </div>

            {isPreviewMode ? (
              <div className="min-h-[300px] p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-xl font-bold mb-4">{title || 'Your Title Here'}</h3>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content || '<p>Start writing your content...</p>' }}
                />
              </div>
            ) : (
              <RichTextEditor 
                value={content} 
                onChange={setContent}
                error={errors.content}
              />
            )}

            {errors.content && !isPreviewMode && (
              <div className="flex items-center space-x-2 mt-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">{errors.content}</span>
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-500" />
                <span>Auto-saved as draft</span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all duration-200"
                >
                  Save as Draft
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      <span>{isEditing ? 'Updating...' : 'Publishing...'}</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>{isEditing ? 'Update Post' : 'Publish Post'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
