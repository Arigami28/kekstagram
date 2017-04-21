'use strict';

window.utils = (function () {
  return {
    // код клавиши enter
    ENTER_KEY_CODE: 13,

    // код клавиши esc
    ESC_KEY_CODE: 27,

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
})();
