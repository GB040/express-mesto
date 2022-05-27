import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div>
      <h3>
        <span>404</span> - Страница не найдена
      </h3>
      <p>
        Ой, здесь ничего нет
      </p>
      <Link className="button button_type_to-main" to="/sign-in">Назад</Link>
    </div>
  )
}

export default PageNotFound;