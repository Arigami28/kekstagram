'use strict';

// блок шаблона
var photoItemsTemplate = document.querySelector('#picture-template').content;

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
var closeButton = galleryOverlay.querySelector('.gallery-overlay-close');

// код клавиши esc
var ESC_KEY_CODE = 27;

// код клавиши enter
var ENTER_KEY_CODE = 13;

// открытие галереи по enter
var onEnterGalleryOpen = onKeyPress(ENTER_KEY_CODE, openGallery);

// закрытие галереи по enter
var onEnterGalleryClose = onKeyPress(ENTER_KEY_CODE, closeGallery);

// закрытие галереи по esc
var onEscGalleryClose = onKeyPress(ESC_KEY_CODE, closeGallery);

// закрытие формы кадрирования по esc
var onEscUploadClose = onKeyPress(ESC_KEY_CODE, closeUpload);

// закрытие формы кадрирования по enter
var onEnterUploadClose = onKeyPress(ENTER_KEY_CODE, closeUpload);

// блок формы закрузки фотографий
var uploadForm = document.querySelector('.upload-form');

// кнопка Закрыть на форме upload
var uploadFormCanselBtn = document.querySelector('.upload-form-cancel');

// кнопка Отправить на форме upload
var uploadFormSubmitBtn = document.querySelector('.upload-form-submit');

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

// создаем элемент разметки с фото
function renderPictures(picturesObj) {
  var photosElement = photoItemsTemplate.cloneNode(true);

  photosElement.querySelector('img').src = picturesObj.url;
  photosElement.querySelector('.picture-comments').textContent = picturesObj.comments;
  photosElement.querySelector('.picture-likes').textContent = picturesObj.likes;

  return photosElement;
}

// наполнение и отрисовка шаблона из массива
function showPictures(array, container) {
  array.forEach(function (item) {
    fragment.appendChild(renderPictures(item));
  });

  container.appendChild(fragment);
  uploadOverlay.classList.add('invisible');

  // создание листерна picture  при клике на него (генерируется окно с тем же фото на которое и было нажатие)
  pictures.addEventListener('click', onPicturesClick);

  // создание листерна picture  по нажатии Enter
  pictures.addEventListener('keydown', onEnterGalleryOpen);
}

// генерация галереи
function showGallery(picturesArray, pictureIndex) {
  galleryImgUrl.src = picturesArray[pictureIndex].url;
  galleryComments.textContent = picturesArray[pictureIndex].comments;
  galleryLikes.textContent = picturesArray[pictureIndex].likes;
  galleryOverlay.classList.remove('invisible');

  // создание листнера на кнопку крести в галереи
  closeButton.addEventListener('click', onGalleryCloseClick);

  // создание листнера на кнопку esc
  document.addEventListener('keydown', onEscGalleryClose);

  // создание листнера на нажатие enter на кнопке крестик в галелери
  document.addEventListener('keydown', onEnterGalleryClose);

  // удаление листерна picture  при клике на него
  pictures.removeEventListener('click', onPicturesClick);

  // удаление листерна picture  по нажатии Enter
  pictures.removeEventListener('keydown', onEnterGalleryOpen);
}

// получаем индекс правильной картинки в массиве объектов с данными по картинкам
function getPictureIndex(evt) {
  // для клика
  if (evt.target.tagName === 'IMG') {
    var adressPhoto = evt.target.attributes.src.nodeValue;
    getIndexGallery(adressPhoto, photo);
  }

  // для tab + enter
  if (evt.target.tagName === 'A') {
    var adressPhoto2 = evt.target.children[0].attributes.src.value;
    getIndexGallery(adressPhoto2, photo);
  }
}

// обрабатываем индекс правильной картинки при деиствиях с picture
function getIndexGallery(photoItem, photoArray) {
  photoArray.forEach(function (item, i, array) {
    if (photoItem === item.url) {
      showGallery(array, i);
    }
  });
}

// открытие галереи по клику
function onPicturesClick(evt) {
  evt.preventDefault();
  getPictureIndex(evt);
}

// закрытие галереи по клику
function onGalleryCloseClick(evt) {
  closeGallery();
}

// открытие галереи
function openGallery(evt) {
  pictures.removeEventListener('keydown', onEnterGalleryOpen);
  galleryOverlay.classList.remove('invisible');
}

// закрытие галереи
function closeGallery(evt) {

  galleryOverlay.classList.add('invisible');

  // удаление листнера на кнопку крести в галелери
  closeButton.removeEventListener('click', onGalleryCloseClick);

  // удаляем обработчик закрытия галереи по нажатию на клавишу enter и фокусу на крестике
  document.removeEventListener('keydown', onEnterGalleryClose);

  // удаление листнера на кнопку esc
  document.removeEventListener('keydown', onEscGalleryClose);

  // создание листерна picture  по нажатии Enter
  pictures.addEventListener('keydown', onEnterGalleryOpen);

  // создание листерна picture  при клике на него
  pictures.addEventListener('click', onPicturesClick);
}

// закрытие формы кадрирование
function closeUpload(evt) {
  uploadOverlay.classList.add('invisible');
  document.removeEventListener('keydown', onEscUploadClose);
  uploadFormCanselBtn.removeEventListener('click', onClickCloseUpload);

  // создание листерна picture  при клике на него (генерируется окно с тем же фото на которое и было нажатие)
  pictures.addEventListener('click', onPicturesClick);

  // создание листерна picture  по нажатии Enter
  document.addEventListener('keydown', onEnterGalleryOpen);
}

// открытие формы кадрирование
function openUpload(evt) {
  uploadOverlay.classList.remove('invisible');
  pictures.removeEventListener('click', onPicturesClick);
  document.removeEventListener('keydown', onEnterGalleryOpen);
}

// закрытие формы кадрирование по клику
function onClickCloseUpload(evt) {
  evt.preventDefault();
  closeUpload();
}

// отмена закрытия формы пока фокус в поле коментариев кадрирования
function focusComment(evt) {
  document.removeEventListener('keydown', onEscUploadClose);
  uploadFormCanselBtn.removeEventListener('click', onClickCloseUpload);
  uploadFormSubmitBtn.removeEventListener('click', onClickCloseUpload);
}

// вывод формы кадрирования после выбора файла в input
uploadForm.addEventListener('change', function (evt) {
  openUpload(evt);

  // закрытие формы кадрирование по ESC
  document.addEventListener('keydown', onEscUploadClose);

  // закрытие формы по клику на крестик
  uploadFormCanselBtn.addEventListener('click', onClickCloseUpload);

  // закрытие формы по нажатию на крестик через Enter
  document.addEventListener('keydown', onEnterUploadClose);

  // закрытие формы по клику на кнопке Отправить
  uploadFormSubmitBtn.addEventListener('click', onClickCloseUpload);


  uploadDescription.addEventListener('focus', focusComment);

});

showPictures(photo, pictures);
