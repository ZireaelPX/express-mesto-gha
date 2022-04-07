const User = require('../models/user');


module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send(users))
    .catch(err => res.status(500).send({errorName: err.name, message: err.message}));
};

module.exports.getUser = (req, res) => {
  const {userId} = req.params;
  User.findById(userId)
    .then(user => res.status(200).send(user))
    .catch(err => res.status(500).send({errorName: err.name, message: err.message}));
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => res.send(user))
    .catch(err => res.status(500).send({message: err.message}));
};

module.exports.updateUserInfo = (req, res) => {
  const {name, about} = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(
    owner,
    {name, about},
    {new: true}
  )
    .then(user => res.status(200).send(user))
    .catch(err => res.status(500).send({message: err.message}));
};

module.exports.updateUserAvatar = (req, res) => {
  const {avatar} = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(
    owner,
    {avatar},
    {new: true}
  )
    .then(user => res.status(200).send(user))
    .catch(err => res.status(500).send({message: err.message}));
};