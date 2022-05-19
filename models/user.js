const mongoose = require('mongoose');
// Опишем схему:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: { // опишем свойство validate
      validator(link) { // validator - функция проверки данных. v - значение свойства about
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/.test(link); //* параметр link - это значение свойства avatar
      },
      message: (props) => `${props.value} невалидная ссылка!`, //* вернули сообщение, если данные не прошли валидацию
    }
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);