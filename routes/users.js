const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  getAuthorizedUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

const { validateUserId, validateUpdateUserAvatar, validateUpdateUserInfo } = require('../middlewares/validate');

router.get('/', getUsers);

router.get('/me', getAuthorizedUser);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUpdateUserInfo, updateUserInfo);

router.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

module.exports = router;
