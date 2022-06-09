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

usersRoutes.post('/', createUser);

usersRoutes.patch('/me', updateUser);

usersRoutes.patch('/me/avatar', updateUserAvatar);

module.exports = {
  usersRoutes,
};
