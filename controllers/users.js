// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователи не обнаружены');
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
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

  // if (!mongoose.Types.ObjectId.isValid(userId)) {
  //   res.status('404').send({ message: 'Пользователь не обнаружен' });
  //   return;
  // }

  // User.findById(userId)
  //   .orFail(() => {
  //     throw new NotFoundError('Пользователь не обнаружен');
  //   })
  //   .then((user) => res.send(user))
  //   .catch((err) => {
  //     if (err.name === 'CastError') {
  //       return res.status(400).send({ message: 'Передан некорректный _id' });
  //     }
  //     if (err.statusCode === 404) {
  //       throw new NotFoundError('Пользователь по указанному _id не найден');
  //     }
  //     return res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
  //   });
};

module.exports.getAuthorizedUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch(next);
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

module.exports.updateUserAvatar = (req, res) => {
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
        throw new BadRequestError('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь не обнаружен');
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
      throw new UnauthorizedError('Неправильная почта или пароль');
    })
    .catch(next);
};
