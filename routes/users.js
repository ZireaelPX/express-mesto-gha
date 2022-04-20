const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  getAuthorizedUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

const { validateUserId, validationUpdateAvatar } = require('../middlewares/validate');

router.get('/', getUsers);
router.get('/me', getAuthorizedUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);
router.patch('/me/avatar', validationUpdateAvatar, updateUserAvatar);
router.get('/:userId', validateUserId, getUserById);

module.exports = router;
