const express = require("express");
const app = express();

app.get("/test", (req, res) => {
  res.json({ test: "test message" });
});

app.listen(3000, () => {
  console.log("server is running ...");
});
