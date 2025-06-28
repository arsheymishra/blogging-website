const express = require('express');
const router = express.Router();
const {
  createPost,
  getPostBySlug,
  updatePost,
  deletePost,
  getAllPosts
} = require('../controllers/postController');

// @route   GET /api/posts
// @desc    Get all posts
router.get('/', getAllPosts);

// @route   POST /api/posts/create
// @desc    Create a new post
router.post('/create', createPost);

// @route   GET /api/posts/:slug
// @desc    Get a single post by slug
router.get('/:slug', getPostBySlug);

// @route   PUT /api/posts/:slug
// @desc    Update a post by slug
router.put('/:slug', updatePost);

// @route   DELETE /api/posts/:slug
// @desc    Delete a post by slug
router.delete('/:slug', deletePost);

module.exports = router;
