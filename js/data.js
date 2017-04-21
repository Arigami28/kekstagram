'use strict';
window.data = (function () {

  // минимальное количество лайков
  var MIN_LIKES = 15;

  // максимальное количество лайков
  var MAX_LIKES = 200;

  // количество фото
  var AMOUNT_OF_PHOTO = 25;

  // массив комментариев
  var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.'];

  // генерации объектов для элементов массива с фото, количеством лайков и комментарием
  function getPhotoItems(amountOfItems) {
    var photoItems = [];

    for (var i = 0; i < amountOfItems; i++) {
      photoItems[i] = {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: window.utils.getRandomNumber(MIN_LIKES, MAX_LIKES),
        comments: COMMENTS[window.utils.getRandomItemAray(COMMENTS)]
      };
    }

    return photoItems;
  }

  return getPhotoItems(AMOUNT_OF_PHOTO);
})();
