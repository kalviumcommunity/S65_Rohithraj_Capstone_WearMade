import React from 'react';

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    imageUrl: string;
    price: number;
    duration: string;
    description: string;
    onQuickHire?: () => void;
  };
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="bg-[#FFFDEF] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <div className="relative pb-[56.25%] bg-gray-100">
        <img
          src={service.imageUrl}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-2">{service.title}</h3>
        <div className="text-gray-700 font-medium mb-2">
          ${service.price} <span className="mx-2">|</span> {service.duration}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
        <button
          onClick={service.onQuickHire}
          className="mt-auto inline-flex items-center gap-2 bg-yellow-100 text-yellow-900 font-semibold text-sm px-3 py-2 rounded transition hover:bg-yellow-200"
        >
          <span role="img" aria-label="lightning">⚡</span> Quick Hire
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;