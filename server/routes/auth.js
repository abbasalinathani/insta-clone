const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const requireLogin = require('../middleware/requireLogin');

router.post('/signup', (req, res) => {
  const {name, email, password} = req.body;
  if(!email || !password || !name) {
    return res.status(422).json({error: "Please add all the fields"});
  }
  User.findOne({email: email})
    .then(user => {
      if(user) {
        return res.status(422).json({error: "Email already exists"});
      }
      bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            name,
            email,
            password: hashedPassword
          });
          newUser.save()
            .then(savedUser => {
              res.json({message: "Signup successful!"});
            })
            .catch(err => {
              console.log(err);
            })
        })
    }).catch(err => console.log(err));
});

router.post('/signin', (req, res) => {
  const {email, password} = req.body;
  if(!email || !password) {
    return res.status(422).json({error: "Please fill all the fields"});
  }
  User.findOne({email: email})
    .then(user => {
      if(!user) {
        return res.status(422).json({err: "Invalid email or password"});
      }
      bcrypt.compare(password, user.password)
        .then(matched => {
          if(matched) {
            const token = jwt.sign({_id: user._id}, JWT_SECRET);
            const {_id, name, email} = user;
            res.json({token, user: {_id, name, email}});
          } else {
            res.status(433).json({error: "Invalid email or password"});
          }
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

module.exports = router;