const express = require("express");
const router = express.Router();

let tasks = [];

// Get all tasks
router.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Add a new task
router.post("/tasks", (req, res) => {
  const { title } = req.body;
  const newTask = { id: tasks.length + 1, title };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
router.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title } = req.body;
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].title = title;
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).send("Task not found");
  }
});

// Delete a task
router.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== taskId);
  res.status(204).send();
});

module.exports = router;
