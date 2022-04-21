const Cards = require('../models/card');
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Cards.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные...'));
        // throw new BadRequestError('Переданы некорректные данные...');
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Cards.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Публикация не обнаружена');
    })
    .then((card) => {
      if (card.owner.toString() === userId) {
        return Cards.findByIdAndRemove(cardId).then(() => res.status(200).send(card));
      }
      return next(new ForbiddenError('Доступ запрещён'));
      // throw new ForbiddenError('Доступ запрещён');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении...'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError('Публикация по заданному _id не найдена');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные...'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError('Публикация по заданному _id не найдена');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные...'));
      }
      next(err);
    });
};
