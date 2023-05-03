const express = require("express");
const userRoutes = require("./userRoutes");
const Routes = express.Router();
const { notFound, errorHandler } = require("../notifications/errorMiddleware");
const ChatRouter = require("./chatRoutes");
const messageRoutes = require("./messageRoutes");

Routes.get("/", (req, res) => {
  res.send("A api funciona");
});

Routes.use("/user", userRoutes);
Routes.use("/chat", ChatRouter);
Routes.use("/message", messageRoutes);
// Routes.use(notFound);
// Routes.use(errorHandler);

Routes.all("/*", (req, res) => {
  res.status(404).send("page not found");
});

module.exports = Routes;
