const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');
const { validateLogin, validateCreateUser } = require('../middlewares/validate');
const { login, createUser } = require('../controllers/users');
const NotFound = require('../errors/not-found');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res, next) => {
  next(new NotFound('Страница не найдена. Проверьте URL'));
});

module.exports = router;
