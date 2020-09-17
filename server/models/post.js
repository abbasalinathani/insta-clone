const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  postedBy: {
    type: ObjectId,
    ref: "User"
  }
}, {timestamps: true});

mongoose.model("Post", postSchema);