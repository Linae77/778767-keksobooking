'use strict';
// Функция приведения страницы в начальное состояние
(function () {
  var initiatePage = function () {
    window.data.ads = window.renderAds(window.data.ADS_NUMBER);
    window.map.inactivateMap();
    window.map.getAddress();
  };
  initiatePage();
})();
