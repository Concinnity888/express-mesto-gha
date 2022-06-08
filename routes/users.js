const express = require('express');
const {
  getUsers,
  getUserByID,
  createUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/', getUsers);

usersRoutes.get('/:id', getUserByID);

usersRoutes.post('/', express.json(), createUser);

usersRoutes.patch('/me', express.json(), updateUser);

usersRoutes.patch('/me/avatar', express.json(), updateUserAvatar);

module.exports = {
  usersRoutes,
};
