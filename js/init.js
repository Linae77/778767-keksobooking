'use strict';
// Функция приведения страницы в начальное состояние
(function () {
  var initiatePage = function () {
    window.pin.inactivate();
    window.pin.getAddress();
  };
  initiatePage();
})();
