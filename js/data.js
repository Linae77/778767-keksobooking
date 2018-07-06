'use strict';
(function () {
  var ADS_NUMBER = 8;
  var AVATARS = ['img/avatars/user01.png',
    'img/avatars/user02.png',
    'img/avatars/user03.png',
    'img/avatars/user04.png',
    'img/avatars/user05.png',
    'img/avatars/user06.png',
    'img/avatars/user07.png',
    'img/avatars/user08.png'];
  var TITLES = ['Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

   var ads = [];

  window.data = {
    ADS_NUMBER: ADS_NUMBER,
    ads: ads
  };

  // Вспомогательные функции1
  // Генерация случайного целого в заданном диапазоне
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // Генерация массива чисел от min до max
  var getArray = function (min, max) {
    var array = [];
    for (var i = min; i < max; i++) {
      array.push(i);
    }
    return array;
  };

  // Генерация массива случайной длины из элементов заданного массива
  var getRandomLengthArray = function (array) {
    var n = getRandomInt(1, array.length); // случайное количество элементов массива
    var randomArray = [];
    for (var i = 0; i < n; i++) {
      randomArray[i] = array[getArray(0, array.length - 1)[i]];
    }
    return randomArray;
  };

  // Перетасовка элементов массива
  var shuffleArray = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var swap = array[i];
      array[i] = array[j];
      array[j] = swap;
    }
    return array;
  };

  // Создание массива индексов, перетасованных в случайном порядке
  var getRandomIndexArray = function (array) {
    var randomIndexArray = getArray(0, array.length - 1);
    return shuffleArray(randomIndexArray);
  };

  // Функция создания основного массива объявлений
  window.renderAds = function () {
    var number = ADS_NUMBER;
    var mainItems = [];
    var TITLES_INDEXES = getRandomIndexArray(TITLES); // массив уникальных индексов TITLES в случайном порядке
    for (var i = 0; i < number; i++) {
      var x = getRandomInt(300, 900); // блок, в котором перетаскивается метка
      var y = getRandomInt(130, 630);
      mainItems[i] = {
        author: {
          avatar: AVATARS[i]
        },
        offer: {
          title: TITLES[TITLES_INDEXES[i]], // значения не повторяются
          address: x + ',' + y,
          price: getRandomInt(1000, 1000000),
          type: TYPES[getRandomInt(0, TYPES.length - 1)],
          rooms: getRandomInt(1, 5),
          guests: getRandomInt(1, 15),
          checkin: TIMES[getRandomInt(0, TIMES.length - 1)],
          checkout: TIMES[getRandomInt(0, TIMES.length - 1)],
          features: getRandomLengthArray(FEATURES), // массив строк случайной длины из заданного набора значений
          description: '',
          photos: shuffleArray(PHOTOS)
        },
        location: {x: x, y: y}
      };
    }
    return mainItems;
  };

})();
