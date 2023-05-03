const aysncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
// Criar ou procurar por um chat 1-1
exports.accessChat = aysncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("Falha no envio do nome do usuario");
  }
  var isChat = await Chat.find({
    isGroupChat: false, //so chat que nao e grupo
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, //o id do user logado ja decodificado do jwt
      { users: { $elemMatch: { $eq: userId } } }, //user a procurar
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email", //pegue o nome o email e a foto de perfil
  });

  if (isChat.length > 0) {
    res.send(isChat[0]); //se existe um chat entre esses dois retorne o chat
  } else {
    // caso nao exista um chat crie
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});
exports.fetchChats = aysncHandler(async (req, res) => {
  // vai procurar por todos os grupos que o usuario estara inserido
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updateAt: -1 }) //colocar em ordem de envio
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("Falha no processo de procura de conversa");
  }
});

exports.createGroupChat = aysncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Preencha todos os campos" });
  }
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("Sao precisos mais de 2 elementos para formar o grupo");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("Falha no processo de criacao de grupos");
  }
});

exports.renameGroup = aysncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true } // para retornar a nova colection
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("O chat nao foi encontrado");
  } else {
    res.json(updatedChat);
  }
});

exports.addToGroup = aysncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("O chat nao foi encontrado");
  } else {
    res.json(added);
  }
});
exports.removeFromGroup = aysncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const remove = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!remove) {
    res.status(404);
    throw new Error("O chat nao foi encontrado");
  } else {
    res.json(remove);
  }
});
