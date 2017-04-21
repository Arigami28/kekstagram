'use strict';

window.gallery = (function () {

  // блок для отрисовки галереи
  var galleryOverlay = document.querySelector('.gallery-overlay');

  // адрес фото галереи
  var galleryImg = galleryOverlay.querySelector('.gallery-overlay-image');

  // счетчик лайков галереи
  var galleryLikes = galleryOverlay.querySelector('.likes-count');

  // комментарии галереи
  var galleryComments = galleryOverlay.querySelector('.comments-count');

  // кнопка закрытия превью галереи
  var closeGalleryBtn = document.querySelector('.gallery-overlay-close');

  // обработчик нажатия enter на кнопку закрытия галереи
  var onGalleryCloseBtnEnter = window.utils.onKeyPress(window.utils.ENTER_KEY_CODE, closeGallery);

  // обработчик нажатия esc на кнопку закрытия галереи
  var onGalleryEscPress = window.utils.onKeyPress(window.utils.ESC_KEY_CODE, closeGallery);

  // вставка правильной картинки в разметку/контейнер галереи
  function setActivePicture(pictureIndex, photoArray) {
    galleryImg.src = photoArray[pictureIndex].url;
    galleryComments.textContent = photoArray[pictureIndex].comments;
    galleryLikes.textContent = photoArray[pictureIndex].likes;
  }

  // обработчик события клик на кнопке закрытия галереи
  function onGalleryCloseBtnClick() {
    closeGallery();
  }

  // закрытие галереи
  function closeGallery() {
    galleryOverlay.classList.add('invisible');

    // удаление обработчика клика по кнопке закрытия галереи
    closeGalleryBtn.removeEventListener('click', onGalleryCloseBtnClick);

    // удаление обработчика закрытия галереи по нажатию на клавишу enter и фокусу на крестике
    closeGalleryBtn.removeEventListener('keydown', onGalleryCloseBtnEnter);

    // удаление обработчика нажатия на esc
    document.removeEventListener('keydown', onGalleryEscPress);
  }

  return {
  // показываем галерею
    showGallery: function (pictureIndex, photoArray) {
      setActivePicture(pictureIndex, photoArray);
      galleryOverlay.classList.remove('invisible');

      // добавление обработчика клика по кнопке закрытия галереи
      closeGalleryBtn.addEventListener('click', onGalleryCloseBtnClick);

      // добавление обработчика нажатия на enter по кнопке закрытия галереи
      closeGalleryBtn.addEventListener('keydown', onGalleryCloseBtnEnter);

      // добавление обработчика нажатия на esc
      document.addEventListener('keydown', onGalleryEscPress);
    }
  };
})();


