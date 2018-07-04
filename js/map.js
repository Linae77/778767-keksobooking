'use strict';
var ADS_NUMBER = 8;
var ads = [];
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
// из css
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65;
// var MAIN_PIN_TIP = 22;
var PHOTO_WIDTH = 45;
var PHOTO_HEIGHT = 40;

var ESC_KEYCODE = 27;

// Необходимые элементы
var mapElement = document.querySelector('.map');
var mapFilters = mapElement.querySelector('.map__filters-container');
var mainPinElement = document.querySelector('.map__pin--main');
// шаблон для создания карточки объявления
var cardTemplate = document.querySelector('#pin__template').content.querySelector('.map__card');
var photosListElement = cardTemplate.querySelector('.popup__photos');
var featuresListElement = cardTemplate.querySelector('.popup__features');

var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin__template').content.querySelector('.map__pin');
// элементы формы карточки объявления
var adForm = document.querySelector('.ad-form');
var adFormFieldset = adForm.querySelectorAll('fieldset');
var inputAddress = adForm.querySelector('#address');

// Вспомогательные функции
// Генерация случайного целого в заданном диапазоне
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Генерация массива случайных целых уникальных чисел в заданном диапазоне
var getUniqueRandoms = function (min, max, number) {
  var m = [];
  m[0] = Math.floor(Math.random() * (max - min)) + min;
  for (var i = 1; i < number; i++) {
    m[i] = Math.floor(Math.random() * (max - min)) + min;
    for (var j = 0; j < i; j++) {
      while (m[i] === m[j]) {
        m[i] = Math.floor(Math.random() * (max - min)) + min;
      }
    }
  }
  return m;
};

// Генерация массива случайной длины из элементов заданного массива
var getRandomLengthArray = function (array) {
  var n = getRandomInt(0, array.length); // случайное количество элементов массива
  for (var i = 0, randomArray = []; i < n; i++) {
    randomArray[i] = array[getUniqueRandoms(0, array.length - 1, n)[i]];
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

// Получение типа жилья
var getАccommodationType = function (type) {
  var accommodationType;
  switch (type) {
    case 'flat':
      accommodationType = 'Квартира';
      break;
    case 'bungalo':
      accommodationType =  'Бунгало';
      break;
    case 'house':
      accommodationType =  'Дом';
      break;
    case 'palace':
      accommodationType =  'Дворец';
  }
  return accommodationType
};

// Функция создания основного массива объявлений
var createAdds = function (number) {
  var mainItems = [];
  var TITLES_INDEXES = getUniqueRandoms(0, TITLES.length - 1, 8); // массив уникальных индексов TITLES в случайном порядке
  for (var i = 0; i < number; i++) {
    var x = getRandomInt(300, 900); // ограничено размерами блока, в котором перетаскивается метка
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
        guests: getRandomInt(1, 5),
        checkin: TIMES[getRandomInt(0, TIMES.length - 1)],
        checkout: TIMES[getRandomInt(0, TIMES.length - 1)],
        features: getRandomLengthArray(FEATURES), // массив строк случайной длины из заданного набора значений
        description: '',
        photos: shuffleArray(PHOTOS)},
      location: {x: x, y: y}
    };
  }
  return mainItems;
};

// Функция удаления потомков
var deleteChildElement = function (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  return parent;
};

// Заполнение родительского элемента дочерними
var fillParentElement = function (items, tag, className, parentElement) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < items.length; i++) {
    var item = document.createElement(tag);
    item.className = className;
    fragment.appendChild(item);
  }
  parentElement.appendChild(fragment);
};

// Заполнение списка фотографий в блок .popup__photos
var fillPhotos = function (photos) {
  deleteChildElement(photosListElement);
  fillParentElement(photos, 'img', 'popup__photo', photosListElement);
  for (var i = 0; i < photos.length; i++) {
    photosListElement.children[i].src = photos[i];
    photosListElement.children[i].width = PHOTO_WIDTH;
    photosListElement.children[i].height = PHOTO_HEIGHT;
  }
};

// Заполнение списка преимуществ в блок .popup__feature
var fillFeatures = function (features) {
  deleteChildElement(featuresListElement);
  fillParentElement(features, 'li', 'popup__feature', featuresListElement);
  for (var i = 0; i < features.length; i++) {
    var newFeaturesClass = 'popup__feature--' + features[i];
    featuresListElement.children[i].classList.add(newFeaturesClass);
  }
};

// Получение адреса метки на карте
var getAddress = function () {
  var addressX = Math.round(mainPinElement.style.left + MAIN_PIN_WIDTH / 2);
  var addressY = Math.round(mainPinElement.style.top + MAIN_PIN_HEIGHT / 2);
  var coord = {
    x: addressX,
    y: addressY
  };
  return coord.x + ', ' + coord.y;
};

// Функция создания по шаблону DOM-элемента метки
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

// Заполнение карты DOM-элементами на основе массива с объектами
var fillMap = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderPin(ads[i]));
    mapPins.appendChild(fragment);
  }
};

// Функция помещения объявления в разметку (показа на карте)
// открываем соответствующее объявление, закрываем предыдущее открытое при наличии
var openMapCard = function (ad) {
  getАccommodationType(ad);
  fillFeatures(ad, ad.offer.features);
  fillPhotos(ad, ad.offer.photos);
  var mapCardElement = mapElement.querySelector('.map__card');
  if (mapCardElement) {
    closeMapCard();
  }
  var fragment = document.createDocumentFragment();
  fragment.appendChild(createMapCard(ad));
  mapElement.insertBefore(createMapCard(ad), mapFilters);
};

// Функция создания DOM-элемента объявления
var createMapCard = function (ad) {
  var mapCardElement = cardTemplate.cloneNode(true);
  mapCardElement.querySelector('.popup__title').textContent = ad.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  mapCardElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после' + ad.offer.checkin + ', выезд до' + ad.offer.checkout;
  mapCardElement.querySelector('.popup__description').textContent = ad.offer.description;
  mapCardElement.querySelector('.popup__avatar').src = ad.author.avatar;
  var popupCloseElement = mapCardElement.querySelector('.popup__close');
  popupCloseElement.addEventListener('click', function () {
    closeMapCard();
  });
  document.addEventListener('keydown', onMapCardEscPress);
  return mapCardElement;
};

// Закрытие формы с объявлением
var closeMapCard = function () {
  var mapCardElement = mapElement.querySelector('.map__card');
  mapElement.removeChild(mapCardElement);
  document.removeEventListener('keydown', onMapCardEscPress);
};

// Закрытие формы по нажатию на esc
var onMapCardEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeMapCard();
  }
};

// Функция активации карты
var activateMap = function () {
  mapElement.classList.remove('map--faded');
};

// Функция активации формы объявления
var activateForm = function () {
  adForm.classList.remove('ad-form--disabled');
  adFormFieldset.forEach(function (item) {
    item.removeAttribute('disabled');
  });
};

// Изначальное состояние карты - добавляем полям атрибут disabled
var disableForm = function () {
  adFormFieldset.forEach(function (item) {
    item.setAttribute('disabled', 'disabled');
  });
};
disableForm();
// Cоздаем массив объявлений
ads = createAdds(ADS_NUMBER);
// Обработчик события - перемещения главной метки
var onMoveMouseupHandler = function () {
  activateMap();
  activateForm();
  inputAddress.value = getAddress();
  fillMap();
  mainPinElement.removeEventListener('mouseup', onMoveMouseupHandler);
};
// Обработчик, активирующий страницу
mainPinElement.addEventListener('mouseup', onMoveMouseupHandler);
