'use strict';

(function () {
  // подготовка xhr
  var prepareXhr = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onSuccess(xhr.response);
          break;
        case 400:
          onError('Неверный запрос: ' + xhr.status + ' ' + xhr.statusText);
          break;
        case 401:
          onError('Пользователь не авторизован: ' + xhr.status + ' ' + xhr.statusText);
          break;
        case 404:
          onError('Ничего не найдено: ' + xhr.status + ' ' + xhr.statusText);
          break;
        default:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за: ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  window.backend = {
    load: function (onSuccess, onError) {
      var URL = 'https://js.dump.academy/keksobooking/data';
      var xhr = prepareXhr(onSuccess, onError);

      xhr.open('GET', URL);
      xhr.send();
    },

    submit: function (data, onSuccess, onError) {
      var URL = 'https://js.dump.academy/keksobooking';
      var xhr = prepareXhr(onSuccess, onError);

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
