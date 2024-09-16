const mongoose = require('mongoose');

const CmsPageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
    unique: true, // Ensure each route is unique
  },
  lastEdited: {
    type: Date,
    default: Date.now,
  },
  dynamicContent: {
    type: Map,
    of: String, // Each key-value pair is a String
  },
});

module.exports = mongoose.model('CmsPage', CmsPageSchema);
