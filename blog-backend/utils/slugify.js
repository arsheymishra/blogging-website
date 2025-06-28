const mongoose = require('mongoose');

const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const createUniqueSlug = async (title, PostModel, excludeId = null) => {
  let baseSlug = createSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existingPost = await PostModel.findOne(query);
    
    if (!existingPost) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

module.exports = {
  createSlug,
  createUniqueSlug
};
