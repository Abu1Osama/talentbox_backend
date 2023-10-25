const express = require('express');
const router = express.Router();
const User = require('../Models/user.model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();
router.post("/register", async (req, res) => {
  const { name, email, password} = req.body;
  try {
    const emailcheck = await User.findOne({ email });
    if (emailcheck) {
      res.status(400).send({ msg: "Email id already used" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        const user = new User({
          name,
          email,
          password: hash,
        });
        await user.save();
        res.status(200).send({ msg: "User registered successfully" });
      });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            const token = jwt.sign({ userId: user._id }, process.env.secret_code); 
            res.status(200).json({
              msg: "User logged in successfully",
      
              token: token,
            });
          } else {
            res.status(400).json({ msg: "Wrong credentials" });
          }
        });
      } else {
        res.status(400).json({ msg: "No user exists" });
      }
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  });

  router.post("/logout", (req, res) => {
   
    res.status(200).json({ msg: "User logged out successfully" });
  });



module.exports = router;
