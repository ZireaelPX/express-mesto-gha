const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточки не обнаружены' });
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные...' });
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные...' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка не обнаружена' });
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные...' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка не обнаружена' });
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные...' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка не обнаружена' });
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
      }
    });
};
