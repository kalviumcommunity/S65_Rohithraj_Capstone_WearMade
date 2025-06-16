import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Comment } from '@/components/common/Comment';
import { CommentForm } from '@/components/common/CommentForm';
import { PostHeader } from '@/components/common/PostHeader';

interface PostAuthor {
  _id: string;
  name: string;
  avatar?: string;
}

interface PostData {
  _id: string;
  title: string;
  images: string[];
  description: string;
  tags: string[];
  likes: string[];
  views: number;
  comments: {
    _id: string;
    user: PostAuthor;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  user: PostAuthor;
}

const Post: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { user } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // Check if current user is post owner
  const isOwner = user && post?.user._id === user._id;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        console.log('Fetching post with ID:', postId);
        const response = await axios.get(`${API_BASE_URL}/api/posts/${postId}`, {
          withCredentials: true
        });
        console.log('Response from server:', response.data);
        
        // Check the structure of the response data
        if (response.data && response.data.post) {
          // If the response has a post property
          setPost(response.data.post);
        } else if (response.data && response.data._id) {
          // If the post data is directly in response.data
          setPost(response.data);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, API_BASE_URL]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Send like request to API
      await axios.post(
        `${API_BASE_URL}/api/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );
      
      // Update post with new like status
      setPost(prev => {
        if (!prev) return prev;
        
        // If user already liked, remove their ID; otherwise add it
        const userLiked = prev.likes.includes(user._id);
        const updatedLikes = userLiked 
          ? prev.likes.filter(id => id !== user._id)
          : [...prev.likes, user._id];
          
        return { ...prev, likes: updatedLikes };
      });
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentInput.trim() || !user) {
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/${postId}/comment`,
        { content: commentInput },
        { withCredentials: true }
      );
      
      // Add new comment to the post
      const newComment = response.data.comment;
      setPost(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: [...prev.comments, newComment]
        };
      });
      
      setCommentInput('');
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner || !window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(
        `${API_BASE_URL}/api/posts/${postId}`,
        { withCredentials: true }
      );
      
      navigate('/profile');
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleEdit = () => {
    navigate(`/upload/${postId}`);
  };

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentInput(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Eye className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || 'Post not found'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const isLiked = user && post.likes.includes(user._id);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-1 w-full max-w-3xl mx-auto flex flex-col items-center px-2 md:px-0">
        {/* Profile Header */}
        <div className="w-full mt-10 mb-6">
          <PostHeader
            user={post.user}
            createdAt={post.createdAt}
            isOwner={false} // Remove edit/delete from header
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-6 leading-tight w-full">{post.title}</h1>

        {/* Post Images */}
        <div className="w-full flex flex-col items-center mb-6">
          <div className="rounded-xl overflow-hidden w-full max-h-[500px] flex justify-center">
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
          {post.images.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 w-full">
              {post.images.slice(1).map((img, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`${post.title} ${index + 2}`}
                    className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="w-full mb-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-center text-lg">{post.description}</p>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="w-full flex justify-center mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-100 hover:bg-gray-200 transition-colors">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Centered Menu (Edit/Delete) */}
        {isOwner && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl px-6 py-2 flex gap-8 items-center">
              <button
                onClick={handleEdit}
                className="text-black text-base font-medium hover:underline focus:outline-none"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-black text-base font-medium hover:underline focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Interaction Bar (Likes, Comments, Views) */}
        <div className="w-full flex justify-center mb-8">
          <div className="flex items-center space-x-8">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 text-lg font-medium transition-all duration-200 ${
                isLiked
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 transition-all duration-200 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes.length}</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-600">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments.length}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <section className="w-full max-w-2xl mx-auto mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Comments ({post.comments.length})
            </h3>
          </div>

          {/* Comment Form */}
          {user ? (
            <CommentForm
              user={user}
              commentInput={commentInput}
              submitting={submitting}
              onCommentInputChange={handleCommentInputChange}
              onSubmit={handleComment}
            />
          ) : (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 rounded-xl p-6 text-center">
              <p className="text-gray-700">
                <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Sign in
                </a>
                {' '}to join the conversation
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <Comment
                  key={comment._id}
                  id={comment._id}
                  user={comment.user}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  isLast={index === post.comments.length - 1}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No comments yet</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Post;