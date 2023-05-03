const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const userRoutes = express.Router();

userRoutes.route("/").post(registerUser).get(protect, allUsers);
userRoutes.post("/login", authUser);

module.exports = userRoutes;
