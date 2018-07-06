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
var MAIN_PIN_TIP = 22;
var PHOTO_WIDTH = 45;
var PHOTO_HEIGHT = 40;

var ESC_KEYCODE = 27;

var RENT_VALUE = {
  flat: {
    min: 1000,
    max: 1000000,
    placeholder: 1000
  },
  house: {
    min: 5000,
    max: 1000000,
    placeholder: 5000
  },
  palace: {
    min: 10000,
    max: 1000000,
    placeholder: 10000
  },
  bungalo: {
    min: 0,
    max: 1000000,
    placeholder: 0
  }
};
var COORD_X_MIN = 0;
var COORD_X_MAX = 1200;
var COORD_Y_MIN = 130;
var COORD_Y_MAX = 630;


// Необходимые элементы
var mapElement = document.querySelector('.map');
var mapFilters = mapElement.querySelector('.map__filters-container');
var mainPinElement = document.querySelector('.map__pin--main');
var mapCardElement = document.querySelector('.map__card');
// Шаблон для создания карточки объявления
var cardTemplate = document.querySelector('#pin__template').content.querySelector('.map__card');
// Шаблон для создания меток на карте
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin__template').content.querySelector('.map__pin');

// Элементы формы карточки объявления
var adForm = document.querySelector('.ad-form');
var adFormFieldset = adForm.querySelectorAll('fieldset');
var inputAddress = adForm.querySelector('#address');
var inputTitleFormElement = adForm.querySelector('#title');
var inputTypeFormElement = adForm.querySelector('#type');
var inputPriceFormElement = adForm.querySelector('#price');
var inputTimeInFormElement = adForm.querySelector('#timein');
var inputTimeOutFormElement = adForm.querySelector('#timeout');
var inputRoomsFormElement = adForm.querySelector('#room_number');
var inputCapacityFormElement = adForm.querySelector('#capacity');

var resetElement = adForm.querySelector('.ad-form__reset');

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
      accommodationType = 'Бунгало';
      break;
    case 'house':
      accommodationType = 'Дом';
      break;
    case 'palace':
      accommodationType = 'Дворец';
  }
  return accommodationType;
};

// Функция создания основного массива объявлений
var renderAds = function () {
  var number = ADS_NUMBER;
  var mainItems = [];
  var TITLES_INDEXES = getUniqueRandoms(0, TITLES.length - 1, 8); // массив уникальных индексов TITLES в случайном порядке
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
  var photosListElement = cardTemplate.querySelector('.popup__photos');
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
  var featuresListElement = cardTemplate.querySelector('.popup__features');
  deleteChildElement(featuresListElement);
  fillParentElement(features, 'li', 'popup__feature', featuresListElement);
  for (var i = 0; i < features.length; i++) {
    var newFeaturesClass = 'popup__feature--' + features[i];
    featuresListElement.children[i].classList.add(newFeaturesClass);
  }
};

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

// Заполнение карты DOM-элементами на основе массива с объектами
var fillMap = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderPin(ads[i]));
    mapPins.appendChild(fragment);
  }
};

// Функция создания по шаблону DOM-элемента объявления
var renderMapCard = function (ad) {
  var mapCard = cardTemplate.cloneNode(true);
  mapCard.querySelector('.popup__title').textContent = ad.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = ad.offer.address;
  mapCard.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  mapCard.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после' + ad.offer.checkin + ', выезд до' + ad.offer.checkout;
  mapCard.querySelector('.popup__description').textContent = ad.offer.description;
  mapCard.querySelector('.popup__avatar').src = ad.author.avatar;
  var popupCloseElement = mapCard.querySelector('.popup__close');
  popupCloseElement.addEventListener('click', function () {
    closeMapCard();
  });
  document.addEventListener('keydown', onMapCardEscPress);
  return mapCard;
};

// Функция помещения объявления в разметку: открываем объявление, закрываем ранее открытое при наличии
var openMapCard = function (ad) {
  getАccommodationType(ad.offer.type);
  fillFeatures(ad.offer.features);
  fillPhotos(ad.offer.photos);
  if (mapCardElement) {
    closeMapCard();
  }
  mapElement.insertBefore(renderMapCard(ad), mapFilters);
};

// Закрытие формы с объявлением
var closeMapCard = function () {
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

// Валидация формы
// Добавление рамки невалидным полям
var fieldInvalidHandler = function (evt) {
  var target = evt.target;
  target.classList.add('invalid');
  checkValidity();
};

// Проверка на валидность поля
var checkValidity = function () {
  var checkedField = adForm.querySelector('.invalid');
  if (checkedField.validity.valid) {
    checkedField.classList.remove('invalid');
  }
};

// Установка обязательных полей
var setFieldsRequired = function () {
  inputTitleFormElement.required = true;
  inputPriceFormElement.required = true;
};

// Изменение значения минимальной цены и плейсхолдера в зависимости от типа жилья
var setPrice = function () {
  var offerType = inputTypeFormElement.value;
  inputPriceFormElement.min = RENT_VALUE[offerType].min;
  inputPriceFormElement.max = RENT_VALUE[offerType].max;
  inputPriceFormElement.placeholder = RENT_VALUE[offerType].placeholder;
};

// Синхронизация количества комнат и количества гостей
var checkRoomsAndGuests = function () {
  if ((inputRoomsFormElement.value === '100') && (inputCapacityFormElement.value !== '0')) {
    inputCapacityFormElement.setCustomValidity('Не для гостей!');
  } else if ((inputRoomsFormElement.value !== '100') && (inputCapacityFormElement.value === '0')) {
    inputCapacityFormElement.setCustomValidity('Выберите корректный вариант!');
  } else if (inputRoomsFormElement.value < inputCapacityFormElement.value) {
    inputCapacityFormElement.setCustomValidity('Недостаточное кол-во комнат для размещения гостей');
  } else {
    inputCapacityFormElement.setCustomValidity('');
  }
};

// Синхронизация времени заезда и выезда
var synchronizeTime = function (targetElement, mainElement) {
  targetElement.value = mainElement.value;
};

// Обработчики событий изменения полей формы и проверка на валидность
inputCapacityFormElement.addEventListener('change', function () {
  checkRoomsAndGuests();
  checkValidity();
});

inputRoomsFormElement.addEventListener('change', function () {
  checkRoomsAndGuests();
  checkValidity();
});

inputTypeFormElement.addEventListener('change', setPrice);
inputTimeInFormElement.addEventListener('change', function () {
  synchronizeTime(inputTimeOutFormElement, inputTimeInFormElement);
});

inputTimeOutFormElement.addEventListener('change', function () {
  synchronizeTime(inputTimeInFormElement, inputTimeOutFormElement);
});

inputTitleFormElement.addEventListener('change', function () {
  checkValidity();
});

inputTypeFormElement.addEventListener('change', function () {
  setFieldsRequired();
  setPrice();
  checkValidity();
});

inputPriceFormElement.addEventListener('change', function () {
  checkValidity();
});

adForm.addEventListener('invalid', fieldInvalidHandler, true);

// Удаление меток похожих объявлений с карты
var clearMap = function () {
  var pinElement = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
  for (var i = 0; i < pinElement.length; i++) {
    mapPins.removeChild(pinElement[i]);
  }
};

resetElement.addEventListener('click', function () {
  inactivateMap();
  getAddress();
  clearMap();
  if (mapCardElement) {
    closeMapCard();
  }
  adForm.reset();
});

// Функция приведения страницы в начальное состояние
var initiatePage = function () {
  ads = renderAds(ADS_NUMBER);
  inactivateMap();
  getAddress();
};

initiatePage();
