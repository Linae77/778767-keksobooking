'use strict';
(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_TIP = 22;
  var COORD_X_MIN = 0;
  var COORD_X_MAX = 1200;
  var COORD_Y_MIN = 130;
  var COORD_Y_MAX = 630;

  // Необходимые элементы
  var adFormFieldset = adForm.querySelectorAll('fieldset');
  var inputAddress = adForm.querySelector('#address');

  // Закрытие формы по нажатию на esc
  var onCardEscPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.card.close();
    }
  };

  // Функция активации карты
  var activateMap = function () {
    mapElement.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    // удаление атрибутов disabled у полей формы
    for (var i = 0; i < adFormFieldset.length; i++) {
      adFormFieldset[i].disabled = false;
    }
  };

  // Функция дезактивации карты
  var inactivateMap = function () {
    mapElement.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    // добавление атрибутов disabled полям формы
    for (var i = 0; i < adFormFieldset.length; i++) {
      adFormFieldset[i].disabled = true;
    }
  };

  // Получение адреса метки на карте
  var getAddress = function () {
    var addressX = Math.round(mainPinElement.offsetLeft + MAIN_PIN_WIDTH / 2);
    var addressY = Math.round(mainPinElement.offsetTop + MAIN_PIN_HEIGHT / 2);
    var coord = {
      x: addressX,
      y: addressY
    };
    inputAddress.value = coord.x + ', ' + coord.y;
    return inputAddress.value;
  };

  // Эмуляция перемещения метки
  var minCoord = {
    x: COORD_X_MIN,
    y: COORD_Y_MIN - MAIN_PIN_HEIGHT - MAIN_PIN_TIP
  };
  var maxCoord = {
    x: COORD_X_MAX - MAIN_PIN_WIDTH,
    y: COORD_Y_MAX - MAIN_PIN_HEIGHT - MAIN_PIN_TIP
  };

  // Получение положения метки
  var getPinPosition = function (offset, shift, min, max) {
    var pinPosition = offset - shift;
    if (pinPosition <= min) {
      pinPosition = min;
    } else if (pinPosition >= max) {
      pinPosition = max;
    } else {
      pinPosition = pinPosition;
    }
    return pinPosition;
  };

  // Обработчик нажатия на метку с перемещением
  var mouseDownHandler = function (evt) {
    evt.preventDefault();
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
      mainPinElement.style.top = getPinPosition(mainPinElement.offsetTop, shift.y, minCoord.y, maxCoord.y) + 'px';
      mainPinElement.style.left = getPinPosition(mainPinElement.offsetLeft, shift.x, minCoord.x, maxCoord.x) + 'px';
      getAddress();
    };
    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  // Обработчик нажатия на метку без перемещения
  var mouseClickHandler = function () {
    activateMap();
    getAddress();
    fillMap();
    mainPinElement.removeEventListener('mouseup', mouseClickHandler);
  };

  mainPinElement.addEventListener('mousedown', mouseDownHandler);
  mainPinElement.addEventListener('mouseup', mouseClickHandler);
})();


