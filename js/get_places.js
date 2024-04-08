document.addEventListener('DOMContentLoaded', function() {
    // URL файла JSON на сервере
    var jsonUrl = 'http://localhost:8080/api/v1/places';

    // Получаем ссылку на элемент, в который будем добавлять карточки товаров
    var mainCardPlace = document.getElementById('mainCardPlace');

    // Загружаем файл JSON с сервера
    fetch(jsonUrl)
        .then(response => response.json())
        .then(placesData => {
            // Создаем карточку товара для каждого товара из массива
            placesData.forEach(function(placeData) {
                // Создаем элемент <a> для карточки товара
                var aElement = document.createElement('a');
                aElement.setAttribute('href', 'place.html?'+ placeData.id);
                aElement.classList.add('flex', 'flex-col', 'items-center', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'md:flex-row', 'md:max-w-xl', 'hover:bg-gray-100', 'dark:border-gray-700', 'dark:bg-gray-800', 'dark:hover:bg-gray-700');

                // Создаем элемент <img> для изображения товара
                var imgElement = document.createElement('img');
                imgElement.setAttribute('src', placeData.attachments[0]);
                imgElement.setAttribute('alt', placeData.name);
                imgElement.classList.add('object-cover', 'w-full', 'rounded-t-lg', 'h-96', 'md:h-auto', 'md:w-48', 'md:rounded-none', 'md:rounded-s-lg');

                // Создаем контейнер для текста карточки товара
                var divElement = document.createElement('div');
                divElement.classList.add('flex', 'flex-col', 'justify-between', 'p-4', 'leading-normal');

                // Создаем заголовок карточки товара
                var h5Element = document.createElement('h5');
                h5Element.textContent = placeData.name;
                h5Element.classList.add('mb-2', 'text-2xl', 'font-bold', 'tracking-tight', 'text-gray-900', 'dark:text-white');

                // Создаем описание карточки товара
                var pElement = document.createElement('p');
                pElement.textContent = placeData.short_description;
                pElement.classList.add('mb-3', 'font-normal', 'text-gray-700', 'dark:text-gray-400');

                // Добавляем элементы в контейнер для текста карточки товара
                divElement.appendChild(h5Element);
                divElement.appendChild(pElement);

                // Добавляем элементы в элемент <a>
                aElement.appendChild(imgElement);
                aElement.appendChild(divElement);

                // Добавляем элемент <a> в контейнер с карточками товаров
                mainCardPlace.appendChild(aElement);
            });
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
});
