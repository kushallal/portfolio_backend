const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  try {
    const isVerified = jwt.verify(
      req.cookies.access_token,
      process.env.ACCESS_SECRET_KEY
    );
    if (!isVerified) {
      throw new Error("Unauthorized");
    }
    next();
  } catch (err) {
    res.status(401).send(err);
  }
};

const getAccessToken = (username, id) => {
  return jwt.sign(
    { username: username, id: id },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: "20min",
    }
  );
};

const getRefreshToken = (username) => {
  return jwt.sign({ username: username }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "12h",
  });
};

module.exports = { verifyToken, getAccessToken, getRefreshToken };
