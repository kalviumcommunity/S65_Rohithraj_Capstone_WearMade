import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Message01Icon } from '@hugeicons/core-free-icons';
import logo from '@/assets/logo.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
    // Implement search functionality
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - made bigger */}
          <Link to="/" className="flex items-center space-x-2 group mr-6">
            <img 
              src={logo} 
              alt="WearMade Logo" 
              className="h-10 w-auto group-hover:scale-105 transition-transform duration-200" 
            />
          </Link>

          {/* Simplified Search Bar - EXPANDED */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-4">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search for designs or designer"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Navigation Links - Desktop - FIND JOBS REMOVED */}
          <div className="hidden md:flex items-center space-x-8 mr-8">
            <Link to="/explore" className="text-black hover:text-gray-500 font-medium transition-colors duration-200">
              Explore
            </Link>

            <Link to="/tailors" className="text-black hover:text-gray-500 font-medium transition-colors duration-200">
              Hire a Designer
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 mr-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="space-y-1">
              <span className={`block w-5 h-0.5 bg-gray-600 transition-transform duration-200 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 transition-transform duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>

          {/* User Actions - right side */}
          <div className="flex items-center space-x-4 ml-auto">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <>
                {/* Message Icon - Updated to HugeiconsIcon */}
                <Link to="/messages" className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <HugeiconsIcon 
                    icon={Message01Icon} 
                    size={20} 
                    color="currentColor" 
                    strokeWidth={1.5} 
                    className="text-black-600"
                  />
                  <span className="sr-only">Messages</span>
                </Link>
                
                {/* User Profile - Existing */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                  </button>
                  {/* User Dropdown */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-black">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-black hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200">Profile</Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/signup" className="text-black hover:text-gray-500 font-medium transition-colors duration-200 hidden sm:block">
                  Sign up
                </Link>
                <Link to="/login">
                  <Button className="bg-[#13111C] hover:bg-[#201d2f] text-white px-4 py-2 rounded-full">
                    Log in
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu - FIND JOBS REMOVED */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top duration-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search for designs or designer"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
            </form>
            
            <div className="space-y-4">
              <Link to="/explore" className="block text-black hover:text-gray-500 font-medium transition-colors duration-200">Explore</Link>
              <Link to="/tailors" className="block text-black hover:text-gray-500 font-medium transition-colors duration-200">Hire a Designer</Link>
              {!user && (
                <div className="pt-4 border-t border-gray-200">
                  <Link to="/signup" className="block text-black hover:text-gray-500 font-medium transition-colors duration-200 mb-2">Sign up</Link>
                  <Link to="/login" className="block text-black font-medium hover:text-gray-500">Log in</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;