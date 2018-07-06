'use strict';
// Функция приведения страницы в начальное состояние
(function () {
  var initiatePage = function () {
    window.map.inactivate();
    window.map.getAddress();
  };
  initiatePage();
})();
