const Card = require('../models/card');


module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send(cards))
    .catch(err => res.status(500).send({errorName: err.name, message: err.message}));
};

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;

  Card.create({name, link, owner})
    .then(card => res.status(200).send(card))
    .catch(err => res.status(500).send({message: err.message}));
};

module.exports.deleteCard = (req, res) => {
  const {cardId} = req.params;

  Card.findByIdAndRemove(cardId)
    .then(card => res.status(200).send(card))
    .catch(err => res.status(500).send({message: err.message}));
};

module.exports.likeCard = (req, res) => {
  const owner = req.user._id;
  const {cardId} = req.params;

  Card.findByIdAndUpdate(
    cardId,
    {$addToSet: {likes: owner}},
    {new: true}
  )
    .then((card) => res.status(200).send(card))
    .catch(err => res.status(500).send({message: err.message}));
}

module.exports.dislikeCard = (req, res) => {
  const owner = req.user._id;
  const {cardId} = req.params;

  Card.findByIdAndUpdate(
    cardId,
    {$pull: {likes: owner}},
    {new: true}
  )
    .then((card) => res.status(200).send(card))
    .catch(err => res.status(500).send({message: err.message}));
}