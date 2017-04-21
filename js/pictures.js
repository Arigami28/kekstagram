'use strict';

window.pictures = (function () {
  // массив с фото, количеством лайков и комментарием
  var photo = window.data;

  // блок для отрисовки всех изображений
  var pictures = document.querySelector('.pictures');

  window.picture.showPictures(photo, pictures, window.gallery.showGallery);
})();
