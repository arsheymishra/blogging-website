import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { getPostBySlug } from '../services/api';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  BookOpen,
  Heart,
  MessageCircle,
  Eye,
  RefreshCw,
  AlertTriangle,
  Copy,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { callApi: fetchPost, loading, error, data: post } = useApi();
  const [htmlContent, setHtmlContent] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchPost(getPostBySlug, slug);
  }, [slug, fetchPost]);

  useEffect(() => {
    if (post) {
      // Support both post and post.data shape
      setHtmlContent(post.content || post.data?.content || '');
    }
  }, [post]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    fetchPost(getPostBySlug, slug);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.title || post?.data?.title || '')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-16">
            <div className="flex flex-col items-center space-y-8">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Article</h3>
                <p className="text-gray-600 text-lg">Preparing your reading experience...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Article</h2>
              <p className="text-gray-600 mb-8 text-lg">{error}</p>
              
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
                  <span>Go Back</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={40} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
              <p className="text-gray-600 mb-8 text-lg">
                The article you're looking for doesn't exist or has been moved.
              </p>
              <Link
                to="/"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const postData = post.data || post;
  const title = postData?.title || "Untitled";
  const createdAt = postData?.createdAt;
  const content = htmlContent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Helmet>
        <title>{title} | My Blog</title>
        <meta name="description" content={content.replace(/<[^>]+>/g, '').substring(0, 160)} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={content.replace(/<[^>]+>/g, '').substring(0, 160)} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Header Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>
              
              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleCopyLink}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Copy size={16} />
                    <span>{copySuccess ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                  <a
                    href={shareUrls.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Facebook size={16} />
                    <span>Facebook</span>
                  </a>
                  <a
                    href={shareUrls.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Twitter size={16} />
                    <span>Twitter</span>
                  </a>
                  <a
                    href={shareUrls.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Linkedin size={16} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Article Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 md:p-12">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                {title}
              </h1>
              
              {/* Article Meta */}
              <div className="flex flex-wrap items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <User size={18} />
                  <span className="font-medium">Admin</span>
                </div>
                {createdAt && (
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} />
                    <span>{formatDate(createdAt)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Clock size={18} />
                  <span>{getReadingTime(content)} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-8 md:p-12">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:rounded"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Article Footer */}
          <div className="bg-gray-50 p-8 md:p-12 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart size={20} />
                  <span>Like this article</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <MessageCircle size={20} />
                  <span>Comment</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-500">
                <Eye size={18} />
                <span>1.2k views</span>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Continue Reading
          </h2>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Explore More Articles
            </h3>
            <p className="text-gray-600 mb-6">
              Discover more insights and stories on our blog
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
