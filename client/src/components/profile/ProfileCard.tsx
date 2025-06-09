import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

type ProfileCardProps = {
  viewingSelf?: boolean;
  userData?: {
    _id?: string;
    name?: string;
    username?: string;
    email?: string;
    role?: string;
    isVerified?: boolean;
    followers?: any[];
    following?: any[];
    averageRating?: number;
    reviewsCount?: number;
    portfolioImages?: string[];
    createdAt?: string;
    updatedAt?: string;
    location?: string;
    avatar?: string;
  };
};

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  viewingSelf = true,
  userData 
}) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // No menu state to update, so just return
      if (!event.target || !(event.target instanceof HTMLElement)) return;
      return
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Loading state remains the same
  if (loading || !user) {
    return (
      <section className="py-10 px-4 border-b border-gray-200">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }
  
  // Use provided userData or fallback to logged in user
  const profileData = userData || user;

  return (
    <section className="py-10 px-4"> {/* Removed border-b border-gray-200 */}
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left side - profile info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:w-1/2">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              {profileData.avatar ? (
                <img 
                  src={profileData.avatar} 
                  alt={`${profileData.name}'s avatar`}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <span className="text-2xl font-medium">
                    {profileData.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
            
            {viewingSelf && (
              <button 
                className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors duration-200"
                aria-label="Change profile picture"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
          
          {/* User info */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
            <p className="text-gray-500 mb-2">@{profileData.username}</p>
            
            {profileData.role && (
              <p className="text-gray-600 text-sm mb-1">
                {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
              </p>
            )}
            
            {profileData.location && (
              <p className="text-gray-600 text-sm flex items-center justify-center sm:justify-start">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {profileData.location}
              </p>
            )}
            
            {viewingSelf && (
              <div className="mt-4">
                <Button variant="outline" size="sm" className="rounded-full">
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Centered follower/following stats */}
        <div className="flex flex-col justify-center items-center sm:mx-auto">
          <div className="flex space-x-12">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profileData.followers?.length || 0}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profileData.following?.length || 0}</p>
              <p className="text-sm text-gray-600">Following</p>
            </div>
          </div>
        </div>
        
        {/* Add empty div to maintain balance for justify-between */}
        <div className="hidden sm:block sm:w-1/6"></div>
      </div>
    </section>
  );
};

export default ProfileCard;