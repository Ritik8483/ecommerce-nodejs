const express = require("express");
const adminController = require("../controller/admin-auth");
const adminRouter = express.Router();

const { createUser, loginUser, getAllAuthUsers } = adminController;

exports.adminAuthTableRouters = adminRouter
  .post("/login", loginUser)
  .post("/signup", createUser)
  .get("/users", getAllAuthUsers);
