'use strict';
window.form = (function () {
  return {
    // максимальный размер изображения
    MAX_RESIZE: '100%',

    // минимальный размер изображения
    MIN_RESIZE: '25%',

    // шаг изменения изображения
    STEP_RESIZE: 25,

    // обработчик ввода коментариев в форме кадрирования
    onFilterFormCommentsEscPress: window.form.onKeyPress(window.data.ESC_KEY_CODE, function (evt) {
      evt.stopPropagation();
    }),

    // блок формы кадрирования
    filterForm: document.querySelector('.upload-filter'),

    // превью загружаемой фото
    filterFormPreview: window.form.filterForm.querySelector('.filter-image-preview'),

    // обработчик нажатия esc на кнопку закрытия формы кадрирования
    onFilterFormEscPress: window.form.onKeyPress(window.data.ESC_KEY_CODE, window.form.closeFilterForm),

    // поле отображение размера изображения
    filterFormResizeInput: window.form.filterForm.querySelector('input[type="text"]'),

    // кнопка  увеличения изображения в форме кадрирования
    filterFormPlusBtn: window.form.filterForm.querySelector('.upload-resize-controls-button-inc'),

    // кнопка  уменьшения изображения в форме кадрирования
    filterFormMinusBtn: window.form.filterForm.querySelector('.upload-resize-controls-button-dec'),

    // кнопка закрыть на форме кадрирования
    filterFormUploadBtn: window.form.filterForm.querySelector('.upload-form-cancel'),

    // поле комментариев формы кадрирования
    filterFormComments: window.form.filterForm.querySelector('.upload-form-description'),

    // блок фильтров изображений
    filterControls: window.form.filterForm.querySelector('.upload-filter-controls'),

    // блок кадрирования изображения
    uploadOverlay: document.querySelector('.upload-overlay'),

    // блок формы загрузки фотографий
    uploadImgForm: document.querySelector('.upload-image'),

    // закрытие формы кадрирования
    closeFilterForm: function () {
      window.form.uploadOverlay.classList.add('invisible');
      window.form.clearFilterForm();

      document.removeEventListener('keydown', window.form.onFilterFormEscPress);
      window.form.filterFormUploadBtn.removeEventListener('click', window.form.onFilterFormCloseBtnClick);
      window.form.filterFormComments.removeEventListener('keydown', window.form.onFilterFormCommentsEscPress);
      window.form.filterControls.removeEventListener('click', window.form.onFilterControlsClick);
      window.form.filterFormMinusBtn.removeEventListener('click', window.form.onFilterFormMinusBtnClick);
      window.form.filterFormPlusBtn.removeEventListener('click', window.form.onFilterFormPlusBtnClick);
    },

    // очистка формы кадрирования
    clearFilterForm: function () {
      window.form.uploadImgForm.reset();
      window.form.filterForm.reset();

      window.form.filterFormResizeInput.setAttribute('value', '100%');
      window.form.filterFormPreview.style.transform = 'scale(1)';

      window.form.filterFormPreview.className = 'filter-image-preview';
    },

    // открытие формы кадрирования
    openFilterForm: function () {
      window.form.uploadOverlay.classList.remove('invisible');

      // закрытие формы кадрирования по ESC
      document.addEventListener('keydown', window.form.onFilterFormEscPress);

      // закрытие формы по клику на крестик
      window.form.filterFormUploadBtn.addEventListener('click', window.form.onFilterFormCloseBtnClick);

      // пока идет ввод в коментариях, форму не закрыть
      window.form.filterFormComments.addEventListener('keydown', window.form.onFilterFormCommentsEscPress);

      // применение фильта к изображению
      window.form.filterControls.addEventListener('click', window.form.onFilterControlsClick);

      // изменение размера в меньшую сторону
      window.form.filterFormMinusBtn.addEventListener('click', window.form.onFilterFormMinusBtnClick);

      // изменение размера в меньшую сторону
      window.form.filterFormPlusBtn.addEventListener('click', window.form.onFilterFormPlusBtnClick);

      // валидация формы
      window.form.filterFormComments.addEventListener('input', window.form.onFilterFormCommentsInvalid);
    },

     // обработчик клика по кнопке закрытия
    onFilterFormCloseBtnClick: function () {
      window.form.closeFilterForm();
    },

    // обработчик клика на фильтры формы кадрирования
    onFilterControlsClick: function (evt) {
      window.form.setFilter(evt);
    },

    // установка фильтра на фото
    setFilter: function (evt) {
      if (evt.target.checked) {
        window.form.filterFormPreview.className = 'filter-image-preview filter-' + evt.target.value;
      }
    },

    // обработчик валидности формы кадрирования
    onFilterFormCommentsInvalid: function (evt) {
      window.form.showError(evt);
    },

    // обработчик клика на кнопку изменения размера изображения в меньшую сторону
    onFilterFormMinusBtnClick: function (evt) {
      window.form.setScale(window.form.MIN_RESIZE, 0);
    },

    // обработчик клика на кнопку изменения размера изображения в большую сторону
    onFilterFormPlusBtnClick: function (evt) {
      window.form.setScale(window.form.MAX_RESIZE, 1);
    },

    // вычисление размера изображения в форме кадрирования
    setScale: function (sizeLimit, sign) {
      var stepSize;
      var sizeValue;

      if (window.form.filterFormResizeInput.value !== sizeLimit) {
        stepSize = sign ? window.form.STEP_RESIZE : -window.form.STEP_RESIZE;
        sizeValue = parseInt(window.form.filterFormResizeInput.value, 10) + stepSize;
        window.form.filterFormResizeInput.setAttribute('value', sizeValue + '%');
        window.form.filterFormPreview.style.transform = 'scale(' + sizeValue / 100 + ')';
      }
    },

    // обработчик изменения значения в форме загрузки фото
    onUploadFormChange: function () {
      window.form.openFilterForm();
    },
  };
}());

// вывод формы кадрирования после выбора файла в input
window.form.uploadImgForm.addEventListener('change', window.form.onUploadFormChange);
