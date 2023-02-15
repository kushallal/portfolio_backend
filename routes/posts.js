const express = require("express");
const router = express.Router();
const Post = require("../models/postsSchema");

router.get("/", async (req, res) => {
  const posts = await Post.find();
  res.status(200).send(posts);
});

router.post("/", async (req, res) => {
  const post = new Post(req.body);
  try {
    const imageURL =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;

    post.image = imageURL;
    await post.save();
    res.send(post);
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
