const aysncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
exports.registerUser = aysncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Prencha toddos os campos");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("O ja esta inscrito ");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Falha no processo de criacao de usuario");
  }
});

exports.authUser = aysncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Prencha toddos os campos");
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);

    throw new Error("Erro de passwoe ou username");
  }
});
exports.allUsers = aysncHandler(async (req, res) => {
  const keyword = req.query.search //essa funcao serve para poder pesquisar de qualquer
    ? {
        $or: [
          //esse codigo significa que se a query digitada for igual a name
          // ou pode ser igual a email,
          //$regex e para filtrar por tipo, $options i case insesitive
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {}; //usado para receber varios dados pela url
  //encontre todos menos o usuario logado no momento
  // { _id: { $ne: req.user._id } }
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.json(users);
});
