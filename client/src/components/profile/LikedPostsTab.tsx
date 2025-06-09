import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LikedPostsTabProps {
  likedItems: any[];
  viewingSelf: boolean;
}

const LikedPostsTab: React.FC<LikedPostsTabProps> = ({ 
  likedItems = [], 
  viewingSelf = false 
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {likedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Render liked items here */}
          {likedItems.map(item => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <p className="text-white font-medium">{item.title}</p>
                    <div className="flex items-center mt-1">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white text-sm ml-1">{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No liked designs</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {viewingSelf
              ? "Designs you like will appear here. Start exploring to find inspiration."
              : "This user hasn't liked any designs yet."}
          </p>
          {viewingSelf && (
            <button 
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
            >
              Explore designs
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LikedPostsTab;