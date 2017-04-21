'use strict';

window.gallery = (function () {
  // блок для отрисовки всех изображений
  var pictures = document.querySelector('.pictures');

  // блок для отрисовки галереи
  var galleryOverlay = document.querySelector('.gallery-overlay');

  // адрес фото галереи
  var galleryImg = galleryOverlay.querySelector('.gallery-overlay-image');

  // счетчик лайков галереи
  var galleryLikes = galleryOverlay.querySelector('.likes-count');

  // комментарии галереи
  var galleryComments = galleryOverlay.querySelector('.comments-count');

  // массив с фото, количеством лайков и комментарием
  var photo = window.data;

  // блок шаблона
  var photoItemsTemplate = window.utils.getTemplateClone('#picture-template', '.picture');

  // кнопка закрытия превью галереи
  var closeGalleryBtn = document.querySelector('.gallery-overlay-close');

  // обработчик нажатия enter на кнопку закрытия галереи
  var onGalleryCloseBtnEnter = window.utils.onKeyPress(ENTER_KEY_CODE, closeGallery);

  // обработчик нажатия esc на кнопку закрытия галереи
  var onGalleryEscPress = window.utils.onKeyPress(ESC_KEY_CODE, closeGallery);

  // блок кадрирования изображения
  var uploadOverlay = document.querySelector('.upload-overlay');

  // код клавиши enter
  var ENTER_KEY_CODE = 13;

  // код клавиши esc
  var ESC_KEY_CODE = 27;

  // создаем элемент разметки с фото
  function renderPictures(picturesObj, pictureNumber, callback) {
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

  // вставка правильной картинки в разметку/контейнер галереи
  function setActivePicture(pictureIndex) {
    galleryImg.src = photo[pictureIndex].url;
    galleryComments.textContent = photo[pictureIndex].comments;
    galleryLikes.textContent = photo[pictureIndex].likes;
  }

  // показываем галерею
  function showGallery(pictureIndex) {
    setActivePicture(pictureIndex);
    galleryOverlay.classList.remove('invisible');

    // добавление обработчика клика по кнопке закрытия галереи
    closeGalleryBtn.addEventListener('click', onGalleryCloseBtnClick);

    // добавление обработчика нажатия на enter по кнопке закрытия галереи
    closeGalleryBtn.addEventListener('keydown', onGalleryCloseBtnEnter);

    // добавление обработчика нажатия на esc
    document.addEventListener('keydown', onGalleryEscPress);
  }

  // отрисовка миниатюр  на страницу
  function showPictures(array, container) {
    // пустой фрагмент для наполнения
    var fragment = document.createDocumentFragment();

    array.forEach(function (pictureObj, pictureNumber) {
      fragment.appendChild(renderPictures(pictureObj, pictureNumber, showGallery));
    });

    container.appendChild(fragment);
    uploadOverlay.classList.add('invisible');
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

  showPictures(photo, pictures);
})();


