document.getElementById('search_button').addEventListener('click', function() {
    let searchInput = document.getElementById('simple-search');
    let searchValue = searchInput.value;
    // URL файла JSON на сервере
    var jsonUrl = `http://localhost:8080/api/v1/places?name=${searchValue}`;
    
    // Получаем ссылку на элемент, в который будем добавлять карточки товаров
    let mainCardPlace = document.getElementById('mainCardPlace');
    mainCardPlace.innerHTML = '';
    var creator_id = localStorage.getItem('id');
    
    // Загружаем файл JSON с сервера
    fetch(jsonUrl)
        .then(response => response.json())
        .then(placesData => {
            // Создаем карточку товара для каждого товара из массива
            placesData.forEach(function(placeData) {
                
                if (placeData.creator.id === creator_id) {
                    // Создаем элемент <a> для карточки товара
                var aElement = document.createElement('a');
                aElement.setAttribute('href', 'place.html?'+ placeData.id);
                aElement.classList.add('relative', 'flex', 'flex-col', 'items-center', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'md:flex-row', 'md:max-w-xl', 'hover:bg-gray-100', 'dark:border-gray-700', 'dark:bg-gray-800', 'dark:hover:bg-gray-700');

                // Создаем элемент <img> для изображения товара
                var imgElement = document.createElement('img');
                imgElement.setAttribute('style', 'height: 192px; width: 192px;');
                imgElement.setAttribute('src', placeData.attachments[0]);
                imgElement.setAttribute('alt', placeData.name);
                imgElement.classList.add('object-scale-down', 'w-64', 'rounded-t-lg', 'h-96', 'md:h-auto', 'md:w-48', 'md:rounded-none', 'md:rounded-s-lg');

                // Создаем контейнер для текста карточки товара
                var divElement = document.createElement('div');
                divElement.classList.add('flex', 'flex-col', 'justify-between', 'p-4', 'leading-normal');

                // Создаем заголовок карточки товара
                var h5Element = document.createElement('h5');
                h5Element.textContent = placeData.name;
                h5Element.classList.add('mb-2', 'text-xl', 'font-bold', 'tracking-tight', 'text-gray-900', 'dark:text-white');

                // Создаем описание карточки товара
                var pElement = document.createElement('p');
                pElement.textContent = placeData.short_description;
                pElement.classList.add('mb-3', 'font-normal', 'text-gray-700', 'dark:text-gray-400');

                var userElement = document.createElement('div');
                userElement.classList.add('flex', 'flex-row', 'gap-2', 'items-center')

                var avatarElement = document.createElement('img');
                avatarElement.classList.add('w-8', 'h-8', 'rounded-full',);
                avatarElement.src = placeData.creator.profile_picture;
                avatarElement.alt = "Изображение пользователя";

                var usernameElement = document.createElement('p');
                usernameElement.textContent = placeData.creator.username +'#'+ placeData.creator.id ;
                
                var ratingElement = document.createElement('div');
                ratingElement.classList.add('absolute', 'rounded-lg', 'text-white',  'flex', 'flex-col', 'items-center', 'w-8', 'h-6', 'top-0', 'right-0');
                ratingElement.innerText = placeData.rating;
                if (placeData.rating >= 4) {
                    ratingElement.classList.add('bg-green-400');
                } else {
                    ratingElement.classList.add('bg-gray-400');
                }

                    
                

                userElement.appendChild(avatarElement);
                userElement.appendChild(usernameElement);
                // Добавляем элементы в контейнер для текста карточки товара
                divElement.appendChild(h5Element);
                divElement.appendChild(pElement);
                divElement.appendChild(userElement);
                // Добавляем элементы в элемент <a>
                aElement.appendChild(imgElement);
                aElement.appendChild(divElement);
                aElement.appendChild(ratingElement);
                // Добавляем элемент <a> в контейнер с карточками товаров
                mainCardPlace.appendChild(aElement);
                }
            });
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));

        ymaps.ready(init);

        function init() {
            document.getElementById('map').innerHTML='';
            // Загружаем данные из Local Storage (если они есть)
            var savedMapCenter = localStorage.getItem('mapCenter');
            var savedMapZoom = localStorage.getItem('mapZoom');

            // Создаем карту
            var myMap = new ymaps.Map('map', {
                center: savedMapCenter ? JSON.parse(savedMapCenter) : [55.76, 37.64], // Значение по умолчанию, если данные отсутствуют
                zoom: savedMapZoom ? JSON.parse(savedMapZoom) : 7
                
            }, {
                suppressMapOpenBlock: true
        });

            // Обработчик изменения центра карты
            myMap.events.add('boundschange', function (event) {
                // Сохраняем новые значения центра и масштаба карты в Local Storage
                localStorage.setItem('mapCenter', JSON.stringify(event.get('newCenter')));
                localStorage.setItem('mapZoom', JSON.stringify(event.get('newZoom')));
            });
            // URL файла JSON на сервере
            var jsonUrl = `http://localhost:8080/api/v1/places?name=${searchValue}`;

            // Загружаем данные из JSON-файла
            fetch(jsonUrl)
            .then(response => response.json())
            .then(data => {
                // Создаем массив для хранения меток
                var placemarks = [];

                // Добавляем метки на карту для каждой записи в JSON
                data.forEach(place => {
                    // Получаем координаты из данных JSON
                    var coordinates = [place.latitude, place.longitude];

                    // Создаем метку на карте
                    var placemark = new ymaps.Placemark(
                        coordinates,
                        {
                            hintContent: place.name, // Всплывающая подсказка при наведении на метку
                            balloonContent: place.description // Содержимое балуна метки
                        }
                    );

                    // Добавляем метку в массив
                    placemarks.push(placemark);
                });

                // Создаем кластеризатор меток
                var clusterer = new ymaps.Clusterer({
                    preset: 'islands#invertedVioletClusterIcons', // Стиль кластеров
                    groupByCoordinates: false,
                    clusterDisableClickZoom: true,
                    clusterHideIconOnBalloonOpen: false,
                    geoObjectHideIconOnBalloonOpen: false
                });

                // Добавляем метки в кластеризатор
                clusterer.add(placemarks);

                // Добавляем кластеризатор на карту
                myMap.geoObjects.add(clusterer);
            })
            .catch(error => console.error('Ошибка загрузки данных:', error));
        }

});
