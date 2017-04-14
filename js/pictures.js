'use strict';

// блок шаблона
var photoItemsTemplate = getTemplateClone('#picture-template', '.picture');

// блок кадрирования изображения
var uploadOverlay = document.querySelector('.upload-overlay');

// блок для отрисовки всех изображений
var pictures = document.querySelector('.pictures');

// блок для отрисовки галереи
var galleryOverlay = document.querySelector('.gallery-overlay');

// массив комментариев
var commentsArray = ['Всё отлично!', 'В целом всё неплохо. Но не всё.'];

// количество фото
var amountOfPhoto = 25;

// счетчик лайков галереи
var galleryLikes = galleryOverlay.querySelector('.likes-count');

// комментарии галереи
var galleryComments = galleryOverlay.querySelector('.comments-count');

// адрес фото галереи
var galleryImgUrl = galleryOverlay.querySelector('.gallery-overlay-image');

// минимальное количество лайков
var minLikes = 15;

// максимальное количество лайков
var maxLikes = 200;

// массив с фото, количеством лайков и комментарием
var photo = getPhotoItems(amountOfPhoto);

// кнопка Закрыть на форме upload
var closeUploadBtn = document.querySelector('.upload-form-cancel');

// кнопка закрытия превью галереи
var closeGalleryBtn = document.querySelector('.gallery-overlay-close');

// поле комментариев формы upload
var uploadDescription = document.querySelector('.upload-form-description');

// код клавиши esc
var ESC_KEY_CODE = 27;

// код клавиши enter
var ENTER_KEY_CODE = 13;

// обработчик нажатия enter на кнопку закрытия галереи
var onCloseGalleryBtnEnter = onKeyPress(ENTER_KEY_CODE, closeGallery);

// обработчик нажатия esc на кнопку закрытия галереи
var onGalleryEscPress = onKeyPress(ESC_KEY_CODE, closeGallery);

// обработчик нажатия esc на кнопку закрытия формы кадрирования
var onUploadEscPress = onKeyPress(ESC_KEY_CODE, closeUpload);

// блок формы загкрузки фотографий
var uploadForm = document.querySelector('.upload-form');

// Нажатие клавишь (открытие/закрытие)
function onKeyPress(keyCode, callback) {
  return function (evt) {
    if (evt.keyCode === keyCode) {
      callback();
    }
  };
}

// генерация случайного комментария
function getRandomComments() {
  return commentsArray[Math.floor(Math.random() * commentsArray.length)];
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
      likes: getRandomNumber(minLikes, maxLikes),
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

/* ****************** */
/*      ГАЛЕРЕЯ       */
/* *****НАЧАЛО******* */

// создаем элемент разметки с фото
function renderPictures(picturesObj, pictureNumber) {
  var photosElement = photoItemsTemplate.cloneNode(true);

  photosElement.querySelector('img').src = picturesObj.url;
  photosElement.querySelector('.picture-comments').textContent = picturesObj.comments;
  photosElement.querySelector('.picture-likes').textContent = picturesObj.likes;

  // создание листерна picture  при клике на него
  photosElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    showGallery(pictureNumber);
  });

  return photosElement;
}

// отрисовка галереи
function showGallery(pictureIndex) {
  setActivePicture(pictureIndex);
  galleryOverlay.classList.remove('invisible');

  // добавление обработчика клика по кнопке закрытия галереи
  closeGalleryBtn.addEventListener('click', onGalleryCloseClick);

  // добавление обработчика нажатия на enter по кнопке закрытия галереи
  closeGalleryBtn.addEventListener('keydown', onCloseGalleryBtnEnter);

  // добавление обработчика нажатия на esc
  document.addEventListener('keydown', onGalleryEscPress);
}

// наполнение и отрисовка шаблона из массива
function showPictures(array, container) {
  // пустой фрагмент для наполнения
  var fragment = document.createDocumentFragment();

  array.forEach(function (pictureObj, pictureNumber) {
    fragment.appendChild(renderPictures(pictureObj, pictureNumber));
  });

  container.appendChild(fragment);
  uploadOverlay.classList.add('invisible');
}

// наполнение разметки гелереи
function setActivePicture(pictureIndex) {
  galleryImgUrl.src = photo[pictureIndex].url;
  galleryComments.textContent = photo[pictureIndex].comments;
  galleryLikes.textContent = photo[pictureIndex].likes;
}

// закрытие галереи по клику
function onGalleryCloseClick(evt) {
  closeGallery();
}

// закрытие галереи
function closeGallery(evt) {
  galleryOverlay.classList.add('invisible');

  // удаление обработчика клика по кнопке закрытия галереи
  closeGalleryBtn.removeEventListener('click', onGalleryCloseClick);

  // удаление обработчика закрытия галереи по нажатию на клавишу enter и фокусу на крестике
  closeGalleryBtn.removeEventListener('keydown', onCloseGalleryBtnEnter);

  // удаление обработчика нажатия на esc
  document.removeEventListener('keydown', onGalleryEscPress);
}

/* ****************** */
/*      ГАЛЕРЕЯ       */
/* *****КОНЕЦ*******  */

/* ****************** */
/* ФОРМА КАДРИРОВАНИЯ */
/* *****НАЧАЛО******* */

// закрытие формы кадрирования по клику
function onCloseUploadBtnClick(evt) {
  closeUpload();
}

// открытие формы кадрирования
function openUpload(evt) {
  uploadOverlay.classList.remove('invisible');
}

// закрытие формы кадрирования
function closeUpload(evt) {
  uploadOverlay.classList.add('invisible');
  document.removeEventListener('keydown', onUploadEscPress);
  closeUploadBtn.removeEventListener('click', onCloseUploadBtnClick);
  uploadDescription.removeEventListener('focus', onCommentFocusEnable);
  uploadDescription.removeEventListener('blur', onCommentFocusDisable);
}

// отмена закрытия формы пока фокус в поле коментариев кадрирования
function onCommentFocusEnable(evt) {
  document.removeEventListener('keydown', onUploadEscPress);
}

// отмена фокуса и возвраз обработчика esc
function onCommentFocusDisable(evt) {
  document.addEventListener('keydown', onUploadEscPress);
}

function onUploadFormChange(evt) {
  openUpload(evt);

  // закрытие формы кадрирования по ESC
  document.addEventListener('keydown', onUploadEscPress);

  // закрытие формы по клику на крестик
  closeUploadBtn.addEventListener('click', onCloseUploadBtnClick);

  // пока стоит фокус на коментариях форму не закрыть
  uploadDescription.addEventListener('focus', onCommentFocusEnable);

  // когда форма коментариев теряет фокус активируется esc
  uploadDescription.addEventListener('blur', onCommentFocusDisable);
}

// вывод формы кадрирования после выбора файла в input
uploadForm.addEventListener('change', onUploadFormChange);

/* ****************** */
/* ФОРМА КАДРИРОВАНИЯ */
/* *****КОНЕЦ******** */

showPictures(photo, pictures);
