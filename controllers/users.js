const bcrypt = require('bcrypt');

const User = require('../models/user');
const { getToken } = require('../utils/jwt');

const DUBLICATE_MONGOOSE_ERROR_CODE = 11000;
const SAULT_ROUNDS = 10;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(400).send({
        message: 'Неправильные логин или пароль',
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(400).send({
        message: 'Неправильные логин или пароль',
      });
      return;
    }

    const token = await getToken(user._id);
    res.status(200).send({
      token,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(404).send({
        message: 'Пользователь по указанному _id не найден',
      });
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.kind === 'ObjectId') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(500).send({
      message: err.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getUserByID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send({
        message: 'Пользователь по указанному _id не найден',
      });
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(500).send({
      message: err.message,
    });
  }
};

const createUser = async (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    res.status(400).send({
      message: 'Неправильные логин или пароль',
    });
    return;
  }

  try {
    const hashPassword = await bcrypt.hash(req.body.password, SAULT_ROUNDS);
    await User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    });
    res.status(201).send({
      name,
      about,
      avatar,
      email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
      return;
    }
    if (err.code === DUBLICATE_MONGOOSE_ERROR_CODE) {
      res.status(409).send({
        message: 'Пользователь уже существует',
      });
      return;
    }
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(404).send({
        message: 'Пользователь с указанным _id не найден',
      });
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.kind === 'ObjectId') {
      res.status(400).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
      return;
    }
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(404).send({
        message: 'Пользователь с указанным _id не найден',
      });
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.kind === 'ObjectId') {
      res.status(400).send({
        message: 'Переданы некорректные данные при обновлении аватара',
      });
      return;
    }
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  login,
  getUsers,
  getUserByID,
  createUser,
  updateUser,
  updateUserAvatar,
  getUser,
};
