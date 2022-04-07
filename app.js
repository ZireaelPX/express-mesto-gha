const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

const {PORT = 3000} = process.env;
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '624ee03bbbbb185f272d828c'
  };

  next();
});

app.use(routes);

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Port: ${PORT}`)
})
