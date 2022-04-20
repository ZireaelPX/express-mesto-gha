// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');
const UnauthorizedError = require('../errors/unauthorized');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователи не обнаружены'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      next(err);
    });
};

module.exports.getAuthorizedUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        // throw new BadRequestError('Переданы некорректные данные');
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.message === 'NotFound') {
        // throw new NotFoundError('Пользователь по указанному _id не найден');
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(200).send({
        id: user._id, email: user.email, name: user.name, about: user.about, avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      } else {
        next(err);
      }
    });

  // User.create({
  //   name, about, avatar, email,
  // })
  //   .then((user) => res.status(200).send(user))
  //   .catch((err) => {
  //     if (err.name === 'CastError' || err.name === 'ValidationError') {
  //       res.status(400).send({ message: 'Переданы некорректные данные...' });
  //     } else {
  //       res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
  //     }
  //   });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  return User.findByIdAndUpdate(
    owner,
    { name, about },
    { new: true, runValidators: true },
  )
    // .orFail(() => {
    //   throw new NotFoundError('Пользователь с указанным _id не найден');
    // })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации.'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь не обнаружен'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(
    owner,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        // throw new BadRequestError('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь не обнаружен'));
        // throw new NotFoundError('Пользователь не обнаружен');
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'yandex-praktikum', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      // throw new UnauthorizedError('Неправильная почта или пароль');
      next(new UnauthorizedError('Неправильная почта или пароль'));
    });
};
