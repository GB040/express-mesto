const mongoose = require('mongoose');
const validator = require('validator'); //* модуль для валидации данных
const bcrypt = require('bcryptjs'); //* модуль для хэширования пароля пользователя

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: { // опишем свойство validate
      validator(link) { //* функция валидации вернёт true, если данные соответствуют регулярке
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/.test(link); //* параметр link - это значение свойства avatar
      },
      message: (props) => `${props.value} невалидная ссылка!`, //* вернули сообщение, если данные не прошли валидацию
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        //* проверим, вводимый пользователем email, c помощью модуля validator
        return validator.isEmail(email);
      },
      message: (props) => `${props.value} невалидная электронная почта!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, //* сделали чтобы хеш пароля пользователя не возвращался из базы
  },
}); //* создали схему, чтобы проверять, соответствует ли ей документ, прежде чем записывать его в БД

//* добавим метод findUserByCredentials схеме пользователя
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; //* в случае успеха вернули объект пользователя
        });
    });
};

module.exports = mongoose.model('user', userSchema);