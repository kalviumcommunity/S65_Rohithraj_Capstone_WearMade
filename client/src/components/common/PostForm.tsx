import React, { useRef, useState } from 'react';
import PostCard from './PostCard';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Block {
  id: string;
  type: 'paragraph' | 'image';
  content: string;
}

const dummyAuthor = {
  name: 'You',
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=You',
};

const PostForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<File | null>(null);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      imageFileRef.current = file;
      setImageUrl(URL.createObjectURL(file));
      setStep(2);
    }
  };

  // Drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      imageFileRef.current = file;
      setImageUrl(URL.createObjectURL(file));
      setStep(2);
    }
  };
    // Function to publish post using API
  const publishPost = async () => {
    if (!title.trim() || !imageUrl || tags.length === 0 || !imageFileRef.current) {
      setPublishError('Please fill all required fields');
      return;
    }
    
    try {
      setIsPublishing(true);
      setPublishError(null);
      
      // Create form data for multipart/form-data request
      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', imageFileRef.current);
      formData.append('tags', JSON.stringify(tags));
      
      // Add content blocks including description
      formData.append('content', JSON.stringify(blocks.map(block => ({
        type: block.type,
        content: block.content,
      }))));
      
      // Add description separately if exists (for backward compatibility)
      if (blocks.length > 0 && blocks[0]?.type === 'paragraph') {
        formData.append('description', blocks[0].content);
      }
      
      // Make API request with credentials
      const response = await axios.post(
        `${API_BASE_URL}/api/posts`, 
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }      );
      
      console.log('Post published successfully:', response.data);
      
      // On successful response, redirect to the post or profile
      if (response.data && response.data.post && response.data.post._id) {
        navigate(`/posts/${response.data.post._id}`); // Navigate to the post using post._id
      } else {
        navigate('/profile'); // Otherwise go to profile page
      }
    } catch (error: unknown) {
      console.error('Error publishing post:', error);
      setPublishError('Failed to publish post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Update block content
  const handleBlockChange = (id: string, value: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: value } : b));
  };

  // Remove block
  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  // Tag input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim() && tags.length < 20) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  // Step 1: Upload
  if (step === 1) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">        <div className="flex w-full justify-between max-w-5xl mx-auto mb-8">
          <button 
            className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            onClick={() => navigate(-1)} // Go back to previous page
          >
            Cancel
          </button>
          <div>
            <button className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors" disabled>Continue</button>
          </div>
        </div>
        <div
          className="border-2 border-dashed border-gray-200 rounded-2xl w-full max-w-3xl flex flex-col items-center justify-center py-24 cursor-pointer bg-white mx-auto"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <img src="https://cdn-icons-png.flaticon.com/512/1829/1829586.png" alt="upload" className="w-16 h-16 mb-4 opacity-70" />
          <p className="text-lg font-medium mb-2">Drag and drop an image, or <span className="text-pink-600 underline">Browse</span></p>
          <p className="text-gray-500 text-sm mb-4">Minimum 1600px width recommended. Max 10MB each (20MB for videos)</p>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>High resolution images (png, jpg, gif)</li>
            <li>Animated gifs</li>
            <li>Videos (mp4)</li>
            <li>Only upload media you own the rights to</li>
          </ul>
        </div>
      </div>
    );
  }
  // Step 2: Add name and blocks
  if (step === 2 && imageUrl) {
    const canContinue = title.trim().length > 0;
    
    return (      <div className="min-h-[70vh] flex flex-col items-center justify-center">        <div className="flex w-full justify-between max-w-5xl mx-auto mb-8">
          <Button 
            className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            onClick={() => navigate(-1)} // Go back to previous page
          >
            Cancel
          </Button>
          <div>
            <Button 
              className={`px-6 py-2.5 rounded-full ${canContinue ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'} text-white font-medium transition-colors`} 
              onClick={() => canContinue && setShowModal(true)}
            >
              Continue
            </Button>
          </div>
        </div>
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-8 flex flex-col items-center">          <div className="w-full relative mb-6">
            <input
              type="text"
              placeholder="Give me a name"
              className={`text-2xl font-semibold text-center w-full border-none outline-none bg-transparent ${!title.trim() ? 'text-gray-400' : ''}`}
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
            />
            {!title.trim() && (
              <div className="text-center text-red-400 text-xs mt-1">Title is required to continue</div>
            )}
          </div>
          <img src={imageUrl} alt="preview" className="rounded-2xl max-w-2xl w-full mb-6 bg-[#f7f3e6]" />
          {/* Blocks */}
          <div className="w-full max-w-3xl">
            {blocks.slice(1).map((block) => (
              <div key={block.id} className="mb-4 flex items-start gap-2 relative">
                <ImageUploadBlock
                  value={block.content}
                  onChange={val => handleBlockChange(block.id, val)}
                />
                <button onClick={() => handleRemoveBlock(block.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl bg-white/80 rounded-full p-1">&times;</button>
              </div>
            ))}
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 font-medium ml-3 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-200"
                onClick={() => {
                  // Always ensure a description block exists
                  let newBlocks = blocks;
                  if (blocks.length === 0 || blocks[0].type !== 'paragraph') {
                    const descId = Date.now().toString() + Math.random();
                    newBlocks = [{ id: descId, type: 'paragraph', content: '' }, ...blocks];
                  }
                  // Prevent adding if last image block is empty
                  if (
                    newBlocks.length > 1 &&
                    newBlocks[newBlocks.length - 1].type === 'image' &&
                    !newBlocks[newBlocks.length - 1].content.trim()
                  ) return;
                  // Insert image block at the end (after all images)
                  const id = Date.now().toString() + Math.random();
                  const newBlock: Block = { id, type: 'image', content: '' };
                  setBlocks([
                    ...newBlocks,
                    newBlock,
                  ]);
                }}
              >
                + Insert Image
              </Button>
            </div>
          </div>
          {/* Description below images */}
          <input
            type="text"
            placeholder="Add a description..."
            className="text-lg text-center mt-8 mb-6 border-none outline-none bg-transparent font-normal"
            value={blocks[0]?.content || ''}
            onChange={e => handleBlockChange(blocks[0]?.id, e.target.value)}
            maxLength={200}
          />
        </div>        {/* Modal for tags and preview */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 relative overflow-hidden">              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 w-8 h-8 flex items-center justify-center transition-colors" 
                onClick={() => setShowModal(false)}
              >
                <span className="text-xl leading-none pb-0.5">×</span>
              </button>
              
              <h2 className="text-2xl font-bold mb-8">Final Touches</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side - PostCard preview */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Preview</h3>
                  <div className="mb-2">
                    <PostCard post={{
                      id: 'preview',
                      title: title || 'Untitled',
                      imageUrl: imageUrl,
                      author: dummyAuthor,
                      likes: 54,
                      views: 1029,
                      isLiked: false,
                      isBookmarked: false,
                    }} />
                  </div>
                </div>
                
                {/* Right side - Tags */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Tags (maximum 20)</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {tag}
                        <button 
                          type="button" 
                          className="ml-1 text-gray-400 hover:text-red-500" 
                          onClick={() => handleRemoveTag(tag)}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    {tags.length === 0 && (
                      <span className="text-gray-400 text-sm">No tags added yet</span>
                    )}
                  </div>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg p-3 mb-2"
                    placeholder="Add tags..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    maxLength={30}
                    disabled={tags.length >= 20}
                  />
                  <div className="text-xs text-gray-500 mb-4">
                    Suggested: design, illustration, ui, branding, logo, graphic design, vector, ux, typography, app
                  </div>
                </div>
              </div>                <div className="flex gap-3 justify-end mt-8 border-t pt-6">
                <button 
                  className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors" 
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                {tags.length === 0 && (
                  <div className="mr-2 flex items-center text-amber-500 text-sm">
                    <span>Add at least one tag</span>
                  </div>
                )}                {publishError && (
                  <div className="mr-2 flex items-center text-red-500 text-sm">
                    <span>{publishError}</span>
                  </div>
                )}
                <button 
                  className={`px-6 py-2.5 rounded-full ${title.trim() && imageUrl && tags.length > 0 ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'} text-white font-medium transition-colors`}
                  disabled={!title.trim() || !imageUrl || tags.length === 0 || isPublishing}
                  onClick={publishPost}
                >
                  {isPublishing ? 'Publishing...' : 'Publish now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

// ImageUploadBlock component for image block drag/drop/upload
const ImageUploadBlock: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onChange(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative">
          <img src={value} alt="block" className="rounded-lg w-full object-cover mb-2 max-h-72" />
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-200 rounded-2xl w-full flex flex-col items-center justify-center py-12 cursor-pointer bg-white"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <img src="https://cdn-icons-png.flaticon.com/512/1829/1829586.png" alt="upload" className="w-10 h-10 mb-2 opacity-70" />
          <p className="text-base font-medium mb-1">Drag and drop an image, or <span className="text-pink-600 underline">Browse</span></p>
          <p className="text-gray-400 text-xs">Minimum 1600px width recommended. Max 10MB each</p>
        </div>
      )}
    </div>
  );
};

export default PostForm;
