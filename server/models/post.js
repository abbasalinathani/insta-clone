const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    require: true
  },
  photo: {
    type: String,
    default: "no photo"
  },
  postedBy: {
    type: ObjectId,
    ref: "User"
  }
}, {timestamps: true});

mongoose.model("Post", postSchema);