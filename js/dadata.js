document.addEventListener('DOMContentLoaded', function() {
    var addressInput = document.getElementById('address');

    // Обработчик события ввода адреса
    addressInput.addEventListener('input', function() {
        var address = this.value;

        // Отправка запроса к API DADATA для получения улиц
        fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token 82cc9b6f12794753cea121634fe694c48d8d7b1c' // Замените YOUR_API_KEY на ваш API-ключ
            },
            body: JSON.stringify({ query: address })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Обработка полученных улиц
            var streets = data.suggestions.map(suggestion => suggestion.value);

            // Отображение улиц в даталисте
            updateStreetList(streets);
        })
        .catch(error => console.error('Ошибка при получении улиц:', error));
    });

    // Функция для обновления даталиста улиц в форме
    function updateStreetList(streets) {
        var datalist = document.getElementById('streetsList');
        // Очищаем текущий даталист и добавляем новые улицы
        datalist.innerHTML = '';
        streets.forEach(street => {
            var option = document.createElement('option');
            option.value = street;
            datalist.appendChild(option);
        });
    }

    // Обработчик отправки формы
    document.getElementById('placeForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем отправку формы

        // Получаем данные из формы
        var formData = new FormData(this);
        var data = {};
        formData.forEach(function (value, key) {
            data[key] = value;
        });

        // Отправляем данные на сервер (здесь можно реализовать отправку данных)
        console.log('Данные для отправки:', data);

        // Очищаем форму после отправки
        this.reset();
    });
});
