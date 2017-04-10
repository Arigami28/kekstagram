'use strict';

// блок шаблона
var photoItemsTemplate = document.querySelector('#picture-template').content;

// блок кадрирования изображения
var uploadOverlay = document.querySelector('.upload-overlay');

// блок для отрисовки всех изображений
var pictures = document.querySelector('.pictures');

// блок для отрисовки превью галереи
var galleryOverlay = document.querySelector('.gallery-overlay');

// пустой фрагмент для наполнения
var fragment = document.createDocumentFragment();

// массив комментариев
var commentsArray = ['Всё отлично!', 'В целом всё неплохо. Но не всё.'];

// количество фото
var amountOfPhoto = 25;

// индекс фото , для вставки фото в превью галереи
var galleryIndexPhotoShift = 1;

// счетчик лайков превью галереи
var galleryLikes = galleryOverlay.querySelector('.likes-count');

// комментарии превью галереи
var galleryComments = galleryOverlay.querySelector('.comments-count');

// адрес фото превью галереи
var galleryImgUrl = galleryOverlay.querySelector('.gallery-overlay-image');

// минимальное количество лайков
var minLikes = 15;

// максимальное количество лайков
var maxLikes = 200;

// массив с фото, количеством лайков и комментарием
var photo = getPhotoItems(amountOfPhoto);

// блок формы закрузки фотографий
var uploadForm = document.querySelector('.upload-form');

// кнопка Закрыть на форме upload
var uploadFormCanselBtn = document.querySelector('.upload-form-cancel');

// кнопка Отправить на форме upload
var uploadFormSubmitBtn = document.querySelector('.upload-form-submit');

// закрытие формы кадрирование по enter
var onEnterCloseUpload = function (evt) {
  if (evt.keyCode === 13) {
    uploadOverlay.classList.add('invisible');
  }
};

// закрытие формы кадрирование по клику
var onClickCloseUpload = function (evt) {
  evt.preventDefault();
  uploadOverlay.classList.add('invisible');
};

// закрытие формы кадрирование по esc
var onEscCloseUpload = function (evt) {
  if (evt.keyCode === 27) {
    uploadOverlay.classList.add('invisible');
  }
};

// кнопка закрития превью галереи
var closeGalleryPreview = galleryOverlay.querySelector('.gallery-overlay-close');

// сопостовление фото и превью ,а так же  их вывод в превию
var openPreviewPhoto = function (evt) {
  var target = evt.target;
  while (target !== target.target) {
    if (target.tagName === 'A') {
      var imgIndex = (target.children[0].attributes.src.value).replace(/\D/ig, '') - galleryIndexPhotoShift;
      showGalleryPreview(photo, imgIndex);
      return;
    }
    target = target.parentNode;
  }
};

// закрытие превью по нажатию на esc
var onEscClosePreview = function (evt) {
  if (evt.keyCode === 27) {
    galleryOverlay.classList.add('invisible');
  }
};

// открытие превью по нажатию enter через фокус
var onEnterOpenPreview = function (evt) {
  if (evt.keyCode === 13) {
    openPreviewPhoto(evt);
  }
};

//  закрытие превью по нажатию enter через фокус
var onEnterClosePreview = function (evt) {
  if (evt.keyCode === 13) {
    galleryOverlay.classList.add('invisible');
  }
};

// закрытие превью по клику
var onClickClosePreview = function (evt) {
  galleryOverlay.classList.add('invisible');
};


// генерация случайного комментария
function getRandomComments() {
  return commentsArray[Math.floor(Math.random() * commentsArray.length)];
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
      likes: getRandomNumber(minLikes, maxLikes),
      comments: getRandomComments()
    };
  }

  return photoItems;
}

// создаем элемент разметки с фото
function renderPictures(picturesObj) {
  var photosElement = photoItemsTemplate.cloneNode(true);

  photosElement.querySelector('img').src = picturesObj.url;
  photosElement.querySelector('.picture-comments').textContent = picturesObj.comments;
  photosElement.querySelector('.picture-likes').textContent = picturesObj.likes;

  return photosElement;
}

// наполнение и отрисовка шаблона из массива
function showPictures(array, container) {
  array.forEach(function (item) {
    fragment.appendChild(renderPictures(item));
  });

  container.appendChild(fragment);
  uploadOverlay.classList.add('invisible');
}

// генерация содержимого превью галлереи
function showGalleryPreview(item, index) {
  galleryImgUrl.src = item[index].url;
  galleryComments.textContent = item[index].comments;
  galleryLikes.textContent = item[index].likes;
  galleryOverlay.classList.remove('invisible');
}

showPictures(photo, pictures);

// генерация открытия превью фото при клике на него (генерируется окно с тем же фото на которое и было нажатие)
pictures.addEventListener('click', function (evt) {
  evt.preventDefault();
  openPreviewPhoto(evt);

  // закрытие превью по esc
  pictures.addEventListener('keydown', function (event) {
    onEscClosePreview(event);
  });

});

// открытие превью по нажатии Enter
pictures.addEventListener('keydown', function (evt) {
  onEnterOpenPreview(evt);
});

// закрытие превью по esc
pictures.addEventListener('keydown', function (evt) {
  onEscClosePreview(evt);
});

// закрытие превью по клику на крестик
closeGalleryPreview.addEventListener('click', function (evt) {
  onClickClosePreview(evt);
});

// закрытие превью по нажатии Enter на крестик
closeGalleryPreview.addEventListener('keydown', function (evt) {
  onEnterClosePreview(evt);
});

// вывод формы кадрирования после выбора файла в input
uploadForm.addEventListener('change', function (evt) {
  uploadOverlay.classList.remove('invisible');

  // закрытие формы кадрирование по ESC
  document.addEventListener('keydown', function (event) {
    onEscCloseUpload(event);
  });
});

// закрытие формы по клику на крестик
uploadFormCanselBtn.addEventListener('click', function (evt) {
  onClickCloseUpload(evt);
});

// закрытие формы по нажатию на крестик через Enter
uploadFormCanselBtn.addEventListener('keydown', function (evt) {
  onEnterCloseUpload(evt);
});

// закрытие формы по клику на кнопке Отправить
uploadFormSubmitBtn.addEventListener('click', function (evt) {
  onClickCloseUpload(evt);
});

// закрытие формы по нажатию на Отправить через Enter
uploadFormSubmitBtn.addEventListener('keydown', function (evt) {
  onEnterCloseUpload(evt);
});
