const Post = require('../models/Post');
const { createUniqueSlug } = require('../utils/slugify');

// @desc    Create a new post
// @route   POST /api/posts/create
// @access  Public (should be protected in production)
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Generate unique slug - pass the Post model as parameter
    const slug = await createUniqueSlug(title, Post);

    // Create new post
    const post = new Post({
      title,
      content,
      slug
    });

    const savedPost = await post.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: savedPost
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating post',
      error: error.message
    });
  }
};

// @desc    Get a single post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        title: post.title,
        content: post.content,
        slug: post.slug,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching post',
      error: error.message
    });
  }
};

// @desc    Update a post by slug
// @route   PUT /api/posts/:slug
// @access  Public (should be protected in production)
const updatePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content } = req.body;

    // Find the existing post
    const existingPost = await Post.findOne({ slug });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Prepare update data
    const updateData = {
      updatedAt: Date.now()
    };

    if (title) {
      updateData.title = title;
      // Generate new slug if title changed
      if (title !== existingPost.title) {
        updateData.slug = await createUniqueSlug(title, Post, existingPost._id);
      }
    }

    if (content) {
      updateData.content = content;
    }

    // Update the post
    const updatedPost = await Post.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating post',
      error: error.message
    });
  }
};

// @desc    Delete a post by slug
// @route   DELETE /api/posts/:slug
// @access  Public (should be protected in production)
const deletePost = async (req, res) => {
  try {
    const { slug } = req.params;

    const deletedPost = await Post.findOneAndDelete({ slug });

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: {
        deletedPost: {
          id: deletedPost._id,
          title: deletedPost.title,
          slug: deletedPost.slug
        }
      }
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting post',
      error: error.message
    });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).select('title slug content createdAt updatedAt');

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });

  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching posts',
      error: error.message
    });
  }
};

module.exports = {
  createPost,
  getPostBySlug,
  updatePost,
  deletePost,
  getAllPosts
};
