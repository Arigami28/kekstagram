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

// поле отображение размера изображения
var inpuUploadtFile = document.querySelector('input[name="filename"]');

// блок кадрирования изображения
var uploadOverlay = document.querySelector('.upload-overlay');

// блок фильтров изображений
var uploadFilter = document.querySelector('.upload-filter-controls');

// блок формы загрузки фотографий
var uploadForm = document.querySelector('.upload-form');

// поле комментариев формы upload
var uploadComments = uploadOverlay.querySelector('.upload-form-description');

// кнопка Закрыть на форме upload
var closeUploadBtn = uploadOverlay.querySelector('.upload-form-cancel');

// поле изменения размера изображения в форме upload
var uploadBtnResize = uploadOverlay.querySelector('.upload-resize-controls');

// кнопка  уменьшения изображения в форме кадрирования
var uploadBtnMinus = uploadBtnResize.querySelector('.upload-resize-controls-button-dec');

// кнопка  увеличения изображения в форме кадрирования
var uploadBtnPlus = uploadBtnResize.querySelector('.upload-resize-controls-button-inc');

// поле отображение размера изображения
var uploadInputBtnResize = uploadBtnResize.querySelector('input[type="text"]');

// обработчик нажатия esc на кнопку закрытия формы кадрирования
var onUploadEscPress = onKeyPress(ESC_KEY_CODE, closeUpload);

// превью формы кадрирования
var uploadFormPreview = document.querySelector('.filter-image-preview');

// обработчик ввода коментариев в форме кадрирования
var onUploadCommentsEscPress = onKeyPress(ESC_KEY_CODE, function (evt) {
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
function closeUpload() {
  uploadOverlay.classList.add('invisible');
  inpuUploadtFile.value = '';
  uploadComments.value = '';
  uploadInputBtnResize.setAttribute('value', '100%');
  uploadFormPreview.style.transform = 'scale(1)';

  uploadFormPreview.className = 'filter-image-preview';
  document.removeEventListener('keydown', onUploadEscPress);
  closeUploadBtn.removeEventListener('click', onCloseUploadBtnClick);
  uploadComments.removeEventListener('keydown', onUploadCommentsEscPress);
  uploadFilter.removeEventListener('click', onUploadFilterClick);
  uploadBtnMinus.removeEventListener('click', onUploadBtnResizeMinus);
  uploadBtnPlus.removeEventListener('click', onUploadBtnResizePlus);
}

// открытие формы кадрирования
function openUpload() {
  uploadOverlay.classList.remove('invisible');

  // закрытие формы кадрирования по ESC
  document.addEventListener('keydown', onUploadEscPress);

  // закрытие формы по клику на крестик
  closeUploadBtn.addEventListener('click', onCloseUploadBtnClick);

  // пока идет ввод в коментариях, форму не закрыть
  uploadComments.addEventListener('keydown', onUploadCommentsEscPress);

  // применение фильта к изображению
  uploadFilter.addEventListener('click', onUploadFilterClick);

  // изменение размера в меньшую сторону
  uploadBtnMinus.addEventListener('click', onUploadBtnResizeMinus);

  // изменение размера в меньшую сторону
  uploadBtnPlus.addEventListener('click', onUploadBtnResizePlus);

  // валидация формы
  uploadComments.addEventListener('invalid', onUploadInvalid);
}

// обработчик клика по кнопке закрытия
function onCloseUploadBtnClick() {
  closeUpload();
}

// обработчик клика на фильтры формы кадрирования
function onUploadFilterClick(evt) {
  setFilter(evt);
}

// установка фильтра
function setFilter(evt) {
  if (evt.target.checked) {
    uploadFormPreview.className = 'filter-image-preview filter-' + evt.target.value;
  }
}

// обработчик валидности формы кадрирования
function onUploadInvalid(evt) {
  uploadComments.style.outlineColor = 'red';
}

// обработчик изменения размера изображения в меньшую сторону
function onUploadBtnResizeMinus(evt) {
  var sizeValueMinus = parseInt(uploadInputBtnResize.value, 10) - STEP_RESIZE;

  setScale(sizeValueMinus, MIN_RESIZE);
}

// обработчик изменения размера изображения в большую сторону
function onUploadBtnResizePlus(evt) {
  var sizeValuePlus = parseInt(uploadInputBtnResize.value, 10) + STEP_RESIZE;
  setScale(sizeValuePlus, MAX_RESIZE);
}

// вычисление размера изображения в форме кадрирования
function setScale(sizeValue, limitValue) {
  if (uploadInputBtnResize.value !== limitValue) {
    uploadInputBtnResize.setAttribute('value', sizeValue + '%');
    uploadFormPreview.style.transform = 'scale(' + sizeValue / 100 + ')';
  }


}

// открытие формы кадрирования
function onUploadFormChange() {
  openUpload();
}

// вывод формы кадрирования после выбора файла в input
uploadForm.addEventListener('change', onUploadFormChange);

showPictures(photo, pictures);
