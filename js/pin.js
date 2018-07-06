'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_TIP = 22;
  var MAIN_PIN_Y_START = 570;
  var MAIN_PIN_X_START = 375;
  var COORD_X_MIN = 0;
  var COORD_X_MAX = 1200;
  var COORD_Y_MIN = 130;
  var COORD_Y_MAX = 630;

  // Шаблон для создания меток на карте
  var mapPins = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin__template').content.querySelector('.map__pin');
  var isPinActive = false;

  // Необходимые элементы
  var mapElement = document.querySelector('.map');
  var mainPinElement = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldset = adForm.querySelectorAll('fieldset');
  var inputAddress = adForm.querySelector('#address');

  window.pin = {
    mainPinElement: mainPinElement,
    // Функция создания по шаблону DOM-элемента метки на картке
    renderPin: function (pin) {
      var pinElement = pinTemplate.cloneNode(true);
      var pinAvatarElement = pinElement.querySelector('img');
      pinElement.querySelector('.map').style.left = pin.location.x - (PIN_WIDTH / 2) + 'px';
      pinElement.querySelector('.map').style.top = pin.location.y + PIN_HEIGHT + 'px';
      pinAvatarElement.querySelector('.map').src = pin.author.avatar;
      pinAvatarElement.querySelector('.map').alt = pin.offer.title;
      pinElement.addEventListener('click', function () {
        if (isPinActive) {
          var pinActiveElement = mapPins.querySelector('.map__pin--active');
          pinActiveElement.classList.remove('map__pin--active');
        }
        window.card.openMapCard(pin);
        pinElement.classList.add('map__pin--active');
        isPinActive = true;

      });
      return pinElement;
    },

    // Удаление меток похожих объявлений с карты
    clearMap: function () {
      var pinElement = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
      for (var i = 0; i < pinElement.length; i++) {
        mapPins.removeChild(pinElement[i]);
      }
    },

    // Заполнение карты метками на основе массива объявлений ads
    loadHandler: function (ads) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < ads.length; i++) {
        fragment.appendChild(window.pin.renderPin(ads[i]));
        mapPins.appendChild(fragment);
      }
    },

    // Обработчик ошибки
    errorHandler: function (errorMessage) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; margin: 5; text-align: center; background-color: rgb(250, 255, 45)';
      node.style.position = 'absolute';
      node.style.left = '0';
      node.style.right = '0';
      node.style.fontSize = '24px';
      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
      var closeErrorMessage = function () {
        document.body.removeChild(node);
      };
      setTimeout(closeErrorMessage, 10000);
    },

    // Функция активации карты
    activateMap: function () {
      mapElement.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      // удаление атрибутов disabled у полей формы
      for (var i = 0; i < adFormFieldset.length; i++) {
        adFormFieldset[i].disabled = false;
      }
    },

    // Функция дезактивации карты
    inactivateMap: function () {
      mapElement.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      // добавление атрибутов disabled полям формы
      for (var i = 0; i < adFormFieldset.length; i++) {
        adFormFieldset[i].disabled = true;
      }
    },

    // Получение адреса метки на карте
    getAddress: function () {
      var addressX = Math.round(mainPinElement.offsetLeft + MAIN_PIN_WIDTH / 2);
      var addressY = Math.round(mainPinElement.offsetTop + MAIN_PIN_HEIGHT / 2);
      var coord = {
        x: addressX,
        y: addressY
      };
      inputAddress.value = coord.x + ', ' + coord.y;
      return inputAddress.value;
    },

    // Получение положения метки
    getPinPosition: function (offset, shift, min, max) {
      var pinPosition = offset - shift;
      if (pinPosition <= min) {
        pinPosition = min;
      } else if (pinPosition >= max) {
        pinPosition = max;
      } else {
        pinPosition = pinPosition;
      }
      return pinPosition;
    },

    // Обработчик нажатия на метку с перемещением
    mouseDownHandler: function (evt) {
      evt.preventDefault();
      var minCoord = {
        x: COORD_X_MIN,
        y: COORD_Y_MIN - MAIN_PIN_HEIGHT - MAIN_PIN_TIP
      };
      var maxCoord = {
        x: COORD_X_MAX - MAIN_PIN_WIDTH,
        y: COORD_Y_MAX - MAIN_PIN_HEIGHT - MAIN_PIN_TIP
      };
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };
      var mouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();
        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };
        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
        mainPinElement.style.top = window.pin.getPinPosition(mainPinElement.offsetTop, shift.y, minCoord.y, maxCoord.y) + 'px';
        mainPinElement.style.left = window.pin.getPinPosition(mainPinElement.offsetLeft, shift.x, minCoord.x, maxCoord.x) + 'px';
        window.pin.getAddress();
      };
      var mouseUpHandler = function (upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },

    // Обработчик нажатия на метку без перемещения
    mouseClickHandler: function () {
      window.pin.activate();
      window.pin.getAddress();
      window.backend.load(window.pin.loadHandler, window.pin.errorHandler);
      mainPinElement.removeEventListener('mouseup', window.pin.mouseClickHandler);
    },

    // Удаление меток похожих объявлений с карты
    removePinsElements: function () {
      var pinElement = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
      for (var i = 0; i < pinElement.length; i++) {
        mapPins.removeChild(pinElement[i]);
      }
    },

    // Возвращение главной метки в начальное положение
    resetPin: function () {
      mainPinElement.style.top = MAIN_PIN_Y_START + 'px';
      mainPinElement.style.left = MAIN_PIN_X_START + 'px';
    }
  };
})();
