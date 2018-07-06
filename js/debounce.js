'use strict';
// Обновление списка не чаще чем один раз в полсекунды
(function () {
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;
  window.debounce = function (cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
  };
})();
