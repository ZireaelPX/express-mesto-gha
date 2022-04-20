const router = require('express').Router();

const {
  getUsers,
  getUserById,
  getAuthorizedUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

const { validateUserId, validateUpdateUserInfo, validationUpdateAvatar } = require('../middlewares/validate');

router.get('/', getUsers);
router.get('/me', getAuthorizedUser);
router.patch('/me', validateUpdateUserInfo, updateUserInfo);
router.patch('/me/avatar', validationUpdateAvatar, updateUserAvatar);
router.get('/:userId', validateUserId, getUserById);

module.exports = router;
