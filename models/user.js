const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    fullname: String,
    username: { type: String, unique: true },
    todo_count: { type: Number, default: 0 },
    completed_count: { type: Number, default: 0 },
    todos: [
      {
        title: String,
        _id: String,
      },
    ],
  },
  { collection: "users" }
);

const model = mongoose.model("User", userSchema);
module.exports = model;
