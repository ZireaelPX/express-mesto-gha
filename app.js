const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

// const { createUser, login } = require('./controllers/users');
// const { validateCreateUser, validateLogin } = require('./middlewares/validate');
// const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const createErrors = require('./middlewares/errors');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

// app.post('/signin', validateLogin, login);
// app.post('/signup', validateCreateUser, createUser);

// app.use(auth);

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(createErrors);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Port: ${PORT}`);
});
