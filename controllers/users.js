const mongoose = require('mongoose')
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

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  if(!mongoose.Types.ObjectId.isValid(userId)){
    res.status("404").send({ message: 'Пользователь не обнаружен' });
    return;
  }

  User.findById(userId)
    // .orFail(new Error('NotFound'))
    .then((user) => {
      console.log(user)
      if(!user){
        res.status("404").send({ message: 'Пользователь не обнаружен' })
        return;
      }
      res.status(200).send(user)
    })
    .catch((err) => {
      console.log(err.message)
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
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
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
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
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
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные...' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь не обнаружен' });
      } else {
        res.status(500).send({ message: 'На стороне сервере произошла ошибка' });
      }
    });
};
