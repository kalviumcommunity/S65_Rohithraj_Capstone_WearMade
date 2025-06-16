const Post = require('../models/postModel');
const User = require('../models/userModel');
const { uploader } = require('cloudinary').v2;

// Helper to extract Cloudinary public_id from URL
function getCloudinaryPublicId(url) {
  // Example: https://res.cloudinary.com/<cloud>/image/upload/v123/wearmade/posts/filename.jpg
  // Returns: wearmade/posts/filename (without extension)
  const parts = url.split('/');
  const uploadIndex = parts.findIndex(part => part === 'upload');
  if (uploadIndex === -1) return null;
  const publicIdWithExt = parts.slice(uploadIndex + 1).join('/');
  return publicIdWithExt.replace(/\.[^/.]+$/, '');
}

// Add a new post with multer and cloudinary
const addPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    let tags = req.body.tags;
    let content = req.body.content;
    
    // Parse JSON strings if needed
    try {
      if (tags && typeof tags === 'string') {
        tags = JSON.parse(tags);
      }
      if (content && typeof content === 'string') {
        content = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Error parsing JSON data:', parseError);
      // Continue with original values if parsing fails
    }
    
    // Get image from uploaded file
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path || file.secure_url || file.url);
    }
    
    // Validation for required fields
    if (!images || images.length === 0) {
      return res.status(400).json({ message: 'Image is required' });
    }
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!tags || (Array.isArray(tags) ? tags.length === 0 : !tags.trim())) {
      return res.status(400).json({ message: 'Tags are required' });
    }
    
    const userId = req.user.id;
    
    // Create post
    const post = await Post.create({
      user: userId,
      title,
      images,
      description: description || (content && content.length > 0 && content[0].type === 'paragraph' ? content[0].content : ''),
      tags: Array.isArray(tags) ? tags : tags.split(','),
      likes: [],
      comments: [],
      views: 0,
    });
    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a post (only by the owner, only new images are uploaded)
const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, description, tags, existingImages } = req.body;
    const userId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to edit this post' });
    }
    let images = [];
    if (Array.isArray(existingImages)) {
      images = existingImages;
    } else if (typeof existingImages === 'string' && existingImages.length > 0) {
      images = [existingImages];
    }
    if (req.files && req.files.length > 0) {
      images = images.concat(req.files.map(file => file.path || file.secure_url || file.url));
    }
    const removedImages = post.images.filter(img => !images.includes(img));
    for (const imgUrl of removedImages) {
      const publicId = getCloudinaryPublicId(imgUrl);
      if (publicId) await uploader.destroy(publicId);
    }
    post.title = title;
    post.images = images;
    post.description = description;
    post.tags = Array.isArray(tags) ? tags : tags.split(',');
    await post.save();
    res.json({ message: 'Post updated', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post (only by the owner)
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }
    for (const imgUrl of post.images) {
      const publicId = getCloudinaryPublicId(imgUrl);
      if (publicId) {
        try {
          await uploader.destroy(publicId, { invalidate: true });
        } catch (err) {
          console.error('Cloudinary deletion error:', err.message);
        }
      }
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ message: 'Like status updated', likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Comment on a post
const commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = { user: userId, content: content.trim(), createdAt: new Date() };
    post.comments.push(comment);
    await post.save();
    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a post by ID and add user to views if not already viewed
const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user ? req.user.id : null;
    const post = await Post.findById(postId)
      .populate('user')
      .populate('comments.user');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (userId && post.viewsList && Array.isArray(post.viewsList)) {
      if (!post.viewsList.includes(userId)) {
        post.viewsList.push(userId);
        post.views = post.viewsList.length;
        await post.save();
      }
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts by a specific user
const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username name')
      .populate('comments.user', 'username name');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get posts for explore page (popular, recent, extra)
const getExplorePosts = async (req, res) => {
  try {
    const { type } = req.query;
    let sortStage = {};
    if (type === 'popular') {
      // Sort by number of likes (descending), then views (descending)
      sortStage = { likesCount: -1, views: -1 };
    } else if (type === 'recent') {
      // Sort by creation date (descending)
      sortStage = { createdAt: -1 };
    } else if (type === 'extra') {
      // Sort by number of comments (descending)
      sortStage = { commentsCount: -1 };
    } else {
      sortStage = { createdAt: -1 };
    }

    // Use aggregation for efficient sorting on array lengths
    const pipeline = [
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ['$likes', []] } },
          commentsCount: { $size: { $ifNull: ['$comments', []] } },
        },
      },
      { $sort: sortStage },
    ];

    const posts = await Post.aggregate(pipeline);
    // Populate user and comments.user fields manually after aggregation
    const populatedPosts = await Post.populate(posts, [
      { path: 'user', select: 'username name' },
      { path: 'comments.user', select: 'username name' },
    ]);
    res.json(populatedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPost,
  editPost,
  deletePost,
  likePost,
  commentOnPost,
  getPost,
  getPostsByUser,
  getExplorePosts,
};
