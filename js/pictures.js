'use strict';

// массив комментариев
var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.'];

// количество фото
var AMOUNT_OF_PHOTO = 25;

// минимальное количество лайков
var MIN_LIKES = 15;

// максимальное количество лайков
var MAX_LIKES = 200;

// код клавиши esc
var ESC_KEY_CODE = 27;

// код клавиши enter
var ENTER_KEY_CODE = 13;

// максимальный размер изображения
var MAX_RESIZE = '100%';

// минимальный размер изображения
var MIN_RESIZE = '25%';

// шаг изменения изображения
var STEP_RESIZE = 25;

// блок формы загрузки фотографий
var uploadImgForm = document.querySelector('.upload-image');

// блок шаблона
var photoItemsTemplate = getTemplateClone('#picture-template', '.picture');

// блок для отрисовки всех изображений
var pictures = document.querySelector('.pictures');

// блок для отрисовки галереи
var galleryOverlay = document.querySelector('.gallery-overlay');

// счетчик лайков галереи
var galleryLikes = galleryOverlay.querySelector('.likes-count');

// комментарии галереи
var galleryComments = galleryOverlay.querySelector('.comments-count');

// адрес фото галереи
var galleryImg = galleryOverlay.querySelector('.gallery-overlay-image');

// массив с фото, количеством лайков и комментарием
var photo = getPhotoItems(AMOUNT_OF_PHOTO);

// кнопка закрытия превью галереи
var closeGalleryBtn = document.querySelector('.gallery-overlay-close');

// обработчик нажатия enter на кнопку закрытия галереи
var onGalleryCloseBtnEnter = onKeyPress(ENTER_KEY_CODE, closeGallery);

// обработчик нажатия esc на кнопку закрытия галереи
var onGalleryEscPress = onKeyPress(ESC_KEY_CODE, closeGallery);

// блок формы кадрирования
var filterForm = document.querySelector('.upload-filter');

// блок кадрирования изображения
var uploadOverlay = document.querySelector('.upload-overlay');

// блок фильтров изображений
var filterControls = document.querySelector('.upload-filter-controls');

// поле комментариев формы кадрирования
var filterFormComments = filterForm.querySelector('.upload-form-description');

// кнопка закрыть на форме кадрирования
var filterFormUploadBtn = filterForm.querySelector('.upload-form-cancel');

// кнопка  уменьшения изображения в форме кадрирования
var filterFormMinusBtn = filterForm.querySelector('.upload-resize-controls-button-dec');

// кнопка  увеличения изображения в форме кадрирования
var filterFormPlusBtn = filterForm.querySelector('.upload-resize-controls-button-inc');

// поле отображение размера изображения
var filterFormResizeInput = filterForm.querySelector('input[type="text"]');

// обработчик нажатия esc на кнопку закрытия формы кадрирования
var onFilterFormEscPress = onKeyPress(ESC_KEY_CODE, closeFilterForm);

// превью загружаемой фото
var filterFormPreview = filterForm.querySelector('.filter-image-preview');

// обработчик ввода коментариев в форме кадрирования
var onFilterFormCommentsEscPress = onKeyPress(ESC_KEY_CODE, function (evt) {
  evt.stopPropagation();
});

// Нажатие клавиш
function onKeyPress(keyCode, callback) {
  return function (evt) {
    if (evt.keyCode === keyCode) {
      callback(evt);
    }
  };
}

// генерация случайного комментария
function getRandomComments() {
  return COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
}

// получение случного числа лайков
function getRandomNumber(min, max) {
  return (Math.random() * (max - min) + min).toFixed(0);
}

// генерации объектов для элементов массива с фото, количеством лайков и комментарием
function getPhotoItems(item) {
  var photoItems = [];

  for (var i = 0; i < item; i++) {
    photoItems[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
      comments: getRandomComments()
    };
  }

  return photoItems;
}

// получение нужного дом-элемента из шаблона для клонирования
function getTemplateClone(template, innerSelector) {
  var templateElement = document.querySelector(template);
  var elementToClone;

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector(innerSelector);
  } else {
    elementToClone = templateElement.querySelector(innerSelector);
  }

  return elementToClone;
}

// создаем элемент разметки с фото
function renderPictures(picturesObj, pictureNumber) {
  var photosElement = photoItemsTemplate.cloneNode(true);

  photosElement.querySelector('img').src = picturesObj.url;
  photosElement.querySelector('.picture-comments').textContent = picturesObj.comments;
  photosElement.querySelector('.picture-likes').textContent = picturesObj.likes;

  // добавление обработчика события при клике на миниатюру
  photosElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    showGallery(pictureNumber);
  });

  return photosElement;
}

// показываем галерею
function showGallery(pictureIndex) {
  setActivePicture(pictureIndex);
  galleryOverlay.classList.remove('invisible');

  // добавление обработчика клика по кнопке закрытия галереи
  closeGalleryBtn.addEventListener('click', onGalleryCloseBtnClick);

  // добавление обработчика нажатия на enter по кнопке закрытия галереи
  closeGalleryBtn.addEventListener('keydown', onGalleryCloseBtnEnter);

  // добавление обработчика нажатия на esc
  document.addEventListener('keydown', onGalleryEscPress);
}

// отрисовка миниатюр  на страницу
function showPictures(array, container) {
  // пустой фрагмент для наполнения
  var fragment = document.createDocumentFragment();

  array.forEach(function (pictureObj, pictureNumber) {
    fragment.appendChild(renderPictures(pictureObj, pictureNumber));
  });

  container.appendChild(fragment);
  uploadOverlay.classList.add('invisible');
}

// вставка правильной картинки в разметку/контейнер галереи
function setActivePicture(pictureIndex) {
  galleryImg.src = photo[pictureIndex].url;
  galleryComments.textContent = photo[pictureIndex].comments;
  galleryLikes.textContent = photo[pictureIndex].likes;
}

// обработчик события клик на кнопке закрытия галереи
function onGalleryCloseBtnClick() {
  closeGallery();
}

// закрытие галереи
function closeGallery() {
  galleryOverlay.classList.add('invisible');

  // удаление обработчика клика по кнопке закрытия галереи
  closeGalleryBtn.removeEventListener('click', onGalleryCloseBtnClick);

  // удаление обработчика закрытия галереи по нажатию на клавишу enter и фокусу на крестике
  closeGalleryBtn.removeEventListener('keydown', onGalleryCloseBtnEnter);

  // удаление обработчика нажатия на esc
  document.removeEventListener('keydown', onGalleryEscPress);
}

// закрытие формы кадрирования
function closeFilterForm() {
  uploadOverlay.classList.add('invisible');
  clearFilterForm();

  document.removeEventListener('keydown', onFilterFormEscPress);
  filterFormUploadBtn.removeEventListener('click', onFilterFormCloseBtnClick);
  filterFormComments.removeEventListener('keydown', onFilterFormCommentsEscPress);
  filterControls.removeEventListener('click', onFilterControlsClick);
  filterFormMinusBtn.removeEventListener('click', onFilterFormResizeMinusClick);
  filterFormPlusBtn.removeEventListener('click', onFilterFormResizePlusClick);
}

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
  filterFormMinusBtn.addEventListener('click', onFilterFormResizeMinusClick);

  // изменение размера в меньшую сторону
  filterFormPlusBtn.addEventListener('click', onFilterFormResizePlusClick);

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

// обработчик валидности формы кадрирования
function onFilterFormCommentsInvalid(evt) {
  showError(evt);
}

// подцветка ошибок коментариев
function showError(evt) {
  var element = evt.target;
  element.style.outlineColor = element.validity.valid ? '' : 'red';
}

// обработчик клика на кнопку изменения размера изображения в меньшую сторону
function onFilterFormResizeMinusClick(evt) {
  setScale(MIN_RESIZE);
}

// обработчик клика на кнопку изменения размера изображения в большую сторону
function onFilterFormResizePlusClick(evt) {
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

showPictures(photo, pictures);
