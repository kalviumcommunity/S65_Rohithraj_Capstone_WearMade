import React from 'react';
import { Briefcase } from 'lucide-react';

interface ServicesTabProps {
  services: any[];
  viewingSelf: boolean;
  onAddService?: () => void;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ 
  services = [], 
  viewingSelf = false,
  onAddService
}) => {
  return (
    <div>
      {services.length > 0 || viewingSelf ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add New Service Card - Only visible when viewing own profile */}
          {viewingSelf && (
            <div className="cursor-pointer group" onClick={onAddService}>
              <div className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 h-64 flex flex-col items-center justify-center hover:border-gray-400 transition-colors duration-300">
                <div className="rounded-full bg-gray-100 p-4 mb-3 group-hover:bg-gray-200 transition-colors duration-300">
                  <Briefcase className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-gray-600 font-medium text-sm">Add a service</p>
                <p className="text-gray-400 text-xs mt-1">Let clients know what you offer</p>
              </div>
            </div>
          )}
          
          {/* Render actual services here */}
          {services.map(service => (
            <div key={service.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Service card content would go here */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services available</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {viewingSelf
              ? "Start offering your design services to clients around the world."
              : "This designer hasn't added any services yet."}
          </p>
          {viewingSelf && (
            <button 
              onClick={onAddService}
              className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
            >
              Add a service
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesTab;