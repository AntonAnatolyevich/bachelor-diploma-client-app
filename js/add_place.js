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
// Обработчик для кнопки "Clear All"
document.getElementById('abort_form_button').addEventListener('click', function() {
    // Очищаем значения всех полей формы
    document.getElementById('latitude').value = '';
    document.getElementById('longitude').value = '';
    document.getElementById('name').value = '';
    document.getElementById('short_description').value = '';
    document.getElementById('address').value = '';
    document.getElementById('rating').value = '';
    document.getElementById('tags').value = '';
    document.getElementById('full_description').value = '';
    document.getElementById('how_to_get').value = '';
    document.getElementById('preview').innerHTML = ''; // Очищаем превью фотографий
});

document.getElementById('add_place_form_button').addEventListener('click', function() {
    // Собираем данные из формы
    const formData = new FormData();
    formData.append('place', JSON.stringify({
        name: document.getElementById('name').value,
        short_description: document.getElementById('short_description').value,
        full_description: document.getElementById('full_description').value,
        how_to_get: document.getElementById('how_to_get').value,
        address: document.getElementById('address').value,
        rating: parseInt(document.getElementById('rating').value),
        latitude: parseFloat(document.getElementById('latitude').value),
        longitude: parseFloat(document.getElementById('longitude').value),
        tags: document.getElementById('tags').value.split(',').map(tag => tag.trim())
    }));

    // Отправляем POST запрос на сервер
    fetch('http://localhost:8080/api/v1/places', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ${token}',
            'Content-Type': 'multipart/form-data'
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Очистить форму после успешной отправки данных
        document.getElementById('clear-all').click();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
