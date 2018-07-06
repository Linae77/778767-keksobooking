'use strict';

(function () {
  var PHOTO_WIDTH = 45;
  var PHOTO_HEIGHT = 40;
  // Шаблон для создания карточки объявления
  var cardTemplate = document.querySelector('#pin__template').content.querySelector('.map__card');
  var mapFilters = mapElement.querySelector('.map__filters-container');
  var mapElement = window.data.mapElement;
  var mapCardElement = document.querySelector('.map__card');
  var ESC_KEYCODE = 27;

  // Закрытие карточки объявления по нажатию на esc
  var onCardEscPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.card.close();
    }
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

  // Функция создания по шаблону DOM-элемента объявления
  var renderMapCard = function (ad) {
    getАccommodationType(ad.offer.type);
    fillFeatures(ad.offer.features);
    fillPhotos(ad.offer.photos);
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
      window.card.close();
    });
    document.addEventListener('keydown', window.onCardEscPressHandler);
    return mapCard;
  };

  // Функция помещения объявления в разметку: открываем объявление, закрываем ранее открытое при наличии
  var openMapCard = function (ad) {
    if (mapCardElement) {
      window.card.close();
    }
    mapElement.insertBefore(renderMapCard(ad), mapFilters);
  };

  // Закрытие формы с объявлением
  var closeMapCard = function () {
    mapElement.removeChild(mapCardElement);
    document.removeEventListener('keydown', window.onCardEscPressHandler);
  };

  window.card = {
    mapCardElement: mapCardElement,
    open: openMapCard,
    close: closeMapCard,
    onCardEscPressHandler: onCardEscPressHandler
  };
})();
