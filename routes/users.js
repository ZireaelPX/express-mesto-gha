const router = require('express').Router();

const {
  getUsers,
  getUserById,
  getAuthorizedUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getAuthorizedUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);
router.get('/:userId', getUserById);

module.exports = router;
