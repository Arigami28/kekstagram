'use strict';

window.form = (function () {

  // максимальный размер изображения
  var MAX_RESIZE = '100%';

  // минимальный размер изображения
  var MIN_RESIZE = '25%';

  // шаг изменения изображения
  var STEP_RESIZE = 25;

  // блок формы кадрирования
  var filterForm = document.querySelector('.upload-filter');

  // превью загружаемой фото
  var filterFormPreview = filterForm.querySelector('.filter-image-preview');

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
  var filterLine = uploadFilterLevel.querySelector('.upload-filter-level-line');

  // ползунок насыщености фильтра
  var filterPin = uploadFilterLevel.querySelector('.upload-filter-level-pin');

  // прогресс фильтра
  var filterProgress = uploadFilterLevel.querySelector('.upload-filter-level-val');

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

    filterFormResizeInput.setAttribute('value', '100%');
    filterFormPreview.style.transform = 'scale(1)';

    filterFormPreview.className = 'filter-image-preview';
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
      uploadFilterLevel.classList.remove('invisible');
      filterPin.style.left = '0px';
      filterProgress.style.width = '0px';
      filterFormPreview.className = 'filter-image-preview filter-' + evt.target.value;
    }
    if (evt.target.value === 'none') {
      uploadFilterLevel.classList.add('invisible');
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
      filterFormPreview.style.transform = 'scale(' + sizeValue / 100 + ')';
    }
  }

  // обработчик изменения значения в форме загрузки фото
  function onUploadFormChange() {
    openFilterForm();
  }

  // событие нажатие мышки и удержания
  filterPin.addEventListener('mousedown', function (evt) {
    var starCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    evt.preventDefault();

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      // смешение
      var shift = {
        x: starCoords.x - moveEvt.clientX
      };

      // перезапись кординат на новые
      starCoords = {
        x: moveEvt.clientX
      };

      filterPin.style.left = (filterPin.offsetLeft - shift.x) + 'px';
      filterProgress.style.width = (filterPin.offsetLeft - shift.x) + 'px';
      var maxCoords = 455;
      var minCoords = 0;

      if (parseInt(filterPin.style.left, 10) <= minCoords) {
        filterPin.style.left = minCoords + 'px';
      }

      if (parseInt(filterPin.style.left, 10) >= maxCoords) {
        filterPin.style.left = maxCoords + 'px';
      }
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      filterPin.removeEventListener('blur', onMouseBlure);
      filterLine.removeEventListener('mousemove', onMouseMove);
      filterLine.removeEventListener('mouseup', onMouseUp);
    }

    function onMouseBlure(blureEvt) {
      blureEvt.preventDefault();

      filterPin.removeEventListener('blur', onMouseBlure);
      filterLine.removeEventListener('mousemove', onMouseMove);
      filterLine.removeEventListener('mouseup', onMouseUp);
    }

    filterPin.addEventListener('blur', onMouseBlure);
    filterLine.addEventListener('mousemove', onMouseMove);
    filterLine.addEventListener('mouseup', onMouseUp);
  });

  // вывод формы кадрирования после выбора файла в input
  uploadImgForm.addEventListener('change', onUploadFormChange);
})();


