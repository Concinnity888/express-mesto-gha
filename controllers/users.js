const bcrypt = require('bcrypt');

const User = require('../models/user');
const { getToken } = require('../utils/jwt');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const DUBLICATE_MONGOOSE_ERROR_CODE = 11000;
const SAULT_ROUNDS = 10;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorizedError('Неправильные логин или пароль'));
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      next(new UnauthorizedError('Неправильные логин или пароль'));
    }

    const token = await getToken(user._id);
    res.status(200).send({
      token,
    });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      next(new NotFoundError('Пользователь по указанному _id не найден'));
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      next(new NotFoundError('Пользователь по указанному _id не найден'));
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    next(new BadRequestError('Неправильные логин или пароль'));
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
      next(new ValidationError('Переданы некорректные данные при создании пользователя'));
    } else if (err.code === DUBLICATE_MONGOOSE_ERROR_CODE) {
      next(new ConflictError('Пользователь уже существует'));
    } else {
      next(err);
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    } else if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(err);
    }
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotFoundError('Пользователь по указанному _id не найден'));
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
    } else if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  login,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
  getUser,
};
