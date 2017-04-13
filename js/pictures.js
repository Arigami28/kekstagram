'use strict';

// блок шаблона
var photoItemsTemplate = getTemplateClone('#picture-template', '.picture');

// блок кадрирования изображения
var uploadOverlay = document.querySelector('.upload-overlay');

// блок для отрисовки всех изображений
var pictures = document.querySelector('.pictures');

// блок для отрисовки превью галереи
var galleryOverlay = document.querySelector('.gallery-overlay');

// пустой фрагмент для наполнения
var fragment = document.createDocumentFragment();

// массив комментариев
var commentsArray = ['Всё отлично!', 'В целом всё неплохо. Но не всё.'];

// количество фото
var amountOfPhoto = 25;

// счетчик лайков превью галереи
var galleryLikes = galleryOverlay.querySelector('.likes-count');

// комментарии превью галереи
var galleryComments = galleryOverlay.querySelector('.comments-count');

// адрес фото превью галереи
var galleryImgUrl = galleryOverlay.querySelector('.gallery-overlay-image');

// минимальное количество лайков
var minLikes = 15;

// максимальное количество лайков
var maxLikes = 200;

// массив с фото, количеством лайков и комментарием
var photo = getPhotoItems(amountOfPhoto);

// кнопка закрития превью галереи
var closeUploadBtn = galleryOverlay.querySelector('.gallery-overlay-close');

// код клавиши esc
var ESC_KEY_CODE = 27;

// код клавиши enter
var ENTER_KEY_CODE = 13;

// закрытие галереи по enter
var onEnterGalleryClose = onKeyPress(ENTER_KEY_CODE, closeGallery);

// закрытие галереи по esc
var onEscGalleryClose = onKeyPress(ESC_KEY_CODE, closeGallery);

// закрытие формы кадрирования по esc
var onEscUploadClose = onKeyPress(ESC_KEY_CODE, closeUpload);

// блок формы закрузки фотографий
var uploadForm = document.querySelector('.upload-form');

// кнопка Закрыть на форме upload
var closeGalleryBtn = document.querySelector('.upload-form-cancel');

// поле комментариев формы upload
var uploadDescription = document.querySelector('.upload-form-description');

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

// проверка и поиск шаблона
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

// генерация галереи
function showGallery(pictureIndex) {
  setActivePicture(pictureIndex);
  galleryOverlay.classList.remove('invisible');

  // создание листнера на кнопку крести в галереи
  closeUploadBtn.addEventListener('click', onGalleryCloseClick);

  // создание листнера на нажатие enter на кнопке крестик в галелери
  closeUploadBtn.addEventListener('keydown', onEnterGalleryClose);

  // создание листнера на кнопку esc
  document.addEventListener('keydown', onEscGalleryClose);
}

// наполнение и отрисовка шаблона из массива
function showPictures(array, container) {
  array.forEach(function (pictureObj, pictureNumber) {
    fragment.appendChild(renderPictures(pictureObj, pictureNumber));
  });

  container.appendChild(fragment);
  uploadOverlay.classList.add('invisible');
}

// рендеринг элементов объекта гелереи
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

  // удаление листнера на кнопку крести в галелери
  closeUploadBtn.removeEventListener('click', onGalleryCloseClick);

  // удаляем обработчик закрытия галереи по нажатию на клавишу enter и фокусу на крестике
  closeUploadBtn.removeEventListener('keydown', onEnterGalleryClose);

  // удаление листнера на кнопку esc
  document.removeEventListener('keydown', onEscGalleryClose);
}

/* ****************** */
/*      ГАЛЕРЕЯ       */
/* *****КОНЕЦ*******  */

/* ****************** */
/* ФОРМА КАДРИРОВАНИЯ */
/* *****НАЧАЛО******* */

// закрытие формы кадрирование по клику
function onClickCloseUpload(evt) {
  closeUpload();
}

// открытие формы кадрирование
function openUpload(evt) {
  uploadOverlay.classList.remove('invisible');
}

// закрытие формы кадрирование
function closeUpload(evt) {
  uploadOverlay.classList.add('invisible');
  document.removeEventListener('keydown', onEscUploadClose);
  closeGalleryBtn.removeEventListener('click', onClickCloseUpload);
  uploadDescription.removeEventListener('focus', focusComment);
}

// отмена закрытия формы пока фокус в поле коментариев кадрирования
function focusComment(evt) {
  document.removeEventListener('keydown', onEscUploadClose);
}

// вывод формы кадрирования после выбора файла в input
uploadForm.addEventListener('change', function (evt) {
  openUpload(evt);

  // закрытие формы кадрирование по ESC
  document.addEventListener('keydown', onEscUploadClose);

  // закрытие формы по клику на крестик
  closeGalleryBtn.addEventListener('click', onClickCloseUpload);

  // пока стоит фокус на коментариях форму не закрыть
  uploadDescription.addEventListener('focus', focusComment);
});

/* ****************** */
/* ФОРМА КАДРИРОВАНИЯ */
/* *****КОНЕЦ******** */

showPictures(photo, pictures);
