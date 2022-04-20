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
    name: Joi.string().required().min(2).max(20),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);
router.patch('/me/avatar', validationUpdateAvatar, updateUserAvatar);
router.get('/:userId', validateUserId, getUserById);

module.exports = router;
