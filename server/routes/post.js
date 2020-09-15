const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model('Post');

router.post('/createPost', requireLogin, (req, res) => {
  const {title, body} = req.body;
  
  if(!title || !body) {
    return res.status(422).json({error: "Please add all the fields"});
  }

  const newPost = new Post({
    title,
    body,
    postedBy: req.user._id
  });
  req.user.password = undefined;
  newPost.save()
    .then(savedPost => {
      res.json({post: savedPost});
    }).catch(err => console.log(err));
});

router.get('/allPosts', requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name email")
    .then(posts => {
      res.json({posts})
    }).catch(err => console.log(err));
});

router.get('/myPosts', requireLogin, (req, res) => {
  Post.find({postedBy: req.user._id})
    .populate("postedBy", "_id name email")
    .then(posts => {
      res.json({posts})
    }).catch(err => console.log(err));
});

module.exports = router;