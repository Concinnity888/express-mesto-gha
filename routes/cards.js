const express = require('express');
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const cardsRoutes = express.Router();

cardsRoutes.get('/', getCards);

cardsRoutes.delete('/:cardId', deleteCard);

cardsRoutes.post('/', express.json(), createCard);

cardsRoutes.put('/:cardId/likes', likeCard);

cardsRoutes.delete('/:cardId/likes', dislikeCard);

module.exports = {
  cardsRoutes,
};
