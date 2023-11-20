const fs = require("fs");
const path = require("path");

const taskFilePath = path.join(__dirname, "..", "data", "task.json");

// Read task data from the file
exports.taskData = JSON.parse(fs.readFileSync(taskFilePath, "utf8"));

// Write task data to the file
exports.writeFileHelper = (data, callback) => {
  fs.writeFile(taskFilePath, JSON.stringify(data), callback);
};
