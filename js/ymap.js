        ymaps.ready(init);

function init() {
    // Создаем карту
    var myMap = new ymaps.Map('map', {
        center: [55.76, 37.64], // Центр карты
        zoom: 10 // Масштаб карты
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