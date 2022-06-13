const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = new Card({ name, link, owner: req.user.id });
    res.status(201).send(await card.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при создании карточки'));
    }
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      next(new NotFoundError('Карточка с указанным _id не найдена'));
    }

    const cardOwner = card.owner.toString().replace('new ObjectId("', '');
    if (req.user.id === cardOwner) {
      const currentCard = await Card.findByIdAndRemove(req.params.cardId);
      res.status(200).send(currentCard);
    } else {
      next(new ForbiddenError('Нет доступа'));
    }
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
    }
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      next(new NotFoundError('Карточка с указанным _id не найдена'));
    }
    const currentCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user.id } },
      { new: true },
    );
    res.status(200).send(currentCard);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      return;
    }
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      next(new NotFoundError('Карточка с указанным _id не найдена'));
    }
    const currentCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user.id } },
      { new: true },
    );
    res.status(200).send(currentCard);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
    }
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
