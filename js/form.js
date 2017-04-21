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
      filterFormPreview.className = 'filter-image-preview filter-' + evt.target.value;
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
  function onFilterFormMinusBtnClick(evt) {
    setScale(MIN_RESIZE, 0);
  }

  // обработчик клика на кнопку изменения размера изображения в большую сторону
  function onFilterFormPlusBtnClick(evt) {
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

  // вывод формы кадрирования после выбора файла в input
  uploadImgForm.addEventListener('change', onUploadFormChange);
})();


