var express = require("express");
var router = express.Router();
const Task = require("../models/todo");

// Get Homepage
router.get("/", ensureAuthenticated, function(req, res) {
  Task.getTasks(req.user.id, function(err, list) {
    if (err) {
      req.flash("error_msg", "Failed to load Tasks. Please try again");
    }
    res.render("todo", {
      tasks: list
    });
  });
});

router.post("/", ensureAuthenticated, function(req, res) {
  console.log(req.body.task);
  const newTask = new Task({
    email: req.user.id,
    task: req.body.task,
    completed: false
  });
  Task.addNewTask(newTask, function(err, task) {
    if (err) throw new Error();
    else {
      console.log(task);

      res.send("success");
    }
  });
});

router.delete("/", function(req, res) {
  console.log("task: ", req.body.task);
  Task.removeTask(req.body.task, function(err, res) {
    if (err) throw new Error();
    else {
      console.log("task removed");
    }
  });
  res.send("success");
});

router.put("/", function(req, res) {
  Task.toggleCheck(req.body.task, function(err, res) {
    if (err) throw new Error();
    else {
      console.log("task modified");
    }
  });
  res.send("success");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error_msg", "You are not logged in");
    res.redirect("/user/login");
  }
}

module.exports = router;
