const User = require("../models/User");
const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
        success: false,
        message: "All fields are required"
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
    name,
    email,
    password: hashedPassword,
    });

    res.json({
      success: true,
      user,
    });
    
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;