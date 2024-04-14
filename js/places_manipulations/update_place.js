ymaps.ready(init);

    async function init() {
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

    document.getElementById('fileElem').addEventListener('change', function() {
        // Очищаем предыдущий предпросмотр фотографий
        document.getElementById('preview').innerHTML = '';
        
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
    document.getElementById('preview').innerHTML = '';
});

document.getElementById('add_update_place_form_button').addEventListener('click', function(event) {
    event.preventDefault(); // Отменяем стандартное поведение отправки формы
    // Получаем токен из localStorage
    const token = localStorage.getItem('token');

    // Проверяем, что токен присутствует
    if (!token) {
        console.error('Authorization token is missing');
        return;
    }

    // Получаем ID места из параметров URL
    const urlParams = window.location.search;
    const id = urlParams.replace(/^\?/, '');  

    // URL ресурса на сервере для получения текущих данных места
    const apiUrl = `http://localhost:8080/api/v1/places/${id}`;

    // Выполняем GET запрос для получения текущих данных места
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Используем токен в заголовке
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json()) // Преобразуем ответ в формат JSON
    .then(data => {
        // Создаем объект для хранения данных обновления
        const updateData = {};

        // Функция для добавления данных обновления, если они указаны пользователем
        const addIfValueExists = (inputId, fieldName) => {
            const inputValue = document.getElementById(inputId).value;
            if (inputValue.trim() !== '') { // Проверяем, что значение не пустое
                updateData[fieldName] = inputValue;
            } else {
                // Если значение не указано пользователем, берем его из текущих данных
                updateData[fieldName] = data[fieldName];
            }
        };

        // Добавляем данные обновления для каждого поля формы
        addIfValueExists('name', 'name');
        addIfValueExists('short_description', 'short_description');
        addIfValueExists('full_description', 'full_description');
        addIfValueExists('how_to_get', 'how_to_get');
        addIfValueExists('address', 'address');
        addIfValueExists('rating', 'rating');
        addIfValueExists('latitude', 'latitude');
        addIfValueExists('longitude', 'longitude');
        addIfValueExists('tags', 'tags');

        // Получаем файлы из input[type="file"]
        const fileInput = document.getElementById('fileElem');
        const files = fileInput.files;
        console.log(files);
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

        // URL ресурса на сервере для обновления
        const updateUrl = `http://localhost:8080/api/v1/places/${id}`;

        // Отправляем PATCH запрос на сервер с выбранными данными обновления
        fetch(updateUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`, // Используем токен в заголовке
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData) // Преобразуем объект данных в формат JSON
        })
        .then(response => response.json()) // Преобразуем ответ в формат JSON
        .then(responseData => {
            console.log('Success:', responseData);
            // После успешной отправки данных обновления, отправляем POST запрос для добавления вложений
            fetch(`http://localhost:8080/api/v1/places/${id}/attachments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Используем токен в заголовке
                },
                body: formData // Преобразуем объект formData в JSON
            })
            .then(response => response.json()) // Преобразуем ответ в формат JSON
            .then(data => {
                console.log('Success:', data);
                // Очистить форму после успешной отправки данных
                document.querySelector('form').reset();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    })
    .catch(error => {
    console.error('Error:', error);
    });
});






