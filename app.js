const express = require('express');
const mongoose = require('mongoose'); //* модуль для взаимодействия MongoDB и JS
const bodyParser = require('body-parser'); //* модуль для парсинга req.body
const path = require('path');
const cardsRouter = require('./routes/cards'); //* импортировали роутер
const usersRouter = require('./routes/users');

const { PORT = 3000 } = process.env;  //* слушаем 3000 порт

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
}); //* подключаемся к серверу mongo

app.use(bodyParser.json()); //* указали парсить запросы с JSON
app.use(bodyParser.urlencoded({ extended: true })); //* указали парсить запросы с веб-страницами

app.use((req, res, next) => {
  req.user = {
    _id: '6274dd71203167141d1b14ae',
  };

  next();
}); //* временное решение авторизации

app.use('/cards', cardsRouter); //* запустили роутер
app.use('/users', usersRouter);

app.use('*', (req, res) => {
  res
    .status(404)
    .send({ message: 'Запрашиваемый ресурс не найден' });
}); //* обработали несуществующий адрес

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); // Если всё работает, консоль покажет, какой порт приложение слушает
})