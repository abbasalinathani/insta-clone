const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, EMAIL, SENDGRID_API } = require('../config/keys');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: SENDGRID_API
  }
}));

router.post('/signup', (req, res) => {
  const {name, email, password, pic} = req.body;
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
            password: hashedPassword,
            pic
          });
          newUser.save()
            .then(savedUser => {
              transporter.sendMail({
                to: savedUser.email,
                from: "abbasalinathani@hotmail.com",
                subject: "Welcome to Insta",
                html: "<h1>Your account has been created!</h1><h4>You can now login with your email address.</h4>"
              })
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
        return res.status(422).json({error: "Invalid email or password"});
      }
      bcrypt.compare(password, user.password)
        .then(matched => {
          if(matched) {
            const token = jwt.sign({_id: user._id}, JWT_SECRET);
            const {_id, name, email, followers, following, pic} = user;
            res.json({token, user: {_id, name, email, followers, following, pic}});
          } else {
            res.status(433).json({error: "Invalid email or password"});
          }
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

router.post('/resetPassword', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      consolelog(err);
    }
    const token = buffer.toString("hex");
    User.findOne({email: req.body.email})
    .then(user => {
      if(!user) {
        return res.status(422).json({error: "Email does not exists!"})
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save()
      .then(result => {
        transporter.sendMail({
          to: user.email,
          from: "abbasalinathani@hotmail.com",
          subject: "Password reset",
          html: `
          <p>You have requested for a password reset</p>
          <h5>Click on this <a href="${EMAIL}/reset/${token}">link</a> to reset your password</h5>
          `
        })
        res.json({message: "Please check your email!"});
      });
    })
  });
});

router.post('/newPassword', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({
    resetToken: sentToken,
    expireToken: {$gt: Date.now()}
  })
  .then(user => {
    if(!user) {
      return res.status(422).json({error: "Try again, session expired"});
    }
    bcrypt.hash(newPassword, 12)
    .then(hashedPassword => {
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.expireToken = undefined;
      user.save()
      .then(savedUser => {
        res.json({message: "Password updated!"});
      })
    })
  }).catch(err => console.log(err));
});

module.exports = router;