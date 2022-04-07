const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователи не обнаружены' });
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
      }
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные...' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь не обнаружен' });
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные...' });
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(
    owner,
    { name, about },
    { new: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные...' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь не обнаружен' });
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(
    owner,
    { avatar },
    { new: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные...' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь не обнаружен' });
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
      }
    });
};
