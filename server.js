const express = require("express");
const app = express();
const PORT = 3000;
app.get("/test", (req, res) => {
  res.json({ test: "test message" });
});

app.listen(PORT, () => {
  console.log("server is running ...");
});
