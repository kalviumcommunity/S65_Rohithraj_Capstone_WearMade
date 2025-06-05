import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProfileCard from '@/components/profile/ProfileCard';
import TabsBar from '@/components/profile/TabsBar';
import WorksTab from '@/components/profile/WorksTab';
import ServicesTab from '@/components/profile/ServicesTab';
import LikedPostsTab from '@/components/profile/LikedPostsTab';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [likedItems, setLikedItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'works' | 'services' | 'liked' | 'about'>('works');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Determine if viewing own profile or someone else's
  const viewingSelf = !username || (user && user.username === username);
  
  useEffect(() => {
    // If no user is logged in and not loading, redirect to login
    if (!loading && !user) {
      navigate('/login');
      return;
    }
    
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (username && username !== user?.username) {
          // If username is provided and it's not the current user, fetch that user's profile
          const response = await axios.get(`${VITE_API_BASE_URL}/api/users/${username}`);
          setProfileData(response.data);
          
          // You'd also fetch their public portfolio items here
          // setPortfolioItems(response.data.portfolioItems || []);
        } else {
          // If on own profile route, use current logged-in user data
          setProfileData(user);
          
          // You'd fetch your own portfolio items, services here
          // const portfolioResponse = await axios.get(`${VITE_API_BASE_URL}/api/portfolio`);
          // setPortfolioItems(portfolioResponse.data);
        }
        
        // For now, just set empty arrays until API endpoints are ready
        setPortfolioItems([]);
        setServices([]);
        setLikedItems([]);
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!loading) {
      fetchProfileData();
    }
  }, [username, user, loading, navigate]);
  
  const handleUploadWork = () => {
    // Handle uploading work functionality
    console.log('Upload work clicked');
  };

  const handleAddService = () => {
    // Handle adding service functionality
    console.log('Add service clicked');
  };

  // Loading and error states remain the same
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Profile Card Section */}
      <ProfileCard 
        viewingSelf={viewingSelf} 
        userData={profileData} 
      />
      
      {/* Tabs Bar */}
      <TabsBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewingSelf={viewingSelf}
      />
      
      {/* Content based on active tab */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Works Tab */}
          {activeTab === 'works' && (
            <WorksTab 
              portfolioItems={portfolioItems}
              viewingSelf={viewingSelf}
              onUploadClick={handleUploadWork}
            />
          )}
          
          {/* Services Tab */}
          {activeTab === 'services' && (
            <ServicesTab 
              services={services}
              viewingSelf={viewingSelf}
              onAddService={handleAddService}
            />
          )}
          
          {/* Liked Tab */}
          {activeTab === 'liked' && (
            <LikedPostsTab 
              likedItems={likedItems}
              viewingSelf={viewingSelf}
            />
          )}
          
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="prose max-w-none">
              {profileData?.bio ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                  
                  {/* Specializations */}
                  {profileData.specializations && profileData.specializations.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.specializations.map((specialization: string, index: number) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                          >
                            {specialization}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Location */}
                  {profileData.location && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-700">{profileData.location}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No information available</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {viewingSelf
                      ? "Add information about yourself to help clients know more about you."
                      : "This user hasn't added any information yet."}
                  </p>
                  {viewingSelf && (
                    <button className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200">
                      Edit profile
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;