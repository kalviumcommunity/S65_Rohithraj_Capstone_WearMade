import React, { useState, useEffect} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Message01Icon } from '@hugeicons/core-free-icons';
import logo from '@/assets/logo.svg';
import { getAuthStatus } from '@/lib/cookieUtils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isAuthenticatedByCookie, setIsAuthenticatedByCookie] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
  // Safely access auth context with error handling
  const auth = useAuth();
  const { user, loading } = auth || { user: null, loading: true };

  // Check cookie authentication status
  useEffect(() => {
    const checkCookieAuth = () => {
      const authStatus = getAuthStatus();
      setIsAuthenticatedByCookie(authStatus.isAuthenticated);
    };

    // Check immediately
    checkCookieAuth();

    // Set up interval to check cookie status every 5 seconds
    const interval = setInterval(checkCookieAuth, 5000);

    return () => clearInterval(interval);
  }, []);

  // Determine if user is authenticated (prefer AuthContext user, fallback to cookie)
  const isAuthenticated = user ? true : isAuthenticatedByCookie;

  // Set up intersection observer to detect when hero search is out of view
  useEffect(() => {
    // Only set up the observer if we're on the home page
    if (!isHomePage) {
      setShowSearch(true); // Always show search on non-home pages
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When hero section is not intersecting (out of view), show search bar
        setShowSearch(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    
    // We'll observe an element with id "hero-search" that will be added to the hero section
    const heroSearch = document.getElementById('hero-search');
    if (heroSearch) {
      observer.observe(heroSearch);
    }

    return () => {
      if (heroSearch) {
        observer.unobserve(heroSearch);
      }
    };
  }, [isHomePage]);

  useEffect(() => {
    // Clear any auth errors when component unmounts or dependencies change
    return () => {
      setAuthError(null);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      if (auth && auth.logout) {
        await auth.logout();
        // Clear the cookie authentication state immediately
        setIsAuthenticatedByCookie(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setAuthError('Failed to log out. Please try again.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      // Close mobile search after submitting
      setIsMobileSearchOpen(false);
    }
  };

  // Toggle mobile search
  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <>
      {/* Use conditional positioning based on showSearch state and current page */}
      <nav className={`bg-white border-b border-gray-200 z-50 w-full transition-all duration-200 ${
        showSearch && isHomePage ? 'fixed top-0 left-0 right-0' : 'relative'
      }`}>
        {/* Auth error message display */}
        {authError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 text-sm text-center">
            {authError}
            <button 
              onClick={() => setAuthError(null)} 
              className="ml-2 font-bold"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 ml-0 mr-3 rounded-md hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <div className="space-y-1">
                <span className={`block w-5 h-0.5 bg-gray-600 transition-transform duration-200 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-gray-600 transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-gray-600 transition-transform duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group mr-6">
              <img 
                src={logo} 
                alt="WearMade Logo" 
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-200" 
              />
            </Link>

            {/* Conditional Search Bar - Show on all non-home pages and when hero search is out of view on home page */}
            {(showSearch || !isHomePage) && (
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
            )}

            {/* Navigation Links */}
            <div className={`hidden md:flex items-center space-x-8 ${showSearch ? 'mr-8' : 'flex-1'}`}>
              <Link to="/explore" className="text-black hover:text-gray-500 font-medium transition-colors duration-200">
                Explore
              </Link>
              <Link to="/tailors" className="text-black hover:text-gray-500 font-medium transition-colors duration-200">
                Hire a Designer
              </Link>
            </div>

            {/* User Actions - right side */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* Mobile Search Icon - Only shown when hero search is out of view */}
              {showSearch && (
                <button 
                  className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  onClick={toggleMobileSearch}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 text-gray-700" />
                </button>
              )}
            
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : isAuthenticated ? (
                <>
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
                  
                  {/* User profile dropdown remains the same */}
                  <div className="relative group">
                    <button
                      className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsMenuOpen((open) => !open)}
                      aria-label="Open profile menu"
                    >
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    </button>
                    {/* Desktop dropdown */}
                    <div className="hidden md:block absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-black">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
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

          {/* Mobile Search Bar - Toggle visibility */}
          {(showSearch || !isHomePage) && isMobileSearchOpen && (
            <div className="md:hidden pb-3 animate-in slide-in-from-top duration-200">
              <form onSubmit={handleSearch}>
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search for designs or designer"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </form>
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top duration-200">
              <div className="space-y-4">
                <Link to="/explore" className="block text-black hover:text-gray-500 font-medium transition-colors duration-200">Explore</Link>
                <Link to="/tailors" className="block text-black hover:text-gray-500 font-medium transition-colors duration-200">Hire a Designer</Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="block text-black hover:text-gray-500 font-medium transition-colors duration-200">Profile</Link>
                    <button
                      onClick={handleLogout}
                      className="block text-left text-red-600 hover:text-red-700 hover:bg-red-50 font-medium transition-colors duration-200 px-0 py-2"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
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
      
      {/* Add spacer div when navbar is fixed to prevent content jump (only on home page) */}
      {showSearch && isHomePage && <div className="h-16 w-full"></div>}
    </>
  );
};

export default Navbar;