const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const Post = require("../models/postsSchema");

//multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./PostImages");
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});
const image = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    req.isValid = true;
    if (
      extension !== ".png" &&
      extension !== ".jpg" &&
      extension !== ".gif" &&
      extension !== ".jpeg"
    ) {
      req.isValid = false;
      cb(null, false);
    }
    cb(null, true);
  },
}).single("image");

//routes
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).send(posts);
  } catch (err) {
    res.send(err);
  }
});

router.post("/", image, async (req, res) => {
  try {
    if (req.file && req.isValid) {
      const post = new Post(req.body);
      const imageURL =
        req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
      post.image = imageURL;
      await post.save();
      res.send(post);
    } else {
      throw "file not inserted or invalid file extension";
    }
  } catch (err) {
    res.status(400).send(err);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
});

router.delete("/:id", async (req, res) => {
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
