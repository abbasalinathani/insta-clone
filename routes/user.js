const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model('Post');
const User = mongoose.model('User');

router.get('/user/:id', requireLogin, (req, res) => {
  User.findOne({_id: req.params.id})
  .select("-password")
  .then(user => {
    Post.find({postedBy: req.params.id})
    .populate("postedBy", "_id name email")
    .exec((err, posts) => {
      if(err) {
        return res.status(422).json({error: err});
      }
      res.json({user, posts});
    });
  }).catch(err => {
    return res.status(404).json({error: "User not found"});
  })
});

router.put('/follow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.body.followId, {
    $push: {followers: req.user._id}
  }, {new: true, useFindAndModify: false})
  .then(result => {
    User.findByIdAndUpdate(req.user._id, {
      $push: {following: req.body.followId}
    }, {new: true, useFindAndModify: false})
    .select("-password")
    .then(result => {
      res.json(result)
    })
  }).catch(err => {
    return res.status(422).json({error: "Could not follow"});
  });
});

router.put('/unfollow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowId, {
    $pull: {followers: req.user._id}
  }, {new: true, useFindAndModify: false})
  .then(result => {
    User.findByIdAndUpdate(req.user._id, {
      $pull: {following: req.body.unfollowId}
    }, {new: true, useFindAndModify: false})
    .select("-password")
    .then(result => {
      res.json(result)
    })
  }).catch(err => {
    return res.status(422).json({error: "Could not follow"});
  });
});

router.put('/updatePic', requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    $set: {pic: req.body.pic}
  }, {new: true, useFindAndModify: false})
  .select("-password")
  .then(result => {
    res.json(result);
  }).catch(err => {
    return res.status(422).json({error: "Cannot update pic"});
  });
});

router.post('/searchUsers', requireLogin, (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({
    $or: [{name: {$regex: userPattern}}, {email: {$regex: userPattern}} ]
  })
  .select("_id name email")
  .then(users => {
    res.json({users});
  }).catch(err => console.log(err));
});

module.exports = router;