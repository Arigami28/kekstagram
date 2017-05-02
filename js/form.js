'use strict';

window.form = (function () {

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

  // ползунок насыщености фильтра
  var filterPin = uploadFilterLevel.querySelector('.upload-filter-level-pin');

  // прогресс фильтра
  var filterProgress = uploadFilterLevel.querySelector('.upload-filter-level-val');

  // выбраный фильтр
  var defaultFilter = 'none';

  // закрытие формы кадрирования
  function closeFilterForm() {
    uploadOverlay.classList.add('invisible');
    clearFilterForm();

    document.removeEventListener('keydown', onFilterFormEscPress);
    filterFormUploadBtn.removeEventListener('click', onFilterFormCloseBtnClick);
    filterFormComments.removeEventListener('keydown', onFilterFormCommentsEscPress);
    filterControls.removeEventListener('click', onFilterControlsClick);
    window.scale.removeListenerFilterFormMinus();
    window.scale.removeListenerFilterFormPlus();
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
    window.scale.addListenerFilterFormMinus();

    // изменение размера в меньшую сторону
    window.scale.addListenerFilterFormPlus();

    // валидация формы
    filterFormComments.addEventListener('input', onFilterFormCommentsInvalid);
  }

  // обработчик клика по кнопке закрытия формы кадрирования
  function onFilterFormCloseBtnClick() {
    closeFilterForm();
  }

  // обработчик клика по фильтрам формы кадрирования
  function onFilterControlsClick(evt) {
    getFilter(evt);
  }

  // получение фильтра для фото
  function getFilter(evt) {
    if (evt.target.checked) {
      uploadFilterLevel.classList.toggle('invisible', evt.target.value === 'none');
      defaultFilter = evt.target.value;
      filterPin.style.left = '0px';
      filterProgress.style.width = '0px';
      setFilter(PIN_MIN_COORDS);
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


  // обработчик изменения значения в форме загрузки фото
  function onUploadFormChange() {
    openFilterForm();
  }

  // установка фильтра
  function setFilter(coord) {
    switch (defaultFilter) {
      case 'chrome': filterImgPreview.style.filter = 'grayscale(' + (coord / PIN_MAX_COORDS).toFixed(1) + ')';
        break;
      case 'sepia': filterImgPreview.style.filter = 'sepia(' + (coord / PIN_MAX_COORDS).toFixed(1) + ')';
        break;
      case 'marvin': filterImgPreview.style.filter = 'invert(' + (coord / PIN_MAX_COORDS).toFixed(1) * 100 + '%' + ')';
        break;
      case 'phobos': filterImgPreview.style.filter = 'blur(' + (coord / PIN_MAX_COORDS).toFixed(1) * 3 + 'px' + ')';
        break;
      case 'heat': filterImgPreview.style.filter = 'brightness(' + (coord / PIN_MAX_COORDS).toFixed(1) * 3 + ')';
        break;
    }
  }

  // обработчик события 'клик' на ползунке фильтра
  function onFilterPinMouseDown(evt) {
    evt.preventDefault();

    // начальные координаты
    var starCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    // обработчик события движения мышки
    function onDocumentMouseMove(moveEvt) {
      moveEvt.preventDefault();

      // смещение
      var shift = {
        x: starCoords.x - moveEvt.clientX
      };

      // текущие координаты ползунка
      var coordPin = filterPin.offsetLeft - shift.x;

      // перезапись кординат на новые
      starCoords = {
        x: moveEvt.clientX
      };

      filterPin.style.left = coordPin + 'px';
      filterProgress.style.width = coordPin + 'px';

      if (parseInt(filterPin.style.left, 10) <= PIN_MIN_COORDS) {
        filterPin.style.left = PIN_MIN_COORDS + 'px';
        filterProgress.style.width = PIN_MIN_COORDS + 'px';
      }

      if (parseInt(filterPin.style.left, 10) >= PIN_MAX_COORDS) {
        filterPin.style.left = PIN_MAX_COORDS + 'px';
        filterProgress.style.width = PIN_MAX_COORDS + 'px';
      }

      setFilter(coordPin);
    }

    // обработчик MouseUp на document
    function onDocumentMouseUp(upEvt) {
      upEvt.preventDefault();

      filterPin.removeEventListener('blur', onFilterPinMouseblur);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    }

    // обработчик потери фокуса с ползунка
    function onFilterPinMouseblur(blurEvt) {
      blurEvt.preventDefault();

      filterPin.removeEventListener('blur', onFilterPinMouseblur);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    }

    filterPin.addEventListener('blur', onFilterPinMouseblur);
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  }

  // добавление обработчика mousedown для ползунка формы кадрирования
  filterPin.addEventListener('mousedown', onFilterPinMouseDown);

  // добавление обработчика на вывод формы кадрирования после выбора файла в input
  uploadImgForm.addEventListener('change', onUploadFormChange);
})();


