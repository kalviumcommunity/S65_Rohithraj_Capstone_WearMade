import React, { useState } from 'react';
import { Heart, Bookmark } from 'lucide-react';

interface WorkCardProps {
  imageUrl: string;
  title: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isOwnAccount?: boolean;
}

export const WorkCard: React.FC<WorkCardProps> = ({
  imageUrl,
  title,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  isOwnAccount = false,
}) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div
      className="bg-[#FFFDEF] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative pb-[75%] bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : ''
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg mb-2 truncate">
              {title}
            </h3>
            {!isOwnAccount && (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`rounded-full p-2 ${
                    liked
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  } transition-colors`}
                  aria-label={liked ? 'Unlike design' : 'Like design'}
                >
                  <Heart size={16} fill={liked ? 'white' : 'none'} />
                </button>
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`rounded-full p-2 ${
                    bookmarked
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  } transition-colors`}
                  aria-label={bookmarked ? 'Remove from saved' : 'Save design'}
                >
                  <Bookmark size={16} fill={bookmarked ? 'white' : 'none'} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};