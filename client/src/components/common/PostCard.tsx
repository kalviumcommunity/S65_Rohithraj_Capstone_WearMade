import React, { useState } from 'react';
import { Heart, Bookmark, Eye } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    imageUrl: string;
    author?: {
      name: string;
      avatarUrl: string;
      isPro?: boolean;
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
      className="relative bg-white rounded-lg overflow-hidden shadow-md"
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
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="p-4">
            <h3 className="text-white font-medium text-lg truncate">{post.title}</h3>
          </div>
        </div>
        {/* Action buttons - positioned absolute, only visible on hover */}
        <div
          className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-300 pointer-events-auto ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(!bookmarked);
            }}
            className="rounded-full bg-white/90 p-2.5 shadow-sm hover:bg-white"
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="rounded-full bg-white/90 p-2.5 shadow-sm hover:bg-white"
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      {/* User info and stats */}
      <div className="flex items-center gap-3 p-3">
        {post.author && (
          <>
            <img
              src={post.author.avatarUrl}
              alt={post.author.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900 text-sm flex items-center gap-1">
              {post.author.name}
              {post.author.isPro && (
                <span className="bg-gray-200 text-xs px-1.5 py-0.5 rounded-full">PRO</span>
              )}
            </span>
          </>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span className="flex items-center">
            <Heart size={15} className="mr-1" /> {post.likes}
          </span>
          <span className="flex items-center">
            <Eye size={15} className="mr-1" /> {post.views}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;