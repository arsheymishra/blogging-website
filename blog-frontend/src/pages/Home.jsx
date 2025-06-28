import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen,
  TrendingUp,
  Star,
  User,
  RefreshCw,
  AlertCircle
} from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/posts`;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data.data || []);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract plain text from HTML content for preview
  const getPreviewText = (htmlContent, maxLength = 150) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-yellow-300">My Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Discover insightful articles, tutorials, and thoughts on web development, technology, and more.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-xl shadow-lg focus:ring-4 focus:ring-white/30 focus:outline-none text-lg"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{posts.length}</div>
                <div className="text-blue-100">Articles</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">1.2k</div>
                <div className="text-blue-100">Readers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">5.6k</div>
                <div className="text-blue-100">Views</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="flex flex-col items-center space-y-6">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Articles</h3>
                <p className="text-gray-600">Fetching the latest content for you...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Posts</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchPosts}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <RefreshCw size={20} />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={40} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Articles Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We're working on creating amazing content for you. Check back soon for insightful articles and tutorials.
              </p>
              <Link
                to="/admin/create"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={20} />
                <span>Create First Article</span>
              </Link>
            </div>
          </div>
        )}

        {/* No Search Results */}
        {!loading && !error && posts.length > 0 && filteredPosts.length === 0 && searchTerm && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-4">
              No articles match your search for "<strong>{searchTerm}</strong>"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && filteredPosts.length > 0 && (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {searchTerm ? 'Search Results' : 'Latest Articles'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {searchTerm 
                    ? `${filteredPosts.length} articles found for "${searchTerm}"`
                    : `${filteredPosts.length} articles available`
                  }
                </p>
              </div>
              
              {/* Featured Badge */}
              <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full">
                <Star size={16} className="text-yellow-600" />
                <span className="text-yellow-800 font-medium">Featured Content</span>
              </div>
            </div>

            {/* Posts List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPosts.map((post, index) => (
                <article 
                  key={post._id} 
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
                >
                  {/* Featured Post Indicator */}
                  {index === 0 && (
                    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                  )}
                  
                  <div className="p-6">
                    {/* Post Meta */}
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
                      
                      {index === 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <TrendingUp size={12} className="mr-1" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Post Title */}
                    <Link to={`/posts/${post.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Post Preview */}
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {getPreviewText(post.content)}
                    </p>

                    {/* Post Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <User size={14} />
                        <span>Admin</span>
                      </div>
                      
                      <Link 
                        to={`/posts/${post.slug}`}
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 group"
                      >
                        <span>Read More</span>
                        <ArrowRight 
                          size={16} 
                          className="group-hover:translate-x-1 transition-transform duration-200" 
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button (if needed) */}
            {filteredPosts.length >= 6 && (
              <div className="text-center pt-8">
                <button className="inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg font-medium transition-colors border border-gray-300 shadow-sm">
                  <RefreshCw size={20} />
                  <span>Load More Articles</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
