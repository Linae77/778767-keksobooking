'use strict';

(function () {
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

  // Элементы формы карточки объявления

  var adForm = window.data.adForm;

  var inputTitleFormElement = adForm.querySelector('#title');
  var inputTypeFormElement = adForm.querySelector('#type');
  var inputPriceFormElement = adForm.querySelector('#price');
  var inputTimeInFormElement = adForm.querySelector('#timein');
  var inputTimeOutFormElement = adForm.querySelector('#timeout');
  var inputRoomsFormElement = adForm.querySelector('#room_number');
  var inputCapacityFormElement = adForm.querySelector('#capacity');
  var resetElement = adForm.querySelector('.ad-form__reset');

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

  resetElement.addEventListener('click', function () {
    window.map.inactivateMap();
    window.map.getAddress();
    window.pin.clearMap();
    if (window.card.mapCardElement) {
      window.map.closeMapCard();
    }
    adForm.reset();
  });

})();

