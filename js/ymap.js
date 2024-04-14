ymaps.ready(init);

function init() {
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
    var jsonUrl = 'http://localhost:8080/api/v1/places';

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
                    balloonContent: place.short_description // Содержимое балуна метки
                }
            );
            // Добавляем обработчик клика на метку
            placemark.events.add('click', function () {
                // Переходим на другую страницу при клике на метку
                window.location.href = 'place.html?' + place.id;
            });

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