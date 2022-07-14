const express = require("express");
const Todo = require("../models/todo");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// enpoint to make a todo
router.post("/create_todo", async (req, res) => {
  const { title, task, owner_id, token, owner_name, deadline, category } =
    req.body;

  if (!title || !task || !owner_id || !token) {
    return res
      .status(400)
      .send({ status: "error", msg: "All fields must be filled" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const timestamp = Date.now();

    let todo = new Todo();

    todo.title = title;
    todo.task = task;
    todo.owner_name = owner_name;
    todo.owner_id = owner_id;
    todo.deadline = deadline;
    todo.category = category;
    todo.timestamp = timestamp;

    todo = await todo.save();
    const data = { title: todo.title, _id: todo._id };
    const user = await User.findOneAndUpdate(
      { _id: owner_id },
      {
        $inc: { todo_count: 1 },
        $push: { todos: data },
      },
      { new: true }
    ).lean();

    return res.status(200).send({ status: "ok", msg: "Success", todo });
  } catch (e) {
    console.log(e);
    return res.status({ status: "error", msg: "An error occured" });
  }
});

// edit todo
router.post("/edit_todo", async (req, res) => {
  const { todo_id, token, newtask } = req.body;

  if (!token || !todo_id) {
    return res
      .status(400)
      .send({ status: "error", msg: "All fields should be filled" });
  }

  const edited_at = Date.now();

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    const todo = await Todo.findOneAndUpdate(
      { _id: todo_id },
      {
        task: newtask,
        edited: true,
        edited_at: edited_at,
      },
      { new: true }
    ).lean();

    return res.status(200).send({ status: "ok", msg: "Success", todo });
  } catch (e) {
    console.log(e);
    return res.status({ status: "error", msg: "An error occured" });
  }
});

// completed todo
router.post("/completed_todo", async (req, res) => {
  const { todo_id, token, owner_id } = req.body;

  if (!token || !todo_id || !owner_id) {
    return res
      .status(400)
      .send({ status: "error", msg: "All fields should be filled" });
  }

  const completed_at = Date.now();

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    const todo = await Todo.findOneAndUpdate(
      { _id: todo_id },
      {
        completed: true,
        completed_at: completed_at,
      },
      { new: true }
    ).lean();

    const user = await User.findOneAndUpdate(
      { _id: owner_id },
      {
        $inc: { completed_count: 1 },
      },
      { new: true }
    ).lean();

    return res.status(200).send({ status: "ok", msg: "Success", todo });
  } catch (e) {
    console.log(e);
    return res.status({ status: "error", msg: "An error occured" });
  }
});

// delete todo
router.post("/delete_todo", async (req, res) => {
  const { token, todo_id, owner_id } = req.body;

  if (!token || !todo_id || !owner_id) {
    return res
      .status(400)
      .send({ status: "error", msg: "All fields should be filled" });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const todo = await Todo.deleteOne({ _id: todo_id });

    const user = await User.findOneAndUpdate(
      { _id: owner_id },
      {
        $inc: { todo_count: -1 },
      },
      { new: true }
    ).lean();

    return res
      .status(200)
      .send({ status: "ok", msg: "delete successful", todo });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: "error", msg: "Some error occured" });
  }
});

module.exports = router;
