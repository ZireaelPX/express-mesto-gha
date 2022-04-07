const router = require('express').Router();

const {
  getUsers,
  createUser,
  getUser,
  updateUserInfo,
  updateUserAvatar
} = require('../controllers/users')

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/me', updateUserInfo)
router.patch('/me/avatar', updateUserAvatar)
router.get('/:userId', getUser);


module.exports = router;