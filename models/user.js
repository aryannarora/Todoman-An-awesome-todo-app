var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

// User Schema
var UserSchema = mongoose.Schema(
  {
    _id: {
      type: "string"
    },
    password: {
      type: String
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getUserByUsername = function(username, callback) {
  User.findById(username, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};
