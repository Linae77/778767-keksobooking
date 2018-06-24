'use strict';
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
  'Неуютное бунгало по колено в воде"];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES_ELEMENTS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getUniqueRandoms(min, max, number) {
  var m = [];
  m[0] = Math.foor(Math.random() * (max - min)) + min;
  for (var i = 1; i < number; i++) {
    m[i] = Math.floor(Math.random() * (max - min)) + min;
    for (var j = 0; j < i; j++) {
      while (m[i] === m[j]) {
        m[i] = Math.floor(Math.random() * (max - min)) + min;
      }
    }
  }
  return m;
}

function getRandomArray(min, max, arrElements) {
  var n = getRandomInt(min, max); // случайное количество элементов массива
  for (var i = 0, randomArray = []; i < n; i++) {
    randomArray[i] = arrElements[getUniqueRandoms(min, max, n)[i]];
  }
  return randomArray;
}
// создаем массив из 8 элементов
// IIFE фукнция
(function createPins(8) {
  var pins = [];
  for (var i = 0; i < 8; i++) {
    var blocWidth = 600; // размер блока ???
    var x = getRandomInt(0, blocWidth); // ограничено размерами блока, в котором перетаскивается метка ???
    var y = getRandomInt(130, 630);
    var location = {x: x, y: y};
    var address = {x: location.x, y: location.y};
    var price = getRandomInt(1000, 1000000);
    var description = ' ';
    var rooms = getRandomInt(1, 5);
    var guests = getRandomInt(1, 3) * rooms;
    var features = getRandomArray(0, 6, FEATURES_ELEMENTS);
    pins[i] = {
      'author': AVATARS[i],
      'offer': {title: TITLES[getUniqueRandoms(0, TITLES.length - 1, 8)[i]], // значения не должны повторяться
        address: address,
        price: price,
        type: TYPES[getRandomInt(0, 3)],
        rooms: rooms,
        guests: guests,
        checkin: CHECKINS[getRandomInt(0, 2)],
        checkout: CHECKOUTS[getRandomInt(0, 2)],
        features: features, // массив строк случайной длины из заданного набора значений
        description: description,
        photos: PHOTOS[getRandomInt(0, 2)]},
      'location': {x: x, y: y}};
  }
  return pins;
})()

// убираем класс  .map--faded у блока .map
var mapItems = document.querySelector('.map');
mapItems.classList.remove('map--faded');

// шаблон для создания метки
var similarPin = document.querySelector('.map__card');
// функция создания DOM-элементов, соответствующих меткам на карте и заполнения их данными из массива
var renderPin = function (pin) {
  var mapElement = similarPin.cloneNode(true);
  mapElement.querySelector('.map').style = 'left: location.x px; top: location.y px';
  mapElement.querySelector('.map').src = pin.author.avatar;
  mapElement.querySelector('.map').alt = pin.title;
};
// добавляем их в блок .map__pins с использованием DocumentFragment
var mapPinList = document.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
for (var i = 0; i < 8; i++) {
  fragment.appendChild(renderPin(pins[i]));
}
mapPinList.appendChild(fragment);
