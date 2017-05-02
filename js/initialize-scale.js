'use strict';

window.scale = (function () {

  // поле отображение размера изображения
  var filterFormResizeInput = document.querySelector('input[type="text"]');

  // кнопка  уменьшения изображения в форме кадрирования
  var filterFormMinusBtn = document.querySelector('.upload-resize-controls-button-dec');

  // кнопка  увеличения изображения в форме кадрирования
  var filterFormPlusBtn = document.querySelector('.upload-resize-controls-button-inc');

  // шаг изменения изображения
  var STEP_RESIZE = 25;

  // превью загружаемой фото
  var filterImgPreview = document.querySelector('.filter-image-preview');

  // максимальный размер изображения
  var MAX_RESIZE = '100%';

  // минимальный размер изображения
  var MIN_RESIZE = '25%';

  // выбранный масштаб
  var scaleValue = function (sizeValue) {
    filterFormResizeInput.setAttribute('value', sizeValue + '%');
    filterImgPreview.style.transform = 'scale(' + sizeValue / 100 + ')';
  };

  // превью загружаемой фото
  function set(sizeLimit, sign, callback) {
    if (filterFormResizeInput.value !== sizeLimit) {
      var stepSize = sign ? STEP_RESIZE : -STEP_RESIZE;
      var sizeValue = parseInt(filterFormResizeInput.value, 10) + stepSize;
      callback(sizeValue);
    }
  }

  // листнер кнопка  уменьшения изображения в форме кадрирования
  var listenerMinus = function () {
    window.scale.onFilterFormMinusBtnClick(scaleValue);
  };

  // листнер кнопка  увеличения изображения в форме кадрирования
  var listenerPlus = function () {
    window.scale.onFilterFormPlusBtnClick(scaleValue);
  };

  return {
    addListenerFilterFormMinus: filterFormMinusBtn.addEventListener('click', listenerMinus),
    addListenerFilterFormPlus: filterFormPlusBtn.addEventListener('click', listenerPlus),
    removeListenerFilterFormMinus: filterFormMinusBtn.addEventListener('click', listenerMinus),
    removeListenerFilterFormPlus: filterFormPlusBtn.addEventListener('click', listenerPlus),
    onFilterFormMinusBtnClick: function (callback) {
      set(MIN_RESIZE, 0, callback);
    },
    onFilterFormPlusBtnClick: function (callback) {
      set(MAX_RESIZE, 1, callback);
    }
  };
})();


