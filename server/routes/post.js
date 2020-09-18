const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model('Post');

router.post('/createPost', requireLogin, (req, res) => {
  const {title, body, pic} = req.body;
  
  if(!title || !body || !pic) {
    return res.status(422).json({error: "Please add all the fields"});
  }

  const newPost = new Post({
    title,
    body,
    postedBy: req.user._id,
    photo: pic
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
    .populate("comments.postedBy", "_id name email")
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

router.put('/likePost', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $push: {likes: req.user._id}
  }, {new: true, useFindAndModify: false})
  .exec((err, result) => {
    if(err) {
      return res.status(422).json({error: err})
    } else {
      res.json(result);
    }
  })
});

router.put('/unlikePost', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $pull: {likes: req.user._id}
  }, {new: true, useFindAndModify: false})
  .exec((err, result) => {
    if(err) {
      return res.status(422).json({error: err})
    } else {
      res.json(result);
    }
  })
});

router.put('/comment', requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id
  };

  // res.send(comment)

  Post.findByIdAndUpdate(req.body.postId, {
    $push: {comments: comment}
  }, {new: true, useFindAndModify: false})
  .populate("comments.postedBy", "_id name email")
  .exec((err, result) => {
    if(err) {
      return res.status(422).json({error: err})
    } else {
      res.json(result);
    }
  })
});

module.exports = router;