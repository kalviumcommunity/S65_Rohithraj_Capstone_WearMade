import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Home = () => {
  const [heroQuery, setHeroQuery] = useState('');
  const navigate = useNavigate();

  // Function to handle search from hero section
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Search Bar */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-5">
            Discover the world's<br />top designers
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Explore work from the most talented and accomplished designers<br />
            ready to take on your next project
          </p>
          
          {/* Search Bar - With ID for Intersection Observer */}
          <form id="hero-search" onSubmit={handleHeroSearch} className="max-w-3xl mx-auto mb-10">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search for designs or designer"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
                value={heroQuery}
                onChange={e => setHeroQuery(e.target.value)}
              />
            </div>
          </form>
          
          {/* Trending Searches */}
          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-3">Trending searches</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/search?q=landing-page" className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                landing page
              </Link>
              <Link to="/search?q=e-commerce" className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                e-commerce
              </Link>
              <Link to="/search?q=mobile-app" className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                mobile app
              </Link>
              <Link to="/search?q=logo-design" className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                logo design
              </Link>
              <Link to="/search?q=dashboard" className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                dashboard
              </Link>
              <Link to="/search?q=icons" className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200">
                icons
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose WearMade?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We connect you with talented tailors and designers to create unique, personalized fashion pieces.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Custom Designs",
                description: "Work with skilled tailors to create unique clothing pieces tailored to your style and measurements."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Expert Tailors",
                description: "Connect with verified, experienced tailors and designers from around the world."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Quality Assured",
                description: "Every piece is crafted with attention to detail and backed by our quality guarantee."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Popular Categories</h2>
            <p className="text-xl text-gray-600">Explore the most sought-after fashion categories</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Traditional Wear", count: "150+ designs", color: "from-purple-400 to-pink-400" },
              { name: "Formal Suits", count: "200+ designs", color: "from-blue-400 to-indigo-400" },
              { name: "Casual Wear", count: "300+ designs", color: "from-green-400 to-teal-400" },
              { name: "Wedding Attire", count: "100+ designs", color: "from-yellow-400 to-orange-400" }
            ].map((category, index) => (
              <Link key={index} to={`/explore/${category.name.toLowerCase().replace(' ', '-')}`}>
                <div className="group cursor-pointer">
                  <div className={`aspect-square bg-gradient-to-br ${category.color} rounded-2xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <div className="text-white text-center">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z" />
                        </svg>
                      </div>
                      <p className="font-medium">{category.count}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;