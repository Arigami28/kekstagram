'use strict';

window.form = (function () {

  // максимальный размер изображения
  var MAX_RESIZE = '100%';

  // минимальный размер изображения
  var MIN_RESIZE = '25%';

  // шаг изменения изображения
  var STEP_RESIZE = 25;

  // максимальные координаты ползунка
  var PIN_MAX_COORDS = 455;

  // минимальные координаты ползунка
  var PIN_MIN_COORDS = 0;

  // блок формы кадрирования
  var filterForm = document.querySelector('.upload-filter');

  // превью загружаемой фото
  var filterImgPreview = filterForm.querySelector('.filter-image-preview');

  // обработчик нажатия esc на кнопку закрытия формы кадрирования
  var onFilterFormEscPress = window.utils.onKeyPress(window.utils.ESC_KEY_CODE, closeFilterForm);

  // поле отображение размера изображения
  var filterFormResizeInput = filterForm.querySelector('input[type="text"]');

  // кнопка  увеличения изображения в форме кадрирования
  var filterFormPlusBtn = filterForm.querySelector('.upload-resize-controls-button-inc');

  // кнопка  уменьшения изображения в форме кадрирования
  var filterFormMinusBtn = filterForm.querySelector('.upload-resize-controls-button-dec');

  // кнопка закрыть на форме кадрирования
  var filterFormUploadBtn = filterForm.querySelector('.upload-form-cancel');

  // поле комментариев формы кадрирования
  var filterFormComments = filterForm.querySelector('.upload-form-description');

  // блок фильтров изображений
  var filterControls = filterForm.querySelector('.upload-filter-controls');

  // блок кадрирования изображения
  var uploadOverlay = document.querySelector('.upload-overlay');

  // блок формы загрузки фотографий
  var uploadImgForm = document.querySelector('.upload-image');

  // обработчик ввода коментариев в форме кадрирования
  var onFilterFormCommentsEscPress = window.utils.onKeyPress(window.utils.ESC_KEY_CODE, function (evt) {
    evt.stopPropagation();
  });

  // блок с ползунком
  var uploadFilterLevel = filterForm.querySelector('.upload-filter-level');

  // линия хождения ползунка насышености фильра
  // var filterLine = uploadFilterLevel.querySelector('.upload-filter-level-line');

  // ползунок насыщености фильтра
  var filterPin = uploadFilterLevel.querySelector('.upload-filter-level-pin');

  // прогресс фильтра
  var filterProgress = uploadFilterLevel.querySelector('.upload-filter-level-val');

  // массив радиобатонов фильтров
  var filterFormRadio = filterForm.querySelectorAll('input[type="radio"]');

  // закрытие формы кадрирования
  function closeFilterForm() {
    uploadOverlay.classList.add('invisible');
    clearFilterForm();

    document.removeEventListener('keydown', onFilterFormEscPress);
    filterFormUploadBtn.removeEventListener('click', onFilterFormCloseBtnClick);
    filterFormComments.removeEventListener('keydown', onFilterFormCommentsEscPress);
    filterControls.removeEventListener('click', onFilterControlsClick);
    filterFormMinusBtn.removeEventListener('click', onFilterFormMinusBtnClick);
    filterFormPlusBtn.removeEventListener('click', onFilterFormPlusBtnClick);
  }

  // очистка формы кадрирования
  function clearFilterForm() {
    uploadImgForm.reset();
    filterForm.reset();

    filterPin.style.left = '0px';
    filterProgress.style.width = '0px';

    filterFormResizeInput.setAttribute('value', '100%');
    filterImgPreview.style.transform = 'scale(1)';
    filterImgPreview.style.filter = '';
    filterImgPreview.className = 'filter-image-preview';
  }

  // открытие формы кадрирования
  function openFilterForm() {
    uploadOverlay.classList.remove('invisible');
    uploadFilterLevel.classList.add('invisible');
    // закрытие формы кадрирования по ESC
    document.addEventListener('keydown', onFilterFormEscPress);

    // закрытие формы по клику на крестик
    filterFormUploadBtn.addEventListener('click', onFilterFormCloseBtnClick);

    // пока идет ввод в коментариях, форму не закрыть
    filterFormComments.addEventListener('keydown', onFilterFormCommentsEscPress);

    // применение фильта к изображению
    filterControls.addEventListener('click', onFilterControlsClick);

    // изменение размера в меньшую сторону
    filterFormMinusBtn.addEventListener('click', onFilterFormMinusBtnClick);

    // изменение размера в меньшую сторону
    filterFormPlusBtn.addEventListener('click', onFilterFormPlusBtnClick);

    // валидация формы
    filterFormComments.addEventListener('input', onFilterFormCommentsInvalid);
  }

  // обработчик клика по кнопке закрытия
  function onFilterFormCloseBtnClick() {
    closeFilterForm();
  }

  // обработчик клика на фильтры формы кадрирования
  function onFilterControlsClick(evt) {
    setFilter(evt);
  }

  // установка фильтра на фото
  function setFilter(evt) {
    if (evt.target.checked) {
      uploadFilterLevel.classList.toggle('invisible', evt.target.value === 'none');
      filterPin.style.left = '0px';
      filterProgress.style.width = '0px';
      filterImgPreview.className = 'filter-image-preview';
      filterImgPreview.style.filter = 'none';
    }
  }

  // показ ошибки на невалидном элементе
  function showError(evt) {
    var element = evt.target;
    element.style.outlineColor = element.validity.valid ? '' : 'red';
  }

  // обработчик валидности формы кадрирования
  function onFilterFormCommentsInvalid(evt) {
    showError(evt);
  }

  // обработчик клика на кнопку изменения размера изображения в меньшую сторону
  function onFilterFormMinusBtnClick() {
    setScale(MIN_RESIZE, 0);
  }

  // обработчик клика на кнопку изменения размера изображения в большую сторону
  function onFilterFormPlusBtnClick() {
    setScale(MAX_RESIZE, 1);
  }

  // вычисление размера изображения в форме кадрирования
  function setScale(sizeLimit, sign) {
    var stepSize;
    var sizeValue;

    if (filterFormResizeInput.value !== sizeLimit) {
      stepSize = sign ? STEP_RESIZE : -STEP_RESIZE;
      sizeValue = parseInt(filterFormResizeInput.value, 10) + stepSize;
      filterFormResizeInput.setAttribute('value', sizeValue + '%');
      filterImgPreview.style.transform = 'scale(' + sizeValue / 100 + ')';
    }
  }

  // обработчик изменения значения в форме загрузки фото
  function onUploadFormChange() {
    openFilterForm();
  }

  // применение фильтра по движению ползунка
  function saturationFilter(coords) {
    for (var i = 0; i < filterFormRadio.length; i++) {

      if (filterFormRadio[i].checked) {

        switch (filterFormRadio[i].value) {
          case 'none':
            break;
          case 'chrome': filterImgPreview.style.filter = 'grayscale(' + (coords / PIN_MAX_COORDS) + ')';
            break;
          case 'sepia': filterImgPreview.style.filter = 'sepia(' + (coords / PIN_MAX_COORDS) + ')';
            break;
          case 'marvin': filterImgPreview.style.filter = 'invert(' + (coords / PIN_MAX_COORDS) * 100 + '%' + ')';
            break;
          case 'phobos': filterImgPreview.style.filter = 'blur(' + (coords / PIN_MAX_COORDS) * 3 + 'px' + ')';
            break;
          case 'heat': filterImgPreview.style.filter = 'brightness(' + (coords / PIN_MAX_COORDS) * 3 + ')';
            break;
        }
      }
    }
  }

  // обработчик события клика на ползунке фильтра
  function onMouseDown(evt) {
    var starCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    evt.preventDefault();

    // обработчик события движения мышки при нажатии
    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      // смещение
      var shift = {
        x: starCoords.x - moveEvt.clientX
      };

      // перезапись кординат на новые
      starCoords = {
        x: moveEvt.clientX
      };

      if (parseInt(filterPin.style.left, 10) <= PIN_MIN_COORDS) {
        filterPin.style.left = PIN_MIN_COORDS + 'px';
      }

      if (parseInt(filterPin.style.left, 10) >= PIN_MAX_COORDS) {
        filterPin.style.left = PIN_MAX_COORDS + 'px';
      }

      filterPin.style.left = (filterPin.offsetLeft - shift.x) + 'px';
      filterProgress.style.width = (filterPin.offsetLeft - shift.x) + 'px';

      var coords = filterPin.offsetLeft - shift.x;
      saturationFilter(coords);
    }

    // обработчик события отжатия клавиши мыши
    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      filterPin.removeEventListener('blur', onMouseBlure);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    // обработчик события потери фокуса с ползунка
    function onMouseBlure(blureEvt) {
      blureEvt.preventDefault();

      filterPin.removeEventListener('blur', onMouseBlure);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    filterPin.addEventListener('blur', onMouseBlure);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  // событие нажатие мышки и удержания
  filterPin.addEventListener('mousedown', onMouseDown);

  // вывод формы кадрирования после выбора файла в input
  uploadImgForm.addEventListener('change', onUploadFormChange);
})();


