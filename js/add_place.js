ymaps.ready(init);

    function init() {
        var myMap = new ymaps.Map('add_map', {
            center: [55.753215, 37.622504], // Начальные координаты (Москва)
            zoom: 10 // Начальный масштаб карты
        });

        // Добавляем обработчик клика по карте
        myMap.events.add('click', function (e) {
            var coords = e.get('coords'); // Получаем координаты точки клика
            document.getElementById('latitude').value = coords[0]; // Устанавливаем широту в поле формы
            document.getElementById('longitude').value = coords[1]; // Устанавливаем долготу в поле формы
            
            // Удаляем предыдущую метку, если она есть
            myMap.geoObjects.removeAll();
            
            // Создаем метку на карте
            var placemark = new ymaps.Placemark(coords, {}, {
                draggable: true // Разрешаем перемещение метки
            });
            
            // Добавляем метку на карту
            myMap.geoObjects.add(placemark);
            
            // Обработчик события окончания перемещения метки
            placemark.events.add('dragend', function () {
                var newCoords = placemark.geometry.getCoordinates(); // Получаем новые координаты метки
                document.getElementById('latitude').value = newCoords[0]; // Устанавливаем новую широту в поле формы
                document.getElementById('longitude').value = newCoords[1]; // Устанавливаем новую долготу в поле формы
            });
        });
    }
