'use strict';

window.scale = (function () {
  // поле отображение размера изображения
  var filterFormResizeInput = document.querySelector('input[type="text"]');

  // блок управления размером изображения формы кадрирования
  var scaleElement = document.querySelector('.upload-resize-controls');

  // превью загружаемой фото
  var filterImgPreview = document.querySelector('.filter-image-preview');

  // шаг изменения изображения
  var STEP_RESIZE = 25;

  var scale = function (sign) {
    var stepSize = sign ? STEP_RESIZE : -STEP_RESIZE;
    var sizeValue = parseInt(filterFormResizeInput.value, 10) + stepSize;
    filterFormResizeInput.setAttribute('value', sizeValue + '%');
    filterImgPreview.style.transform = 'scale(' + sizeValue / 100 + ')';
  };
  return function (element, sizeLimit, sign) {
    if (filterFormResizeInput.value !== sizeLimit && element === scaleElement) {
      scale(sign);
    }
  };
})();
