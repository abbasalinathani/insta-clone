const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  followers: [{
    type: ObjectId,
    ref: "User"
  }],
  following: [{
    type: ObjectId,
    ref: "User"
  }],
  pic: {
    type: String,
    default: "https://res.cloudinary.com/abbasali/image/upload/v1600589722/blank-profile-picture-973460_1280_1_vidqc1.png"
  }
}, {timestamps: true});

mongoose.model("User", userSchema);