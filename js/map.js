'use strict';
var CARD_NUMBER = 8;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var TITLES = ['Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var HOUSE_TYPES = {
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  flat: 'Квартира'
};

var PRICE_PLACEHOLDERS = {
  'Бунгало': 0,
  'Квартира': 1000,
  'Дом': 5000,
  'Дворец': 10000,
};

// нахождение некоторых элементов
var adForm = document.querySelector('.ad-form');
var inputAddress = document.querySelector('#address');
var fieldsets = adForm.querySelectorAll('fieldset');

var map = document.querySelector('.map');
var mapPinMain = map.querySelector('.map__pin--main');
var mapFiltersContainer = map.querySelector('.map__filters-container');

var pins = document.querySelector('.map__pins');

var mainTemplate = document.querySelector('#ad-template');
var template = document.querySelector('template');
var templateCard = template.querySelector('.map__card');
var templatePin = template.content.querySelector('.map__pin');




/*
var noticeSection = document.querySelector('.notice');
var title = noticeSection.querySelector('#title');
var formFieldsets = noticeSection.querySelectorAll('fieldset');
var formInputs = noticeSection.querySelectorAll('input');
var typeAccomodation = noticeSection.querySelector('#type');
var priceForm = noticeSection.querySelector('#price');
var address = noticeSection.querySelector('#address'); //
var timeOut = noticeSection.querySelector('#timeout');
var timeIn = noticeSection.querySelector('#timein');
var capacity = noticeSection.querySelector('#capacity');
var roomNumber = noticeSection.querySelector('#room_number');
var description = noticeSection.querySelector('#description');
var features = noticeSection.querySelector('.features');

var successPopup = document.querySelector('.success');
var adFormReset = noticeSection.querySelector('.ad-form__reset');

var pageState = false;

 //


*/
// вспомогательные функции
// дезактивирует поля формы
(function disableForm() {
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].setAttribute('disabled', '');
  }
})();
// активирует поля формы
var acivateForm = function () {
  for (var j = 0; j < fieldsets.length; j++) {
    fieldsets[j].removeAttribute('disabled', '');
  }
};

// получает координаты указателя и выводит в неактивную страницу
var  getMainPinCoordinats = function () {
  var mapPinMainLeft = mapPinMain.style.left;
  var mapPinMainTop = mapPinMain.style.top;
  var mapPinMainWidth = mapPinMain.offsetWidth;
  var mapPinMainHeight = mapPinMain.offsetHeight;
  var inputAddressLeft = +mapPinMainLeft.substr(0, mapPinMainLeft.length - 2) + mapPinMainWidth / 2;
  var inputAddressTop = +mapPinMainTop.substr(0, mapPinMainTop.length - 2) + mapPinMainHeight;
  inputAddress.value = inputAddressLeft + ', ' + inputAddressTop;
};
getMainPinCoordinats();

// показывает пины
var showPins = function () {
  for (var i = 0; i < mapPin.length; i++) {
    mapPin[i].classList.remove('hidden');
  }
};

// функция перевода страницы в активный режим
var onMapPinMainMouseUp = function () {
  map.classList.remove('map--faded');
  showPins();
  // удаляет плашку с формы
  adForm.classList.remove('ad-form--disabled');
  // вызов функции активации формы
  acivateForm();
  // получает новые координаты и выводит в активную страницу
  getMainPinCoordinats();
};
// обработчик события на главном пине - активация страницы
mapPinMain.addEventListener('mouseup', onMapPinMainMouseUp);


// генерация случайного целого числа
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// генерация случайного массива из заданного
var getRandomArray = function (array) {
  var newArray = array.slice();
  var finalArray = [];
  array.forEach(function () {
    var randomIndex = getRandomInt(0, newArray.length - 1);
    finalArray.push(newArray.splice(randomIndex, 1)[0]);
  });
  return finalArray;
};

// функция создания основного массива
var createObjects = function (number) {
  var objects = [];
  var obj = {};
  var numbersAvatar = [];
  for (var j = 0; j < number; j++) {
    numbersAvatar[j] = j + 1;
  }
  // перемешиваю массив цифр адресов изображений аватара
  getRandomArray(numbersAvatar);
  // перемешиваю массив titles
  getRandomArray(TITLES);
  for (var i = 0; i < number; i++) {
    // создаю пустой объект
    obj.author = {};
    obj.offer = {};
    obj.location = {};
    // заполняю объект данными
    (numbersAvatar[i] <= 9) ? (obj.author.avatar = 'img/avatars/user0' + numbersAvatar[i] + '.png') :
      (obj.author.avatar = 'img/avatars/user' + numbersAvatar[i] + '.png');
    obj.offer.title = TITLES[i];
    obj.location.x = getRandomInt(300, 900);
    obj.location.y = getRandomInt(130, 630);
    obj.offer.address = obj.location.x + ', ' + obj.location.y;
    obj.offer.price = getRandomInt(1000, 1000000);
    obj.offer.type = TYPES[getRandomInt(0, TYPES.length - 1)];
    obj.offer.rooms = getRandomInt(1, 5);
    obj.offer.guests = getRandomInt(1, 8);
    obj.offer.checkin = CHECK_TIMES[getRandomInt(0, CHECK_TIMES.length - 1)];
    obj.offer.checkout = obj.offer.checkin;

    var NEW_FEATURES = FEATURES.slice();
    getRandomArray(NEW_FEATURES);
    NEW_FEATURES.length = getRandomInt(0, NEW_FEATURES.length);
    obj.offer.features = NEW_FEATURES;

    obj.offer.description = '';
    var NEW_PHOTOS = PHOTOS.slice();
    obj.offer.photos = getRandomArray(NEW_PHOTOS);
    objects.push(obj);
  }
  return objects;
};
// создаем массив из 8 объектов
var offers = createObjects(CARD_NUMBER);

// генерация метки
var renderPin = function (pin) {
  var pinElement = templatePin.cloneNode(true);
  var mapPinWidth = 50;
  var mapPinHeight = 70;
  pinElement.style.left = pin.location.x - mapPinWidth / 2 + 'px';
  pinElement.style.top = pin.location.y - mapPinHeight + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;
  return pinElement;
};

// IIFE функция добавления меток в DOM методом DocumentFragment
(function = addPins () {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < offers.length; i++) {
    fragmentPin.appendChild(renderPin(offers[i]));
  }
  pins.appendChild(fragmentPin);
})();

var getAd = function (array) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(renderAd(array));
  map.insertBefore(fragment, container);
};

// создаёт список фич
var renderFeatures = function (arrFeatures) {
  var fragmentFeatures = document.createDocumentFragment();
  var newFeatureElement;

  for (var i = 0; i < arrFeatures.length; i++) {
    newFeatureElement = document.createElement('li');
    newFeatureElement.className = 'popup__feature popup__feature--' + arrFeatures[i];
    fragmentFeatures.appendChild(newFeatureElement);
  }
  return fragmentFeatures;
};

// создаёт список фоток
var renderPhotos = function (arrPhotos) {
  var photosContainer = document.createDocumentFragment();
  var templatePhoto = template.content.querySelector('.popup__photo');

  for (var i = 0; i < arrPhotos.length; i++) {
    var photoElement = templatePhoto.cloneNode(true);
    photoElement.src = arrPhotos[i];
    photosContainer.appendChild(photoElement);
  }
  return photosContainer;
};

// заполняет карточки объявлений: заголовок, адрес, цену, другие характеристики
var renderCard = function (renderObj) {
  var card = templateCard.cloneNode(true);

  card.querySelector('.popup__title').textContent = renderObj.offer.title;
  card.querySelector('.popup__text--address').textContent = renderObj.offer.address;
  card.querySelector('.popup__text--price').textContent = renderObj.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = HOUSE_TYPES[renderObj.offer.type];
  card.querySelector('.popup__text--capacity').textContent = renderObj.offer.rooms + ' комнаты для ' + renderObj.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + renderObj.offer.checkin + ', выезд до ' + renderObj.offer.checkout;
  card.querySelector('.popup__features').innerHTML = '';
  card.querySelector('.popup__features').appendChild(renderFeatures(renderObj.offer.features));
  card.querySelector('.popup__description').textContent = renderObj.offer.description;
  card.querySelector('.popup__photos').innerHTML = '';
  card.querySelector('.popup__photos').appendChild(renderPhotos(renderObj.offer.photos));
  card.querySelector('.popup__avatar').src = renderObj.author.avatar;

  return card;
};

// создаём карточку при клике на пин
var renderFinalcard = function (evt) {
  var currentImg = evt.currentTarget.querySelector('img');
  var srcFrom = currentImg.src.search('img/avatars/user');
  var srcTo = currentImg.src.length;
  var currentSrc = currentImg.src.substr(srcFrom, srcTo);
  var articleСard = map.querySelector('article');

  for (var i = 0; i < offers.length; i++) {
    if (currentSrc === offers[i].author.avatar) {
      if (!articleСard) {
        map.insertBefore(renderCard(offers[i]), mapFiltersContainer);
      } else {
        articleСard.remove();
        map.insertBefore(renderCard(offers[i]), mapFiltersContainer);
      }
    }
  }
};

// вешает обработчик на все пины и скрывает их
var mapPin = map.querySelectorAll('button[type=button]');
for (var i = 0; i < mapPin.length; i++) {
  mapPin[i].classList.add('hidden');
  mapPin[i].addEventListener('click', renderFinalcard);
}

// вешает обработчик на карту и отлавливает клик по крестику
var onMapClick = function (evt) {
  var cardClose = map.querySelector('.popup__close');
  var articleСard = map.querySelector('article');
  if (evt.target === cardClose) {
    articleСard.remove();
  }
};
map.addEventListener('click', onMapClick);
//
//
//
'use strict';

var ESC_KEYCODE = 27;
var AMOUNT_OF_ADS = 8;
var housePhoto = {
  WIDTH: 45,
  HEIGHT: 45
};
var offers = {
  TITLES: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  TYPES: ['palace', 'flat', 'house', 'bungalo'],
  CHECK_TIME: ['12:00', '13:00', '14:00'],
  FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  PHOTOS: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
};
var houseLocation = {
  X: {
    MIN: 300,
    MAX: 900
  },
  Y: {
    MIN: 130,
    MAX: 630
  }
};
var roomsAmount = {
  MIN: 1,
  MAX: 5
};
var guestsAmount = {
  MIN: 1,
  MAX: 5
};
var price = {
  MIN: 1000,
  MAX: 1000000
};
var pinSize = {
  WIDTH: 70,
  HEIGHT: 50
};
var adsArray = [];
var pinsArray = [];
var offerTypesTranslation = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};

var mainTemplate = document.querySelector('#ad-template');
var map = document.querySelector('.map');
var cardTemplate = mainTemplate.content.querySelector('.map__card');
var container = document.querySelector('.map__filters-container');
var mainPin = document.querySelector('.map__pin--main');
var mapPinsBlock = document.querySelector('.map__pins');
var mapPin = mainTemplate.content.querySelector('.map__pin');
var mainForm = document.querySelector('.ad-form');
var addressInput = mainForm.querySelector('#address');
var fieldsets = mainForm.getElementsByTagName('fieldset');
var activeCard = map.querySelector('.map__card');
var mainPinProperties = {
  'position': {
    'X': mainPin.offsetTop,
    'Y': mainPin.offsetLeft
  },
  'WIDTH': 65,
  'HEIGHT': 65,
  'TAIL': 22
};

var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomIndex = function (arr) {
  return arr[getRandomInteger(0, arr.length - 1)];
};

var shuffleArr = function (array) {
  for (var i = 0; i < array.length; i++) {
    var randomIndex = getRandomInteger(0, array.length - 1);
    var j = array[randomIndex];

    array[randomIndex] = array[array.length - 1];
    array[array.length - 1] = j;
  }
  return array.slice();
};

var getRandomLengthOfArray = function (array) {
  return array.splice(0, getRandomInteger(1, array.length));
};

var getPlurals = function (number, titles) {
  var cases = [2, 0, 1, 1, 1, 2];
  return titles [(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

var getAvatarPath = function (path) {
  return 'img/avatars/user' + path + '.png';
};

var createAd = function (i) {

  var locationX = getRandomInteger(houseLocation.X.MIN, houseLocation.X.MAX);
  var locationY = getRandomInteger(houseLocation.Y.MIN, houseLocation.Y.MAX);
  var avatarPath = i >= 9 ? (i + 1) : '0' + (i + 1);

  return {
    'author': {
      'avatar': getAvatarPath(avatarPath)
    },

    'offer': {
      'title': getRandomIndex(offers.TITLES),
      'address': locationX + ', ' + locationY,
      'price': getRandomInteger(price.MIN, price.MAX),
      'type': getRandomIndex(offers.TYPES),
      'rooms': getRandomInteger(roomsAmount.MIN, roomsAmount.MAX),
      'guests': getRandomInteger(guestsAmount.MIN, guestsAmount.MAX),
      'checkin': getRandomIndex(offers.CHECK_TIME),
      'checkout': getRandomIndex(offers.CHECK_TIME),
      'features': getRandomLengthOfArray(shuffleArr(offers.FEATURES)),
      'description': '',
      'photos': shuffleArr(offers.PHOTOS)
    },

    'location': {
      'x': locationX,
      'y': locationY
    }
  };
};

var getAd = function (array) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(renderAd(array));
  map.insertBefore(fragment, container);
};

var renderPin = function (array) {
  if (pinsArray.length < AMOUNT_OF_ADS) {
    var pinElement = mapPin.cloneNode(true);
    var pinImg = pinElement.querySelector('img');

    var style = {
      top: 'top:' + (array.location.y - pinSize.HEIGHT / 2) + 'px;',
      left: 'left:' + (array.location.x - pinSize.WIDTH) + 'px;'
    };

    pinElement.style = style.top + style.left;
    pinImg.src = array.author.avatar;
    pinImg.alt = array.offer.title;

    pinElement.addEventListener('click', function () {
      getAd(array);
    });

    pinsArray.push(pinElement);

    mapPinsBlock.appendChild(pinElement);
  }
};

var getFeature = function (arr) {
  var tagName = document.createElement('li');
  tagName.classList.add('popup__feature', 'popup__feature--' + arr);
  return tagName;
};

var getPhoto = function () {
  var tagName = document.createElement('img');
  tagName.classList.add('popup__photo');
  tagName.width = housePhoto.WIDTH;
  tagName.height = housePhoto.HEIGHT;
  tagName.alt = 'Фотография жилья';
  return tagName;
};

var renderAd = function (card) {
  if (activeCard !== null) {
    removeAdCard();
  }

  var adElement = cardTemplate.cloneNode(true);
  activeCard = adElement;
  var rooms = card.offer.rooms;
  var guests = card.offer.guests;
  var closeAdBtn = adElement.querySelector('.popup__close');

  adElement.querySelector('.popup__avatar').src = card.author.avatar;
  adElement.querySelector('.popup__title').textContent = card.offer.title;
  adElement.querySelector('.popup__text--address').textContent = card.offer.address;
  adElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = offerTypesTranslation[card.offer.type];
  adElement.querySelector('.popup__text--capacity').textContent = rooms + ' ' + getPlurals(rooms, ['комната', 'комнаты', 'комнат']) + ' для ' + guests + ' ' + getPlurals(guests, ['гостя', 'гостей', 'гостей']);
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

  for (var featureIndex = 0; featureIndex < card.offer.features.length; featureIndex++) {
    adElement.querySelector('.popup__features').appendChild(getFeature(card.offer.features[featureIndex]));
  }

  adElement.querySelector('.popup__description').textContent = card.offer.description;

  for (var photoIndex = 0; photoIndex < card.offer.photos.length; photoIndex++) {
    adElement.querySelector('.popup__photos').appendChild(getPhoto(card.offer.photos[photoIndex])).src = card.offer.photos[photoIndex];
  }

  closeAdBtn.addEventListener('click', removeAdCard);

  document.addEventListener('keydown', removeAdCardWithEsc);

  return adElement;
};

var getAdsArray = function (amount) {
  for (var i = 0; i < amount; i++) {
    adsArray[i] = createAd(i);
    renderPin(adsArray[i]);
  }
};

var removeAdCard = function () {
  activeCard.remove();
  document.removeEventListener('keydown', removeAdCardWithEsc);
};

var removeAdCardWithEsc = function (evt) {
  if (evt.keyCode === ESC_KEYCODE && activeCard !== null) {
    removeAdCard();
    document.removeEventListener('keydown', removeAdCardWithEsc);
  }
};

var disabledForm = function () {
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = true;
  }
};

var activateForm = function () {
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = false;
  }
  mainForm.classList.remove('ad-form--disabled');
};

var activatePage = function () {
  map.classList.remove('map--faded');
  getAdsArray(AMOUNT_OF_ADS);
  activateForm();
  getMainPinProperties(mainPinProperties.TAIL);
};

var getMainPinProperties = function (tail) {

  var mainPinPositionX = Math.round(mainPinProperties.position.X + mainPinProperties.WIDTH / 2);
  var mainPinPositionY = Math.round(mainPinProperties.position.Y + (mainPinProperties.HEIGHT / 2 + tail));

  addressInput.value = mainPinPositionY + ', ' + mainPinPositionX;
};

mainPin.addEventListener('mouseup', activatePage);

getMainPinProperties(0);

disabledForm();



