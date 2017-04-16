'use strict';

// массив комментариев
var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.'];

// количество фото
var AMOUNT_OF_PHOTO = 25;

// массив фильтров изображения в форме upload
var FILTER_CLASS = ['filter-chrome', 'filter-sepia', 'filter-marvin', 'filter-phobos', 'filter-heat', 'filter-none'];

// минимальное количество лайков
var MIN_LIKES = 15;

// максимальное количество лайков
var MAX_LIKES = 200;

// код клавиши esc
var ESC_KEY_CODE = 27;

// код клавиши enter
var ENTER_KEY_CODE = 13;

// максимальный размер изображения
var MAX_RESIZE = '100%';

// минимальный размер изображения
var MIN_RESIZE = '25%';

// шаг изменения изображения
var STEP_RESIZE = 25;

// блок шаблона
var photoItemsTemplate = getTemplateClone('#picture-template', '.picture');

// блок для отрисовки всех изображений
var pictures = document.querySelector('.pictures');

// блок для отрисовки галереи
var galleryOverlay = document.querySelector('.gallery-overlay');

// счетчик лайков галереи
var galleryLikes = galleryOverlay.querySelector('.likes-count');

// комментарии галереи
var galleryComments = galleryOverlay.querySelector('.comments-count');

// адрес фото галереи
var galleryImg = galleryOverlay.querySelector('.gallery-overlay-image');

// массив с фото, количеством лайков и комментарием
var photo = getPhotoItems(AMOUNT_OF_PHOTO);

// кнопка закрытия превью галереи
var closeGalleryBtn = document.querySelector('.gallery-overlay-close');

// обработчик нажатия enter на кнопку закрытия галереи
var onGalleryCloseBtnEnter = onKeyPress(ENTER_KEY_CODE, closeGallery);

// обработчик нажатия esc на кнопку закрытия галереи
var onGalleryEscPress = onKeyPress(ESC_KEY_CODE, closeGallery);

// блок кадрирования изображения
var uploadOverlay = document.querySelector('.upload-overlay');

// блок фильтров изображений
var uploadFilter = document.querySelector('.upload-filter-controls');

// блок формы загкрузки фотографий
var uploadForm = document.querySelector('.upload-form');

// поле комментариев формы upload
var uploadComments = uploadOverlay.querySelector('.upload-form-description');

// кнопка Закрыть на форме upload
var closeUploadBtn = uploadOverlay.querySelector('.upload-form-cancel');

// поле изменения размера изображения в форме upload
var uploadBtnResize = uploadOverlay.querySelector('.upload-resize-controls');

// кнопка  уменьшения изображения в форме кадрирования
var btnMinusClass = uploadBtnResize.querySelector('.upload-resize-controls-button-dec');

// кнопка  увеличения изображения в форме кадрирования
var btnPlusClass = uploadBtnResize.querySelector('.upload-resize-controls-button-inc');

// поле отображение размера изображения
var uploadInputBtnResize = uploadBtnResize.querySelector('input[type="text"]');

// обработчик нажатия esc на кнопку закрытия формы кадрирования
var onUploadEscPress = onKeyPress(ESC_KEY_CODE, onCloseUploadBtnClick);

// превью формы кадрирования
var uploadFormPreview = document.querySelector('.filter-image-preview');

// обработчик ввода коментариев в форме кадрирования
var onUploadCommentsEscPress = onKeyPress(ESC_KEY_CODE, function (evt) {
  evt.stopPropagation();
});

// Нажатие клавиш
function onKeyPress(keyCode, callback) {
  return function (evt) {
    if (evt.keyCode === keyCode) {
      callback(evt);
    }
  };
}

// генерация случайного комментария
function getRandomComments() {
  return COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
}

// получение случного числа лайков
function getRandomNumber(min, max) {
  return (Math.random() * (max - min) + min).toFixed(0);
}

// генерации объектов для элементов массива с фото, количеством лайков и комментарием
function getPhotoItems(item) {
  var photoItems = [];

  for (var i = 0; i < item; i++) {
    photoItems[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
      comments: getRandomComments()
    };
  }

  return photoItems;
}

// получение нужного дом-элемента из шаблона для клонирования
function getTemplateClone(template, innerSelector) {
  var templateElement = document.querySelector(template);
  var elementToClone;

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector(innerSelector);
  } else {
    elementToClone = templateElement.querySelector(innerSelector);
  }

  return elementToClone;
}

// создаем элемент разметки с фото
function renderPictures(picturesObj, pictureNumber) {
  var photosElement = photoItemsTemplate.cloneNode(true);

  photosElement.querySelector('img').src = picturesObj.url;
  photosElement.querySelector('.picture-comments').textContent = picturesObj.comments;
  photosElement.querySelector('.picture-likes').textContent = picturesObj.likes;

  // добавление обработчика события при клике на миниатюру
  photosElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    showGallery(pictureNumber);
  });

  return photosElement;
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
    fragment.appendChild(renderPictures(pictureObj, pictureNumber));
  });

  container.appendChild(fragment);
  uploadOverlay.classList.add('invisible');
}

// вставка правильной картинки в разметку/контейнер галереи
function setActivePicture(pictureIndex) {
  galleryImg.src = photo[pictureIndex].url;
  galleryComments.textContent = photo[pictureIndex].comments;
  galleryLikes.textContent = photo[pictureIndex].likes;
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

// обработчик  закрытия формы кадрирования
function onCloseUploadBtnClick() {
  uploadOverlay.classList.add('invisible');

  document.removeEventListener('keydown', onUploadEscPress);
  closeUploadBtn.removeEventListener('click', onCloseUploadBtnClick);
  uploadComments.removeEventListener('keydown', onUploadCommentsEscPress);
  uploadFilter.removeEventListener('click', onUploadFilterClick);
  uploadBtnResize.removeEventListener('click', onUploadClickResize);
}

// обработчик клика на фильтры формы кадрирования
function onUploadFilterClick(evt) {
  var target = evt.target;
  if (target.checked) {
    classDelete(FILTER_CLASS, uploadFormPreview);
    var inputValue = target.value;

    document.querySelector('.filter-image-preview').classList.add('filter-' + inputValue);
  }
}

// удаление всех не нужных классов у объекта
function classDelete(arrayClass, path) {
  arrayClass.forEach(function (item) {
    path.classList.remove(item);
  });
}

// обработчик изменения размера изображения
function onUploadClickResize(evt) {
  if (evt.target === btnMinusClass) {

    if (uploadInputBtnResize.value !== MIN_RESIZE) {
      var sizeValueMinus = +uploadInputBtnResize.value.replace(/\D/gi, ' ') - STEP_RESIZE;
      uploadInputBtnResize.setAttribute('value', sizeValueMinus + '%');
      uploadFormPreview.style.transform = 'scale(' + sizeValueMinus / 100 + ')';
    }
  }

  if (evt.target === btnPlusClass) {

    if (uploadInputBtnResize.value !== MAX_RESIZE) {
      var sizeValuePlus = +uploadInputBtnResize.value.replace(/\D/gi, ' ') + STEP_RESIZE;
      uploadInputBtnResize.setAttribute('value', sizeValuePlus + '%');
      uploadFormPreview.style.transform = 'scale(' + sizeValuePlus / 100 + ')';
    }
  }

}

// открытие формы кадрирования
function onUploadFormChange() {
  uploadOverlay.classList.remove('invisible');

  // закрытие формы кадрирования по ESC
  document.addEventListener('keydown', onUploadEscPress);

  // закрытие формы по клику на крестик
  closeUploadBtn.addEventListener('click', onCloseUploadBtnClick);

  // пока идет ввод в коментариях, форму не закрыть
  uploadComments.addEventListener('keydown', onUploadCommentsEscPress);

  // применение фильта к изображению
  uploadFilter.addEventListener('click', onUploadFilterClick);

  // изменение размера превью по клику
  uploadBtnResize.addEventListener('click', onUploadClickResize);
}

// вывод формы кадрирования после выбора файла в input
uploadForm.addEventListener('change', onUploadFormChange);

showPictures(photo, pictures);
