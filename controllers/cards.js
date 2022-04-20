const Cards = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Публикации не обнаружены');
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Cards.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные...');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  return Cards.findById(cardId)
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Cards.findByIdAndRemove(cardId).then(() => res.status(200).send(card));
      } else {
        throw new ForbiddenError('Доступ запрещён');
      }
    })
    .catch(next);
  // const { cardId } = req.params;
  //
  // Cards.findByIdAndRemove(cardId)
  //   .orFail(() => {
  //     const error = new Error();
  //     error.statusCode = 404;
  //     throw error;
  //   })
  //   .then((card) => res.status(200).send(card))
  //   .catch((err) => {
  //     if (err.name === 'ValidationError') {
  //       return res.status(400).send({ message: 'Ошибка валидности данных' });
  //     }
  //     if (err.name === 'CastError') {
  //       return res.status(400).send({ message: 'Передан некорректный _id' });
  //     }
  //     if (err.statusCode === 404) {
  //       return res.status(404).send({ message: 'ID карточки не найден' });
  //     }
  //     return res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
  //   });
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
      if (err.message === 'NotFound') {
        next(new NotFoundError('Публикация по заданному _id не найдена'));
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
      if (err.message === 'NotFound') {
        next(new NotFoundError('Публикация по заданному _id не найдена'));
      }
      next(err);
    });
};