'use strict';

window.picture = (function () {
// блок шаблона
  var photoItemsTemplate = window.utils.getTemplateClone('#picture-template', '.picture');

  return {
   // создаем элемент разметки с фото
    renderPictures: function (picturesObj, pictureNumber, callback) {
      var photosElement = photoItemsTemplate.cloneNode(true);

      photosElement.querySelector('img').src = picturesObj.url;
      photosElement.querySelector('.picture-comments').textContent = picturesObj.comments;
      photosElement.querySelector('.picture-likes').textContent = picturesObj.likes;

      // добавление обработчика события при клике на миниатюру
      photosElement.addEventListener('click', function (evt) {
        evt.preventDefault();
        callback(pictureNumber);
      });

      return photosElement;
    }
  };
})();
