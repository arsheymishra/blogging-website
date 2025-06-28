import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';

const PostCard = ({ post }) => {
  // Extract plain text from HTML content for preview
  const getPreviewText = (htmlContent, maxLength = 120) => {
    if (!htmlContent) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...' 
      : plainText;
  };

  // Format date in a more readable way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Estimate reading time
  const getReadingTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    const wordCount = plainText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime < 1 ? 1 : readingTime;
  };

  const titleStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const previewStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  return (
    <article className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
      {/* Card Header with Gradient */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
      
      <div className="p-6">
        {/* Post Meta Information */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar size={14} className="text-blue-500" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} className="text-green-500" />
              <span>{getReadingTime(post.content)} min read</span>
            </div>
          </div>
          
          {/* Author Badge */}
          <div className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
            <User size={12} className="text-gray-500" />
            <span className="text-gray-600 font-medium">Admin</span>
          </div>
        </div>

        {/* Post Title */}
        <Link 
          to={`/posts/${post.slug}`} 
          className="block group-hover:text-blue-600 transition-colors duration-200"
        >
          <h2 
            className="text-xl font-bold text-gray-900 mb-3 leading-tight"
            style={titleStyle}
          >
            {post.title}
          </h2>
        </Link>

        {/* Post Preview */}
        <p 
          className="text-gray-600 mb-4 leading-relaxed"
          style={previewStyle}
        >
          {getPreviewText(post.content)}
        </p>

        {/* Tags/Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
            📝 Article
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            ✨ Featured
          </span>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Published</span>
          </div>
          
          <Link 
            to={`/posts/${post.slug}`} 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <span>Read More</span>
            <ArrowRight 
              size={16} 
              className="group-hover:translate-x-1 transition-transform duration-200" 
            />
          </Link>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </article>
  );
};

export default PostCard;
