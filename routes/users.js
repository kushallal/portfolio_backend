require("dotenv").config();
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("../models/userSchema");
const { getAccessToken, getRefreshToken } = require("../helpers/authHelper");

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const isExisting = await Users.findOne({ username: username });
    if (isExisting) {
      return res.status(400).send("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Users({ username: username, password: hashedPassword });
    await user.save();
    const accessToken = getAccessToken(user.username, user._id);
    const refreshToken = getRefreshToken(user.username);
    res.cookie("access_token", accessToken);
    res.cookie("refresh_token", refreshToken);
    res.send("User Registered");
  } catch (err) {
    res.send(err);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const isExisting = await Users.findOne({ username: username });
    if (!isExisting) {
      return res.status(400).send("User doesn't exists");
    }
    const passwordValidate = await bcrypt.compare(
      password,
      isExisting.password
    );
    if (!passwordValidate) {
      return res.status(401).send("Incorrect Password");
    }
    const accessToken = getAccessToken(isExisting.username, isExisting._id);
    const refreshToken = getRefreshToken(isExisting.username);

    res.cookie("access_token", accessToken);
    res.cookie("refresh_token", refreshToken, {
      maxAge: 12 * 60 * 60 * 1000,
    });
    res.send("User Login");
  } catch (err) {
    res.send(err);
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const isVerified = jwt.verify(
      req.cookies.refresh_token,
      process.env.REFRESH_SECRET_KEY
    );
    const user = await Users.findOne({ username: isVerified.username });

    if (!user) {
      return res.send("invalid user");
    }

    const accessToken = getAccessToken(user.username, user._id);
    res.cookie("access_token", accessToken);
    res.send("New Access Token Assigned");
  } catch (err) {
    res.send(err);
  }
});
module.exports = router;
