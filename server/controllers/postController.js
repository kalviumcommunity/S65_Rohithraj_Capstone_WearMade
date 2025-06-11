const Post = require('../models/postModel');
const User = require('../models/userModel');

// Add a new post
const addPost = async (req, res) => {
  try {
    const { images, description, tags } = req.body;
    const userId = req.user.id;
    const post = await Post.create({
      user: userId,
      images,
      description,
      tags,
      likes: [],
      comments: [],
      views: 0,
    });
    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a post (only by the owner)
const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { images, description, tags } = req.body;
    const userId = req.user.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to edit this post' });
    }
    post.images = images;
    post.description = description;
    post.tags = tags;
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
      // Unlike if already liked
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
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = { user: userId, content, createdAt: new Date() };
    post.comments.push(comment);
    await post.save();
    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a view (increment views count)
const addView = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.views += 1;
    await post.save();
    res.json({ message: 'View recorded', views: post.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a post by ID
const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate('user', 'username name')
      .populate('comments.user', 'username name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
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
    const { type } = req.query; // type can be 'popular', 'recent', 'extra'
    let sortOption = {};
    if (type === 'popular') {
      sortOption = { likes: -1, views: -1 };
    } else if (type === 'recent') {
      sortOption = { createdAt: -1 };
    } else if (type === 'extra') {
      sortOption = { comments: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }
    const posts = await Post.find()
      .sort(sortOption)
      .populate('user', 'username name')
      .populate('comments.user', 'username name');
    res.json(posts);
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
  addView,
  getPost,
  getPostsByUser,
  getExplorePosts,
};
