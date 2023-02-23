require("dotenv").config();
const { Router } = require("express");
const Users = require("../models/userSchema");
const { hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const isExisting = await Users.findOne({ username: username });
    if (isExisting) {
      return res.status(400).send("User already exists");
    }
    const hashedPassword = await hash(password, 10);
    const user = new Users({ username: username, password: hashedPassword });
    await user.save();
    console.log(user);
    const token = jwt.sign(
      { email: user.username, id: user._id },
      process.env.SECRET_KEY
    );

    res.send(token);
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
    const passwordValidate = await compare(password, isExisting.password);
    if (!passwordValidate) {
      return res.status(401).send("Incorrect Password");
    }
    const token = jwt.sign(
      { email: isExisting.username, id: isExisting._id },
      process.env.SECRET_KEY
    );
    res.send(token);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
