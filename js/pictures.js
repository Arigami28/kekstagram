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

// генерация случайного комментария
var getRandomComments = function () {
  return commentsArray[Math.floor(Math.random() * commentsArray.length)];
};

// количество фото
var amountOfPhoto = 25;

// массив с фото, количеством лайков и комментарием
var photo = getPhotoItems(amountOfPhoto);

// минимальное количество лайков
var min = 15;

// максимальное количество лайков
var max = 200;

// получение случного числа лайков
function getRandomNumberLikes(minLikes, maxLikes) {
  return (Math.random() * (max - min) + min).toFixed(0);
}

// генерации объектов для элементов массива с фото, количеством лайков и комментарием
function getPhotoItems(item) {
  var photoItems = [];

  for (var i = 0; i < item; i++) {
    photoItems[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumberLikes(min, max),
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
function showPictures(array) {

  array.forEach(function (item) {
    fragment.appendChild(renderPictures(item));
  });

  pictures.appendChild(fragment);
  uploadOverlay.classList.add('invisible');
}

// генерация содержимого превью галлереи
function showGalleryPreview(item) {
  galleryOverlay.querySelector('.gallery-overlay-image').src = item[1].url;
  galleryOverlay.querySelector('.comments-count').textContent = item[1].comments;
  galleryOverlay.querySelector('.likes-count').textContent = item[1].likes;
  galleryOverlay.classList.remove('invisible');
}

showPictures(photo);
showGalleryPreview(photo);
