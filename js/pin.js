'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  // Шаблон для создания меток на карте
  var mapPins = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin__template').content.querySelector('.map__pin');

  // Функция создания по шаблону DOM-элемента метки на картке
  var renderPin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinAvatarElement = pinElement.querySelector('img');
    pinElement.querySelector('.map').style.left = pin.location.x - (PIN_WIDTH / 2) + 'px';
    pinElement.querySelector('.map').style.top = pin.location.y + PIN_HEIGHT + 'px';
    pinAvatarElement.querySelector('.map').src = pin.author.avatar;
    pinAvatarElement.querySelector('.map').alt = pin.offer.title;
    pinElement.addEventListener('click', function () {
      openMapCard(pin);
    });
    return pinElement;
  };

  // Удаление меток похожих объявлений с карты
  var clearMap = function () {
    var pinElement = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pinElement.length; i++) {
      mapPins.removeChild(pinElement[i]);
    }
  };

  // Заполнение карты DOM-элементами на основе массива с объектами
  var fillMap = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.ads.length; i++) {
      fragment.appendChild(renderPin(window.data.ads[i]));
      mapPins.appendChild(fragment);
    }
  };

  window.pin = {
    renderPin: renderPin,
    clearMap: clearMap,
    fillMap: fillMap
  },

})();

