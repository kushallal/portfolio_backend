const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");

//cors config
app.use(cors({ origin: "*" }));

//accept json data
app.use(express.json());

//serve images
app.use("/images", express.static("PostImages"));

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
app.use(morgan("dev"));

app.use("/api/user", usersRouter);
app.use("/api/posts", postsRouter);

app.get("/", (req, res) => {
  res.json({ test: "test message" });
});

app.listen(PORT, () => {
  console.log("server is running ...");
});
