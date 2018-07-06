'use strict';
// Функция приведения страницы в начальное состояние
(function () {
  var initiatePage = function () {
    //window.data.ads = window.data.renderAds(window.data.ADS_NUMBER);
    window.map.inactivate();
    window.map.getAddress();
  };
  initiatePage();
})();
