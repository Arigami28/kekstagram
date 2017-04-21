'use strict';
window.data = (function () {
  return {
    // код клавиши enter
    ENTER_KEY_CODE: 13,

    // минимальное количество лайков
    MIN_LIKES: 15,

    // максимальное количество лайков
    MAX_LIKES: 200,

    // код клавиши esc
    ESC_KEY_CODE: 27,

    // блок шаблона
    photoItemsTemplate: window.utils.getTemplateClone('#picture-template', '.picture'),

    // массив комментариев
    COMMENTS: ['Всё отлично!', 'В целом всё неплохо. Но не всё.'],

    // создаем элемент разметки с фото
    renderPictures: function (picturesObj, pictureNumber, callback) {
      var photosElement = window.data.photoItemsTemplate.cloneNode(true);

      photosElement.querySelector('img').src = picturesObj.url;
      photosElement.querySelector('.picture-comments').textContent = picturesObj.comments;
      photosElement.querySelector('.picture-likes').textContent = picturesObj.likes;

      // добавление обработчика события при клике на миниатюру
      photosElement.addEventListener('click', function (evt) {
        evt.preventDefault();
        callback(pictureNumber);
      });

      return photosElement;
    },
    // генерации объектов для элементов массива с фото, количеством лайков и комментарием
    getPhotoItems: function (item) {
      var photoItems = [];

      for (var i = 0; i < item; i++) {
        photoItems[i] = {
          url: 'photos/' + (i + 1) + '.jpg',
          likes: window.utils.getRandomNumber(window.data.MIN_LIKES, window.data.MAX_LIKES),
          comments: window.data.COMMENTS[window.utils.getRandomItemAray(window.data.COMMENTS)]
        };
      }

      return photoItems;
    },
  };
}());
