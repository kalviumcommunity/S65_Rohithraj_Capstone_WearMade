import React, { useState } from 'react';
import { Heart, Bookmark } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    imageUrl: string;
    author: {
      name: string;
      avatarUrl: string;
    };
    likes: number;
    views: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow group transition-all duration-300 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Section */}
      <div className="relative pb-[75%] bg-gray-100">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay on hover */}
        <div
          className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="p-4">
            <h3 className="text-white font-semibold text-lg mb-4 truncate">{post.title}</h3>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setBookmarked((b) => !b)}
                className="rounded-full bg-white/20 text-white hover:bg-white/30 p-3 transition-colors"
                aria-label={bookmarked ? 'Remove from saved' : 'Save post'}
              >
                <Bookmark size={22} fill={bookmarked ? 'white' : 'none'} />
              </button>
              <button
                onClick={() => setLiked((l) => !l)}
                className="rounded-full bg-white/20 text-white hover:bg-white/30 p-3 transition-colors"
                aria-label={liked ? 'Unlike post' : 'Like post'}
              >
                <Heart size={22} fill={liked ? 'white' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      <div className="flex items-center gap-3 px-4 py-3">
        <img
          src={post.author.avatarUrl}
          alt={post.author.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="font-medium text-gray-900 text-sm truncate">{post.author.name}</span>
        <div className="flex-1" />
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <span className="flex items-center gap-1">
            <Heart size={16} className="inline" /> {post.likes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;