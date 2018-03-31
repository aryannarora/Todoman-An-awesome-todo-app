var mongoose = require("mongoose");
// todo Schema
var todoSchema = mongoose.Schema(
  {
    email: {
      type: String
    },
    task: {
      type: String
    },
    completed: {
      type: Boolean
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

const Task = (module.exports = mongoose.model("Todo", todoSchema));

module.exports.addNewTask = function(newTask, callback) {
  newTask.save(callback);
};

module.exports.getTasks = function(id, callback) {
  Task.find({ email: id }).find(callback);
};

module.exports.removeTask = function(task, callback) {
  Task.deleteOne({ task: task }, callback);
};

module.exports.toggleCheck = function(task, callback) {
  Task.find({ task: task }).find(function(err, result) {
    if (err) throw new Error();
    else {
      const val = !result[0].completed;
      Task.where({ task: task }).update({ completed: val }, callback);
    }
  });
};
