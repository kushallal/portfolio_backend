const express = require("express");
const router = express.Router();
const Post = require("../models/postsSchema");

router.get("/", async (req, res) => {
  const posts = await Post.find();
  res.status(200).send(posts);
});

router.post("/", async (req, res) => {
  console.log(JSON.stringify(req.body));
  // const post = new Post(req.body);
  // try {
  //   await post.save();
  //   res.send(post);
  // } catch (err) {
  //   res.status(500);
  // }
});

module.exports = router;
