const {celebrate, Joi} = require('celebrate');
const isUrl = require('validator/lib/isURL');
const BadRequestError = require('../errors/bad-request-err');


module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(/^(http|https):\/\/[A-za-z0-9-._~:/?#\[\]@!$&'()*+,;=]{1,}$/)),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(/^(http|https):\/\/[A-za-z0-9-._~:/?#\[\]@!$&'()*+,;=]{1,}$/)),
  }),
});

module.exports.validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(new RegExp(/^(http|https):\/\/[A-za-z0-9-._~:/?#\[\]@!$&'()*+,;=]{1,}$/)),
  }),
});

module.exports.validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});