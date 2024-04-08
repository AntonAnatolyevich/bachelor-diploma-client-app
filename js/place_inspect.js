document.addEventListener('DOMContentLoaded', function() {
    
    const urlParams = window.location.search;
    let id = urlParams.replace(/^\?/, '');  
    // URL файла JSON на сервере
    var jsonUrl = 'http://localhost:8080/api/v1/places/' + id;

    // Получаем ссылку на элемент, в который будем добавлять карточки товаров

    // Загружаем файл JSON с сервера
    fetch(jsonUrl)
        .then(response => response.json())
        .then(placeData => {
            
            // Получаем ссылку на Carousel wrapper
            var carouselWrapper = document.getElementById('place_inspect_carousel');

            // Получаем ссылку на Slider indicators
            var sliderIndicators = document.getElementById('place_inspect_indicators');

            // Проходимся по массиву фотографий
            placeData.attachments.forEach(async function(photo, index) {
                // Создаем элемент для фотографии в Carousel wrapper
                var carouselItem = document.createElement('div');
                carouselItem.classList.add('hidden', 'duration-700', 'ease-in-out');
                carouselItem.dataset.carouselItem = '';

                var img = document.createElement('img');
                img.src = photo;
                img.classList.add('absolute', 'block', 'w-full', '-translate-x-1/2', '-translate-y-1/2', 'top-1/2', 'left-1/2');
                img.alt = 'Slide ' + (index + 1);

                carouselItem.appendChild(img);
                carouselWrapper.appendChild(carouselItem);

                // Создаем элемент для индикатора в Slider indicators
                var indicatorButton = document.createElement('button');
                indicatorButton.type = 'button';
                indicatorButton.classList.add('w-3', 'h-3', 'rounded-full');
                indicatorButton.setAttribute('aria-label', 'Slide ' + (index + 1));
                indicatorButton.dataset.carouselSlideTo = index;

                if (index === 0) {
                    indicatorButton.setAttribute('aria-current', 'true');
                } else {
                    indicatorButton.setAttribute('aria-current', 'false');
                }
                sliderIndicators.appendChild(indicatorButton);
            });
            
            document.getElementById('place_inspect_name').innerText = placeData.name ;
            document.getElementById('place_inspect_avatar').setAttribute('src', placeData.creator.profile_picture);
            document.getElementById('place_creator_username').innerText = placeData.creator.username + ' ' + placeData.creator.name + ' ' + placeData.creator.last_name;
            
            // Создаем карту
            ymaps.ready(initMap);

            function initMap() {
                // Получаем координаты места из placeData
                var latitude = placeData.latitude;
                var longitude = placeData.longitude;

                // Создаем новую карту в указанном контейнере
                var map = new ymaps.Map('map', {
                    center: [latitude, longitude], // Устанавливаем центр карты
                    zoom: 15 // Устанавливаем масштаб карты
                });

                // Создаем метку на карте
                var placemark = new ymaps.Placemark([latitude, longitude], {
                    hintContent: placeData.name, // Всплывающая подсказка
                    balloonContent: placeData.name // Содержимое балуна
                });

                // Добавляем метку на карту
                map.geoObjects.add(placemark);
            }
            
            // Создание объекта Date из строки
            let date = new Date(placeData.created_at);
            // Получение дня, месяца, года, часов и минут из объекта Date
            let day = date.getDate();
            let monthIndex = date.getMonth();
            let year = date.getFullYear();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            // Массив названий месяцев
            let monthNames = [
            "января", "февраля", "марта",
            "апреля", "мая", "июня", "июля",
            "августа", "сентября", "октября",
            "ноября", "декабря"
            ];
            document.getElementById('place_inspect_created_at').innerText = 'Опубликовано: ' + day + ' ' + monthNames[monthIndex] + ' ' + year + ', ' + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
            document.getElementById('place_inspect_full_description').innerText = placeData.full_description;
            document.getElementById('place_inspect_how_to_get').innerText = placeData.how_to_get;
            
            
        });
});

