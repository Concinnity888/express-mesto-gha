const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  getUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/', getUsers);

usersRoutes.get('/me', getUser);

usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

usersRoutes.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

usersRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .regex(/https?:\/\/(www)?(\.)?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
  }),
}), updateUserAvatar);

module.exports = {
  usersRoutes,
};
