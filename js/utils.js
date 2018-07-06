'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var mapElement = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var mainPinElement = document.querySelector('.map__pin--main');

  window.utils = {
    ESC_KEYCODE: ESC_KEYCODE,
    mapElement: mapElement,
    formElement: formElement,
    mainPinElement: mainPinElement,

    // Функции нажатия горячих клавиш
    isEscKeycode: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },

    isEnterKeycode: function (evt, action, data) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action(data);
      }
    },

    // Генерация случайного целого от min до max
    getRandomInt: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },

    // Перетасовка массива (алгоритм Фишера_Йетса)
    shuffleArray: function (array) {
      var newArray = array.slice();
      for (var i = newArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var swap = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = swap;
      }
      return newArray;
    },

    // Генерация числового массива от min до max
    getArray: function (min, max) {
      var array = [];
      for (var i = min; i <= max; i++) {
        array.push(i);
      }
      return array;
    },

    // Генерация массива случайной длины из элементов заданного массива
    getRandomLengthArray: function (array) {
      var n = window.utils.getRandomInt(1, array.length); // случайное количество элементов массива
      var randomArray = [];
      for (var i = 0; i < n; i++) {
        randomArray[i] = array[getArray(0, array.length - 1)[i]];
      }
      return randomArray;
    }
  };
})();
