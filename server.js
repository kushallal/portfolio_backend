const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const morgan = require("morgan");
const path = require("path");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const postsRouter = require("./routes/posts");

//accept json data
app.use(express.json());

//connect mongodb
const options = {
  dbName: "Portfolio",
};

mongoose
  .connect(process.env.DB_URI, options)
  .then(() => console.log("Connected to database Portfolio"))
  .catch((err) => {
    console.log("Couldnt connect to db \n", err);
  });
mongoose.set("strictQuery", true);

//logger
app.use(morgan("combined"));

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
const image = multer({ storage: storage });

app.use("/posts", image.single("image"), postsRouter);

app.get("/", (req, res) => {
  res.json({ test: "test message" });
});

app.listen(PORT, () => {
  console.log("server is running ...");
});
