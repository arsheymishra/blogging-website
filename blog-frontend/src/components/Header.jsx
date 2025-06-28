import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Edit3, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isAdminPath = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';
  const isCreatePost = location.pathname === '/admin/create';
  const isEditPost = location.pathname.includes('/admin/edit');

  // Show back button if not on home or admin dashboard
  const showBack = !isHome && location.pathname !== '/admin';

  const handleBack = () => {
    if (isAdminPath) {
      navigate('/admin');
    } else {
      navigate(-1);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getPageTitle = () => {
    if (isCreatePost) return 'Create New Post';
    if (isEditPost) return 'Edit Post';
    if (location.pathname === '/admin') return 'Admin Dashboard';
    if (location.pathname.startsWith('/posts/')) return 'Blog Post';
    return 'My Blog';
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {showBack && (
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-all duration-200 hover:scale-105 active:scale-95"
                title="Go Back"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            
            <div className="flex items-center space-x-3">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MB</span>
                </div>
                <span className="text-xl font-bold tracking-tight hidden sm:block">
                  My Blog
                </span>
              </Link>
              
              {/* Page Title for Mobile */}
              <div className="sm:hidden">
                <span className="text-white/80 text-sm font-medium">
                  {getPageTitle()}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isHome 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            <Link
              to="/admin/create"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isCreatePost 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Edit3 size={18} />
              <span>Create Post</span>
            </Link>
            
            <Link
              to="/admin"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === '/admin' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings size={18} />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-all duration-200"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isHome 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              
              <Link
                to="/admin/create"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isCreatePost 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Edit3 size={18} />
                <span>Create Post</span>
              </Link>
              
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === '/admin' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Settings size={18} />
                <span>Admin Dashboard</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
