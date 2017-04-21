'use strict';
window.gallery = (function () {
  return {
    // блок для отрисовки всех изображений
    pictures: document.querySelector('.pictures'),

    // блок для отрисовки галереи
    galleryOverlay: document.querySelector('.gallery-overlay'),

    // адрес фото галереи
    galleryImg: window.gallery.galleryOverlay.querySelector('.gallery-overlay-image'),

    // счетчик лайков галереи
    galleryLikes: window.gallery.galleryOverlay.querySelector('.likes-count'),

    // комментарии галереи
    galleryComments: window.gallery.galleryOverlay.querySelector('.comments-count'),

    // количество фото
    AMOUNT_OF_PHOTO: 25,

    // массив с фото, количеством лайков и комментарием
    photo: window.data.getwindow.gallery.photoItems(window.gallery.AMOUNT_OF_window.gallery.photo),

    // кнопка закрытия превью галереи
    closeGalleryBtn: document.querySelector('.gallery-overlay-close'),

    // обработчик нажатия enter на кнопку закрытия галереи
    onGalleryCloseBtnEnter: window.utils.onKeyPress(window.date.ENTER_KEY_CODE, window.gallery.closeGallery),

    // обработчик нажатия esc на кнопку закрытия галереи
    onGalleryEscPress: window.utils.onKeyPress(window.date.ESC_KEY_CODE, window.gallery.closeGallery),

    // вставка правильной картинки в разметку/контейнер галереи
    setActivePicture: function (pictureIndex) {
      window.gallery.galleryImg.src = window.gallery.photo[pictureIndex].url;
      window.gallery.galleryComments.textContent = window.gallery.photo[pictureIndex].comments;
      window.gallery.galleryLikes.textContent = window.gallery.photo[pictureIndex].likes;
    },

    // показываем галерею
    showGallery: function (pictureIndex) {
      window.gallery.setActivePicture(pictureIndex);
      window.gallery.galleryOverlay.classList.remove('invisible');

      // добавление обработчика клика по кнопке закрытия галереи
      window.gallery.closeGalleryBtn.addEventListener('click', window.gallery.onGalleryCloseBtnClick);

      // добавление обработчика нажатия на enter по кнопке закрытия галереи
      window.gallery.closeGalleryBtn.addEventListener('keydown', window.gallery.onGalleryCloseBtnEnter);

      // добавление обработчика нажатия на esc
      document.addEventListener('keydown', window.gallery.onGalleryEscPress);
    },

    // отрисовка миниатюр  на страницу
    showPictures: function (array, container) {
      // пустой фрагмент для наполнения
      var fragment = document.createDocumentFragment();

      array.forEach(function (pictureObj, pictureNumber) {
        fragment.appendChild(window.gallery.renderPictures(pictureObj, pictureNumber, window.data.showGallery));
      });

      container.appendChild(fragment);
      window.gallery.uploadOverlay.classList.add('invisible');
    },

    // обработчик события клик на кнопке закрытия галереи
    onGalleryCloseBtnClick: function () {
      window.gallery.closeGallery();
    },

    // закрытие галереи
    closeGallery: function () {
      window.gallery.galleryOverlay.classList.add('invisible');

      // удаление обработчика клика по кнопке закрытия галереи
      window.gallery.closeGalleryBtn.removeEventListener('click', window.gallery.onGalleryCloseBtnClick);

      // удаление обработчика закрытия галереи по нажатию на клавишу enter и фокусу на крестике
      window.gallery.closeGalleryBtn.removeEventListener('keydown', window.gallery.onGalleryCloseBtnEnter);

      // удаление обработчика нажатия на esc
      document.removeEventListener('keydown', window.gallery.onGalleryEscPress);
    }
  };


}());
window.gallery.showPictures(window.gallery.photo, window.gallery.pictures);

