const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = new Card({ name, link, owner: req.user._id });
    res.status(201).send(await card.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании карточки',
      });
      return;
    }
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      res.status(404).send({
        message: 'Карточка с указанным _id не найдена',
      });
      return;
    }

    const cardOwner = card.owner.toString().replace('new ObjectId("', '');
    if (req.user._id === cardOwner) {
      const currentCard = await Card.findByIdAndRemove(req.params.cardId);
      if (!currentCard) {
        res.status(404).send({
          message: 'Карточка с указанным _id не найдена',
        });
        return;
      }
      res.status(200).send(card);
    } else {
      res.status(401).send({
        message: 'Нет доступа',
      });
      return;
    }
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({
        message: 'Переданы некорректные данные при удалении карточки',
      });
      return;
    }
    res.status(500).send({
      message: err.message,
    });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      res.status(404).send({
        message: 'Передан несуществующий _id карточки',
      });
      return;
    }
    res.status(200).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({
        message: 'Переданы некорректные данные для постановки/снятии лайка',
      });
      return;
    }
    res.status(500).send({
      message: err.message,
    });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      res.status(404).send({
        message: 'Передан несуществующий _id карточки',
      });
      return;
    }
    res.status(200).send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({
        message: 'Переданы некорректные данные для постановки/снятии лайка',
      });
      return;
    }
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
