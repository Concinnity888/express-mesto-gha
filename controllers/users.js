const User = require('../models/user');

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
  try {
    const { name, about, avatar } = req.body;
    const user = new User({ name, about, avatar });
    res.status(201).send(await user.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании пользователя',
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
  getUsers,
  getUserByID,
  createUser,
  updateUser,
  updateUserAvatar,
};
