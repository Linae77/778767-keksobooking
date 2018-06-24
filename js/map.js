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
  'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var CARD_NUMBER = 8;

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var getUniqueRandoms = function (min, max, number) {
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

var getRandomArray = function (min, max, arrElements) {
  var n = getRandomInt(min, max); // случайное количество элементов массива
  for (var i = 0, randomArray = []; i < n; i++) {
    randomArray[i] = arrElements[getUniqueRandoms(min, max, n)[i]];
  }
  return randomArray;
}
// функция создания основного массив
var createItems = function (number) {
  var mainItems = [];
  for (var i = 0; i < number; i++) {
    var x = getRandomInt(300, 900); // ограничено размерами блока, в котором перетаскивается метка ???
    var y = getRandomInt(130, 630);
    mainItems[i] = {
      author: {avatar: AVATARS[i]},
      offer: {title: TITLES[getUniqueRandoms(0, TITLES.length - 1, 8)[i]], // значения не должны повторяться
        address: x + ',' + y,
        price: getRandomInt(1000, 1000000),
        type: TYPES[getRandomInt(0, 3)],
        rooms: getRandomInt(1, 5),
        guests: getRandomInt(1, 5),
        checkin: TIMES[getRandomInt(0, 2)],
        checkout: TIMES[getRandomInt(0, 2)],
        features: getRandomArray(1, 6, FEATURES_ELEMENTS), // массив строк случайной длины из заданного набора значений
        description: '',
        photos: getRandomArray(1, 3, PHOTOS)},
      location: {x: x, y: y}
    };
  }
  return mainItems;
};
// создаем массив
var offers = createItems(CARD_NUMBER);
// убираем класс  .map--faded у блока .map
var map = document.querySelector('.map');
map.classList.remove('map--faded');

var template = document.querySelector('.map__card'); // шаблон для создания метки
// функция создания по шаблону и заполнения DOM-элемента
var renderOffer = function (item) {
  var mapElement = template.cloneNode(true);
  mapElement.querySelector('.map').style.left = item.location.x + 'px';
  mapElement.querySelector('.map').style.top = item.location.y + 'px';
  mapElement.querySelector('.map').src = item.author.avatar;
  mapElement.querySelector('.map').alt = item.offer.title;
};
// функция добавления созданных элементов в блок1 перед блоком2 с использованием DocumentFragment
var addElementsDOM = function (items, block1, block2) {
  var block1List = document.querySelector(block1);
  var fragment = document.createDocumentFragment();
  for (i = 0; i < items.length; i++) {
    fragment.appendChild(renderOffer(items[i]));
  };
  if exists(blok2)
  {
    var block2List = document.querySelector(block2);
    block2List.insertBefore(fragment, block1List);
  }
  else
  {
    block1List.appendChild(fragment);
  }
};
// добавляем созданные DOM-элементы в блок .map__pin
addElementsDOM(offers, '.map__pin');

// выводим заголовок объявления, адрес, цену, другие свойства первого элемента массива
var mapElement = template.cloneNode(true);
mapElement.querySelector('.popup__title').textContent = offers[0].offer.title;
mapElement.querySelector('.popup__text--address').textContent = offers[0].offer.address;
mapElement.querySelector('.popup__text--price').textContent = offers[0].offer.price + ' р/ночь';

var getTypeRoom = function (offersType) {
  var accommodationType;
  switch (offersType) {
    case 'flat': accommodationType = 'Квартира';
    case 'bungalo': accommodationType = 'Бунгало';
    case 'house': accommodationType = 'Дом';
    case 'palace': accommodationType = 'Дворец';
  }
  return accommodationType;
};
mapElement.querySelector('.popup__type').textContent = getTypeRoom(offers[0].offer.type);
mapElement.querySelector('.popup__text--capacity').textContent = offers[0].offer.rooms + ' комнаты для ' + offers[0].offer.guests + ' гостей';
mapElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offers[0].offer.checkin + ', выезд до ' + offers[0].offer.checkout;
mapElement.querySelector('.popup__features').textContent = offers[0].offer.features;
mapElement.querySelector('.popup__description').textContent = offers[0].offer.description;
// в блок .popup__photos выводим все фотографии из списка offer.photos как src соответствующего изображения
var getAllPhotos = function (arrayPhotos) {
  for (var i = 0; i < arrayPhotos.length; i++) {
    var templatePhoto = mapElement.querySelector('.popup__photos').cloneNode(true);
    templatePhoto.src = arrayPhotos[i];
  }
};
getAllPhotos(offers[0].offer.photos);
//
mapElement.querySelector('.popup__avatar').src = offers[0].author.avatar;

// вставляем полученный на основе первого элемента массива DOM-элемент в блок .map перед блоком .map__filters-container:
addElementsDOM(offers[0], '.map', '.map__filters-container');
