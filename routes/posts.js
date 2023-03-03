const express = require("express");
const fs = require("fs");
const { verifyToken } = require("../helpers/authHelper");
const singleImage = require("../helpers/multerHelper");

const router = express.Router();
const Post = require("../models/postsSchema");

//routes
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).send(posts);
  } catch (err) {
    res.send(err);
  }
});

router.post("/", verifyToken, singleImage, async (req, res) => {
  try {
    if (!req.file) {
      throw "file not inserted or non-image file ";
    }
    const post = new Post(req.body);
    const imageURL =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
    post.image = imageURL;
    await post.save();
    res.send(post);
  } catch (err) {
    res.status(400).send(err);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
});

router.put("/:id", verifyToken, singleImage, async (req, res) => {
  try {
    console.log(req.file);
    const prevPost = await Post.findById(req.params.id);
    if (!req.file) {
      throw "file not inserted or or non-image file";
    }
    const updatedPost = req.body;
    if (!req.body.title || !req.body.description) {
      throw "post params not enough";
    }
    const imageURL =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
    updatedPost.image = imageURL;
    const update = await Post.findByIdAndUpdate(req.params.id, updatedPost);

    const prevImagePath = "PostImages/" + prevPost.image.split("/")[4];
    fs.unlinkSync(prevImagePath);

    res.send(update);
  } catch (err) {
    res.send(err);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleteData = await Post.findByIdAndDelete(req.params.id);
    const image = "PostImages/" + deleteData.image.split("/")[4];
    fs.unlinkSync(image);
    res.send(deleteData);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
