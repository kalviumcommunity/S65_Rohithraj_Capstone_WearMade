import React from 'react';
import { Upload } from 'lucide-react';

interface WorksTabProps {
  portfolioItems: any[];
  viewingSelf: boolean;
  onUploadClick?: () => void;
}

const WorksTab: React.FC<WorksTabProps> = ({ 
  portfolioItems = [], 
  viewingSelf = false,
  onUploadClick
}) => {
  return (
    <div>
      {(portfolioItems.length > 0 || viewingSelf) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Upload New Design Card - Only visible when viewing own profile */}
          {viewingSelf && (
            <div className="cursor-pointer group" onClick={onUploadClick}>
              <div className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 h-64 flex flex-col items-center justify-center hover:border-gray-400 transition-colors duration-300">
                <div className="rounded-full bg-gray-100 p-4 mb-3 group-hover:bg-gray-200 transition-colors duration-300">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-gray-600 font-medium text-sm">Upload a design</p>
                <p className="text-gray-400 text-xs mt-1">PNG, JPG, WEBP</p>
              </div>
            </div>
          )}
          {portfolioItems.map(item => (
            <div key={item._id || item.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src={item.image || (item.images && item.images[0])} 
                  alt={item.title} 
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <p className="text-white font-medium">{item.title}</p>
                    <div className="flex items-center mt-1">
  
                      {/* Like count removed on hover as requested */}
                      {/* <span className="text-white text-sm ml-1">{item.likes ? item.likes.length : 0}</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Empty state - No works yet */}
      {portfolioItems.length === 0 && !viewingSelf && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No works yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {viewingSelf 
              ? "Start showcasing your work by uploading your first design."
              : "This user hasn't uploaded any works yet."}
          </p>
          {viewingSelf && (
            <button 
              onClick={onUploadClick}
              className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
            >
              Upload a design
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WorksTab;