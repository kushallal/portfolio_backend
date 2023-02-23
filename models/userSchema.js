const { Schema, model } = require("mongoose");

const usersSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
  },
  { timestamps: true }
);

module.exports = model("Users", usersSchema);
