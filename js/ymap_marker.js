document.addEventListener('DOMContentLoaded', function() {
    // URL файла JSON на сервере
    var jsonUrl = 'http://localhost:8080/api/v1/places';

    // Загружаем файл JSON с сервера
    fetch(jsonUrl)
        .then(response => response.json())
        .then(placesData => {
            // Получаем ссылку на карту
            var map = document.getElementById('map');
            // Создаем метки для каждого места
            placesData.forEach(function(placeData) {
                const markerElement = document.createElement('div');
                markerElement.className = 'marker-class';
                markerElement.innerText = "I'm marker!";
                
                const marker = new YMapMarker(
                {
                    source: 'markerSource',
                    coordinates: [placeData.longitude, placeData.latitude],
                    draggable: true,
                    mapFollowsOnDrag: true
                },
                markerElement
                );

                map.addChild(marker);
            });
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
});