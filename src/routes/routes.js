//express route initialization
const express = require("express");
const {
  getUsers,
  massInsert,
  exportUsers,
} = require("../controllers/UserController.js");

const route = express.Router();

const prefix = "/api";

//routes
route.get(prefix + "/", (req, res) => {
  return res.status(200).json({
    message: "Welcome to the API",
  });
});

route.get(prefix + "/users", getUsers);
route.get(prefix + "/export/users", exportUsers);
route.post(prefix + "/users", massInsert);

module.exports = route;
