const express = require('express');
const { usersRoutes } = require('./users');
const { cardsRoutes } = require('./cards');

const routes = express.Router();

routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);

module.exports = {
  routes,
};
