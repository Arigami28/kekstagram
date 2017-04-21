'use strict';
window.utils = (function () {
  return {

    // генерация  номера случайного элемента массива
    getRandomItemAray: function (array) {
      return Math.floor(Math.random() * array.length);
    },

    // Нажатие клавиш
    onKeyPress: function (keyCode, callback) {
      return function (evt) {
        if (evt.keyCode === keyCode) {
          callback(evt);
        }
      };
    },

    // получение случного числа
    getRandomNumber: function (min, max) {
      return (Math.random() * (max - min) + min).toFixed(0);
    },

    // показ ошибки на невалидном элементе
    showError: function (evt) {
      var element = evt.target;
      element.style.outlineColor = element.validity.valid ? '' : 'red';
    },

    // получение нужного дом-элемента из шаблона для клонирования
    getTemplateClone: function (template, innerSelector) {
      var templateElement = document.querySelector(template);
      var elementToClone;

      if ('content' in templateElement) {
        elementToClone = templateElement.content.querySelector(innerSelector);
      } else {
        elementToClone = templateElement.querySelector(innerSelector);
      }

      return elementToClone;
    }

  };
}());
