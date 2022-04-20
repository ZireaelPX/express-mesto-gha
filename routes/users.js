const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  getAuthorizedUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

const { validateUserId, validateUpdateAvatar, validateUpdateUser } = require('../middlewares/validate');

router.get('/', getUsers);
router.get('/me', getAuthorizedUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUpdateUser, updateUserInfo);
router.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = router;
