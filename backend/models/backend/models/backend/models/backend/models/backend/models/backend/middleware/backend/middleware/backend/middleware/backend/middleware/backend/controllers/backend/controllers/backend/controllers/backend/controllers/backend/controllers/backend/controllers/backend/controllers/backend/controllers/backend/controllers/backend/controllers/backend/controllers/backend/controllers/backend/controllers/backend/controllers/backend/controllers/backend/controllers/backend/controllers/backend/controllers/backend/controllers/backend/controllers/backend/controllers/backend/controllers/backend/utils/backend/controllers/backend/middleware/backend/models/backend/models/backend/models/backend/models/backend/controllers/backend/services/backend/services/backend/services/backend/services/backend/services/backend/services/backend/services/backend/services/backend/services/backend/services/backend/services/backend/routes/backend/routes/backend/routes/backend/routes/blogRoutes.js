/**
 * Hybrid Scam Shield AI
 * Blog Routes
 *
 * Purpose:
 * - Handle educational blog posts
 * - Enable admins to create, edit, delete content
 * - Enable public/community to read posts
 */

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const BlogPost = require('../models/BlogPost');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { errorHandler } = require('../middleware/errorHandler');

/**
 * @route POST /api/blog
 * Create a new blog post (admin only)
 */
router.post('/', protect, authorizeRoles('admin'), asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  const blogPost = await BlogPost.create({
    title,
    content,
    tags,
    author: req.user._id
  });

  res.status(201).json(blogPost);
}));

/**
 * @route GET /api/blog
 * Get all blog posts (public)
 */
router.get('/', asyncHandler(async (req, res) => {
  const posts = await BlogPost.find({})
    .populate('author', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(posts);
}));

/**
 * @route GET /api/blog/:id
 * Get single blog post
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id)
    .populate('author', 'name');

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  res.status(200).json(post);
}));

/**
 * @route PATCH /api/blog/:id
 * Update blog post (admin only)
 */
router.patch('/:id', protect, authorizeRoles('admin'), asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  const { title, content, tags } = req.body;
  if (title) post.title = title;
  if (content) post.content = content;
  if (tags) post.tags = tags;

  const updatedPost = await post.save();
  res.status(200).json(updatedPost);
}));

/**
 * @route DELETE /api/blog/:id
 * Delete blog post (admin only)
 */
router.delete('/:id', protect, authorizeRoles('admin'), asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  await post.remove();
  res.status(200).json({ message: 'Blog post deleted' });
}));

// Error handler
router.use(errorHandler);

module.exports = router;
