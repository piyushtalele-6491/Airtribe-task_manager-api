const express = require("express");
const taskRouter = require("./src/routes/taskRoutes");

const app = express();

app.use(express.json());

// Handling the home page request
app.all("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: `Welcome to the task manager API`,
  });
});

// Using the taskRouter for handling tasks-related routes
app.use("/tasks", taskRouter);

// Handling invalid requests
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: `Cannot resolve ${req.originalUrl} on this server`,
  });
});

module.exports = app;
