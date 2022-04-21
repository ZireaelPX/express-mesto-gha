const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

const { createUser, login } = require('../controllers/users');
const { validateCreateUser, validateLogin } = require('../middlewares/validate');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена. Проверьте URL' });
});

module.exports = router;
