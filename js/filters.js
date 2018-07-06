'use strict';

(function () {
  var Price = {
    MIDDLE: 'middle',
    LOW: 'low',
    HIGH: 'high'
  };

  var ANY_VALUE = 'any';

  var ads = [];
  var filteredAds = [];
  var filtersBlock = document.querySelector('.map__filters');
  var filterType = filtersBlock.querySelector('#housing-type');
  var filterPrice = filtersBlock.querySelector('#housing-price');
  var filterRooms = filtersBlock.querySelector('#housing-rooms');
  var filterGuests = filtersBlock.querySelector('#housing-guests');
  var filterFeatures = filtersBlock.querySelector('#housing-features');
  // var selectFilterElements = filtersBlock.querySelectorAll('select');
  // var inputFilterElements = filtersBlock.querySelectorAll('input');

  // Начальное состояние фильтров, состояние после сброса
  var disableFilters = function () {
    Array.from(filtersBlock.elements).forEach(function (item) {
      item.disabled = true;
    });
    filtersBlock.removeEventListener('change', filtersChangeHandler);
  };

  disableFilters();

  // Переключение фильтров в активное состояние
  var activateFilters = function () {
    Array.from(filtersBlock.elements).forEach(function (item) {
      item.disabled = false;
    });
    filtersBlock.addEventListener('change', filtersChangeHandler);
  };

  // Проверка соответствия значения фильтра и полей объявлений по значению атрибута value у select
  var filterByValue = function (selectElement, key) {
    if (selectElement.value === ANY_VALUE) {
      return filteredAds;
    }
    filteredAds = filteredAds.filter(function (ad) {
      return ad.offer[key].toString() === selectElement.value;
    });
    return filteredAds;
  };

  // Проверка соотвествия значения фильтра значению цены объявления
  var checkPrice = function (item) {
    var priceLimits = {
      'middle': item.offer.price >= Price.LOW && item.offer.price <= Price.HIGH,
      'low': item.offer.price < Price.LOW,
      'high': item.offer.price > Price.HIGH
    };
    return priceLimits[filterPrice.value];
  };

  // Фильтрация массива объявлений по уровню цены
  var filterByPrice = function (item) {
    return checkPrice(item) || filterPrice.value === ANY_VALUE;
  };

  // Фильтрация по удобствам
  var filterByFeatures = function () {
    var filterFeaturess = filterFeatures.querySelectorAll('input:checked');
    for (var i = 0; i < filterFeaturess.length; i++) {
      filteredAds = filteredAds.filter(function (ad) {
        return ad.offer.features.includes(filterFeaturess[i].value);
      });
    }
    return filteredAds;
  };

  // Фильтрация по всем параметрам
  var filtersChangeHandler = function () {
    filterByValue(filterType, 'type');
    filterByValue(filterRooms, 'rooms');
    filterByValue(filterGuests, 'guests');
    filterByPrice();
    filterByFeatures();
    return filteredAds;
  };

  // Отображение результата фильтрации
  var updateAds = function () {
    filteredAds = ads.slice();
    window.pin.removeActiveClass();
    window.pin.remove();
    window.popup.closeIfOpen();
    filtersChangeHandler();
    window.pin.render(filteredAds);
  };

  var filtersBlockChangeHandler = function () {
    window.debounce(updateAds);
  };

  filtersBlock.addEventListener('change', filtersBlockChangeHandler);

  // Обработчик успешной загрузки данных для отрисовки меток похожих объявлений
  var successHandler = function (data) {
    ads = data;
    window.pins.render(ads);
    activateFilters();
  };

  // Обработчик ошибки
  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0; text-align: center; background-color: rgba(0, 204, 255, 0.5)';
    node.style.position = 'absolute';
    node.style.left = '0';
    node.style.right = '0';
    node.style.fontZixe = '24px';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    var closeErrorMessage = function () {
      document.body.removeChild(node);
    };

    setTimeout(closeErrorMessage, 10000);
  };
  window.filters = {
    activateFilters: activateFilters,
    disableFilters: disableFilters,
    successHandler: successHandler,
    errorHandler: errorHandler
  };-
})();
