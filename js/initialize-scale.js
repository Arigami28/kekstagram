'use strict';

window.scale = (function () {
  // поле отображение размера изображения
  var filterFormResizeInput = document.querySelector('input[type="text"]');

  // шаг изменения изображения
  var STEP_RESIZE = 25;

  // максимальный размер изображения
  var MAX_RESIZE = '100%';

  // минимальный размер изображения
  var MIN_RESIZE = '25%';
  // превью загружаемой фото

  return {
    set: function (sizeLimit, sign, callback) {
      if (filterFormResizeInput.value !== sizeLimit) {
        var stepSize = sign ? STEP_RESIZE : -STEP_RESIZE;
        var sizeValue = parseInt(filterFormResizeInput.value, 10) + stepSize;
        callback(sizeValue);
      }
    },
    onFilterFormMinusBtnClick: function (callback) {
      this.set(MIN_RESIZE, 0, callback);
    },
    onFilterFormPlusBtnClick: function (callback) {
      this.set(MAX_RESIZE, 1, callback);
    }
  };
})();

