'use strict';

window.picture = (function () {
  // блок шаблона
  var photoItemsTemplate = window.utils.getTemplateClone('#picture-template', '.picture');

  // блок кадрирования изображения
  var uploadOverlay = document.querySelector('.upload-overlay');

  // создаем элемент разметки с фото
  function renderPictures(picturesObj, pictureNumber, photoArray, callback) {
    var photosElement = photoItemsTemplate.cloneNode(true);

    photosElement.querySelector('img').src = picturesObj.url;
    photosElement.querySelector('.picture-comments').textContent = picturesObj.comments;
    photosElement.querySelector('.picture-likes').textContent = picturesObj.likes;

    // добавление обработчика события при клике на миниатюру
    photosElement.addEventListener('click', function (evt) {
      evt.preventDefault();
      callback(pictureNumber, photoArray);
    });

    return photosElement;
  }

  return {

    // отрисовка миниатюр  на страницу
    showPictures: function (array, container, callback) {
      // пустой фрагмент для наполнения
      var fragment = document.createDocumentFragment();

      array.forEach(function (pictureObj, pictureNumber, picturesArray) {
        fragment.appendChild(renderPictures(pictureObj, pictureNumber, picturesArray, callback));
      });

      container.appendChild(fragment);
      uploadOverlay.classList.add('invisible');
    }
  };
})();
