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
document.getElementById('fileElem').addEventListener('change', function() {
    // Очищаем предыдущий предпросмотр фотографий
    // document.getElementById('preview').innerHTML = '';
    
    // Получаем файлы из input[type="file"]
    const files = this.files;
    
    // Создаем элементы img для каждого выбранного файла и добавляем их в контейнер предпросмотра
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.width = 100; // Устанавливаем ширину предпросмотра
            img.height = 100; // Устанавливаем высоту предпросмотра
            document.getElementById('preview').appendChild(img);
        };
        
        reader.readAsDataURL(file);
    }
});

document.getElementById('clear-all').addEventListener('click', function() {
    document.getElementById('fileElem').value = '';
    document.getElementById('preview').innerHTML = '';
});

document.getElementById('add_place_form_button').addEventListener('click', function(event) {
    event.preventDefault(); // Отменяем стандартное поведение отправки фо
    // Получаем токен из localStorage
    const token = localStorage.getItem('token');

    // Проверяем, что токен присутствует
    if (!token) {
        console.error('Authorization token is missing');
        return;
    }
    // Получаем файлы из input[type="file"]
    const fileInput = document.getElementById('fileElem');
    const files = fileInput.files;
    console.log(files)

    // Создаем объект FormData для отправки на сервер
    const formData = new FormData();

    // Добавляем файлы в объект FormData, если они выбраны
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            formData.append('attachments', file);
        }
    } else {
        // Если файлы не выбраны, добавляем пустую строку в attachments
        formData.append('attachments', '');
    }

    formData.append('place', JSON.stringify({
        name: document.getElementById('name').value,
        short_description: document.getElementById('short_description').value,
        full_description: document.getElementById('full_description').value,
        how_to_get: document.getElementById('how_to_get').value,
        address: document.getElementById('address').value,
        rating: parseInt(document.getElementById('rating').value),
        latitude: parseFloat(document.getElementById('latitude').value),
        longitude: parseFloat(document.getElementById('longitude').value),
        tags: [document.getElementById('tags').value]
    }));

    // Отправляем POST запрос на сервер
    fetch('http://localhost:8080/api/v1/places', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}` // Используем токен в заголовке
        },
        body: formData // Преобразуем объект formData в JSON
    })
    .then(response => {
        
        console.log(response.json());
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Очистить форму после успешной отправки данных
        document.querySelector('form').reset();
    });
    
});