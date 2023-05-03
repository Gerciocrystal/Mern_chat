const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");
const ChatRouter = express.Router();

ChatRouter.route("/").post(protect, accessChat);
ChatRouter.route("/").get(protect, fetchChats);
ChatRouter.route("/group").post(protect, createGroupChat);
ChatRouter.route("/rename").put(protect, renameGroup);
ChatRouter.route("/groupremove").put(protect, removeFromGroup);
ChatRouter.route("/groupadd").put(protect, addToGroup);

module.exports = ChatRouter;
