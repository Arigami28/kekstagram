'use strict';

// блок шаблона
var photoItemsTemplate = document.querySelector('#picture-template').content;

// блок upload-overlay
var uploadOverlay = document.querySelector('.upload-overlay');

// блок pictures
var pictures = document.querySelector('.pictures');

// блок галлерея
var galleryOverlay = document.querySelector('.gallery-overlay');

// пустой фрагмент для наполнения
var fragment = document.createDocumentFragment();

// массив комментариев
var commentsArray = ['Всё отлично!', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.'];

// генерация случайного комментария
var getRandomComments = function () {

  return commentsArray[Math.floor(Math.random() * commentsArray.length)];
};

// количество фото
var amountOfPhoto = 25;

// получение случного числа лайков
function getRandomNumberLikes() {
  var min = 15;
  var max = 200;

  return (Math.random() * (max - min) + min).toFixed(0);
}

// генерации объектов для элементов массива с фото, количеством лайков и комментарием
function getPhotoItems(item) {
  var photoItems = [];

  for (var i = 1; i <= item; i++) {
    photoItems[i] = {
      url: 'photos/' + i + '.jpg',
      likes: getRandomNumberLikes(),
      comments: getRandomComments()
    };
  }

  return photoItems;
}

// массив с фото, количеством лайков и комментарием
var photo = getPhotoItems(amountOfPhoto);

// наполнение и отрисовка шаблона из массива
function showPictures(array) {

  array.forEach(function (item) {
    var photosElement = photoItemsTemplate.cloneNode(true);

    photosElement.querySelector('img').src = item.url;
    photosElement.querySelector('.picture-comments').textContent = item.comments;
    photosElement.querySelector('.picture-likes').textContent = item.likes;

    fragment.appendChild(photosElement);
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
