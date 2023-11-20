const { writeFileHelper, taskData } = require("../helpers/helper");

// Middleware controller to check update request
exports.checkUpdate = (req, res, next) => {
  const { title, description, flag } = req.body;

  if (title === "") {
    return res.status(400).json({
      result: "failed",
      message: "Title cannot be empty",
    });
  }

  if (description === "") {
    return res.status(400).json({
      result: "failed",
      message: "Description cannot be empty",
    });
  }

  if (flag && typeof flag !== "boolean") {
    return res.status(400).json({
      result: "failed",
      message: "Completion state must be a boolean",
    });
  }

  next();
};

// Middleware controller to check request body
exports.checkBody = (req, res, next) => {
  const { title, description, flag, priority } = req.body;
  const hasEmptyKey = "" in req.body;

  if (hasEmptyKey) {
    return res.status(400).json({
      result: "failed",
      message: "Invalid request",
    });
  }

  if (flag && typeof flag !== "boolean") {
    return res.status(400).json({
      result: "failed",
      message: "Completion state must be a boolean",
    });
  }

  const validPriorities = ["low", "medium", "high"];

  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      result: "failed",
      message: "Priority must be either low, medium, or high",
    });
  }

  if (req.method === "PATCH") {
    if (flag === "") {
      return res.status(400).json({
        result: "failed",
        message: "Completion state is required",
      });
    }

    if (title === "") {
      return res.status(400).json({
        result: "failed",
        message: "Title cannot be empty",
      });
    }

    if (description === "") {
      return res.status(400).json({
        result: "failed",
        message: "Description cannot be empty",
      });
    }
  }

  if (req.method === "POST") {
    if (!req.body.hasOwnProperty("flag")) {
      return res.status(400).json({
        result: "failed",
        message: "Completion state is required",
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        result: "failed",
        message: `${!title ? "Title" : "Description"} is required`,
      });
    }
  }

  next();
};

// Middleware to check task ID
exports.checkId = (req, res, next, val) => {
  const task = taskData.find((value) => value._id === Number(val));

  if (!task) {
    return res.status(404).json({ result: "failed", message: "Invalid" });
  }

  next();
};

// Controller to get tasks
exports.getTasks = (req, res) => {
  const { flag, sortBy, sortOrder } = req.query;
  const flagValue = flag === "true";
  let filteredTask;

  if (flag) {
    filteredTask = taskData.filter((value) => value.flag === flagValue);
  }

  if (sortBy === "createdAt") {
    filteredTask = taskData.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }

  res.status(200).json({
    status: "Success",
    results: taskData.length,
    data: {
      tasks: Object.keys(req.query).length === 0 ? taskData : filteredTask,
    },
  });
};

// Controller to get a single task
exports.getTask = (req, res) => {
  const task = taskData.find((val) => val._id === Number(req.params.id));
  res.status(200).json({ status: "Success", data: { task } });
};

// Controller to create a new task
exports.createTask = (req, res) => {
  const newTaskId = Number(taskData[taskData.length - 1]?._id) + 1 || 1;
  const newTask = {
    _id: newTaskId,
    createdAt: new Date().toISOString(),
    ...req.body,
  };

  taskData.push(newTask);

  writeFileHelper(taskData, () => {
    res.status(200).json({ result: "success", data: { task: newTask } });
  });
};

// Controller to update a task
exports.updateTask = (req, res) => {
  const id = +req.params.id;
  const task = taskData.find((val) => id === val._id);
  const updatedTask = {
    ...task,
    ...req.body,
  };

  const updatedItems = taskData.map((val) =>
    val._id === id ? updatedTask : val
  );

  writeFileHelper(updatedItems, () => {
    res.status(200).json({ result: "success", data: { task: updatedTask } });
  });
};

// Controller to delete a task
exports.deleteTask = (req, res) => {
  const id = +req.params.id;
  const updatedTask = taskData.filter((val) => id !== val._id);

  writeFileHelper(updatedTask, () => {
    res.status(200).json({ result: "success", data: null });
  });
};

// Controller to get tasks by priority level
exports.getTasksByPriority = (req, res) => {
  const level = req.params.level;
  const filteredTasks = taskData.filter((val) => val.priority === level);

  res.status(200).json({ result: "success", data: { filteredTasks } });
};
