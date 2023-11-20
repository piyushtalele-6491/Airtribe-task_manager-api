const express = require("express");
const taskController = require("../controller/taskController");
const router = express.Router();

// Middleware to intercept routes with ID in API
router.param("id", taskController.checkId);

// Routes for handling tasks
router.route("/")
  .get(taskController.getTasks)
  .post(taskController.checkBody, taskController.createTask);

router.route("/:id")
  .get(taskController.getTask)
  .patch(taskController.checkBody, taskController.updateTask)
  .delete(taskController.deleteTask);

// Additional route for tasks based on priority level
router.get("/priority/:level", taskController.getTasksByPriority);

module.exports = router;
