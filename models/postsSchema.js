const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Posts", postSchema);
