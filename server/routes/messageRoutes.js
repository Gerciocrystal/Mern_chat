const express = require("express");
const { sendMessage, allMesages } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const messageRoutes = express.Router();

messageRoutes.route("/").post(protect, sendMessage);
messageRoutes.route("/:chatId").get(protect, allMesages);
module.exports = messageRoutes;
