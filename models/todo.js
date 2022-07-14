const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    task: { type: String, required: true },
    deadline: Number,
    category: String,
    timestamp: Number,
    edited: { type: Boolean, default: false },
    edited_at: Number,
    owner_id: String, // get user data based on owner_id
    owner_name: String,
    completed: { type: Boolean, default: false },
    completed_at: Number,
  },
  { collection: "todo" }
);

const model = mongoose.model("Todo", todoSchema);
module.exports = model;
