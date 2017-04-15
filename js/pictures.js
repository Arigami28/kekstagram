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
var onCloseGalleryBtnEnter = onKeyPress(ENTER_KEY_CODE, closeGallery);

// обработчик нажатия esc на кнопку закрытия галереи
var onGalleryEscPress = onKeyPress(ESC_KEY_CODE, closeGallery);

// блок кадрирования изображения
var uploadOverlay = document.querySelector('.upload-overlay');

// поле комментариев формы upload
var uploadComments = uploadOverlay.querySelector('.upload-form-description');

// кнопка Закрыть на форме upload
var closeUploadBtn = uploadOverlay.querySelector('.upload-form-cancel');

// блок формы загкрузки фотографий
var uploadForm = document.querySelector('.upload-form');

// обработчик нажатия esc на кнопку закрытия формы кадрирования
var onUploadEscPress = onKeyPress(ESC_KEY_CODE, closeUpload);

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
  closeGalleryBtn.addEventListener('keydown', onCloseGalleryBtnEnter);

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
  closeGalleryBtn.removeEventListener('keydown', onCloseGalleryBtnEnter);

  // удаление обработчика нажатия на esc
  document.removeEventListener('keydown', onGalleryEscPress);
}

// обработчик клика по кнопке закрытия
function onCloseUploadBtnClick() {
  closeUpload();
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
}

// закрытие формы кадрирования
function closeUpload() {
  uploadOverlay.classList.add('invisible');

  document.removeEventListener('keydown', onUploadEscPress);
  closeUploadBtn.removeEventListener('click', onCloseUploadBtnClick);
  uploadComments.removeEventListener('keydown', onUploadCommentsEscPress);
}

function onUploadFormChange() {
  openUpload();
}

// вывод формы кадрирования после выбора файла в input
uploadForm.addEventListener('change', onUploadFormChange);

showPictures(photo, pictures);
