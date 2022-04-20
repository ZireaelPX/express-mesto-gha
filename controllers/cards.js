const Cards = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.message === 'NotFound') {
        // throw new NotFoundError('Публикации не обнаружены');
        next(new NotFoundError('Публикации не обнаружены'));
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
        Cards.findByIdAndRemove(cardId).then(() => res.status(200).send(card));
      }
      // throw new ForbiddenError('Доступ запрещён');
      return next(new ForbiddenError('Доступ запрещён'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении...'));
      } else {
        next(err);
      }
    });
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
