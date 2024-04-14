document.getElementById('update-user_profile').addEventListener('click', function(event) {
    event.preventDefault(); // Отменяем стандартное поведение отправки формы
    // Получаем токен и id пользователя из localStorage
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    // Проверяем, что токен присутствует
    if (!token) {
        console.error('Authorization token is missing');
        return;
    }
    const formData = new FormData();
    // Получаем файлы из input[type="file"]
    const fileInput = document.getElementById('update-file_input');
    const file = fileInput.files[0]; // Берём только первый файл, если их несколько
    if (file) {
        formData.append('attachments', file);
    }

    const user = {}; // Создаём объект для обновления данных пользователя

    const usernameInput = document.getElementById('update-username');
    if (usernameInput.value.trim() !== '') {
        user.username = usernameInput.value.trim();
    }

    const nameInput = document.getElementById('update-name');
    if (nameInput.value.trim() !== '') {
        user.name = nameInput.value.trim();
    }

    const lastNameInput = document.getElementById('update-last_name');
    if (lastNameInput.value.trim() !== '') {
        user.last_name = lastNameInput.value.trim();
    }

    const emailInput = document.getElementById('update-useremail');
    if (emailInput.value.trim() !== '') {
        user.email = emailInput.value.trim();
    }

    formData.append('user', JSON.stringify(user)); // Добавляем только изменённые данные пользователя

    // Отправляем PUT запрос на сервер
    fetch('http://localhost:8080/api/v1/users/' + id, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}` // Используем токен в заголовке
        },
        body: formData // Просто передаём объект formData в теле запроса
    })
    .then(response => response.json()) // Преобразуем ответ в формат JSON
    .then(data => {
        console.log('Success:', data);
        window.location.reload();
        // Очистить форму после успешной отправки данных
        document.querySelector('form').reset();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Предзагрузка выбранного изображения для предварительного просмотра
// Предзагрузка выбранного изображения для предварительного просмотра
const fileInput = document.getElementById('update-file_input');

fileInput.addEventListener('input', function(event) {
    const file = event.target.files[0]; // Получаем первый выбранный файл
    if (file) {
        const reader = new FileReader(); // Создаем объект FileReader

        reader.onload = function(e) {
            // Устанавливаем загруженное изображение в качестве src для элемента img
            document.getElementById('upadate-avatarButton').src = e.target.result;
        }

        // Читаем выбранный файл как Data URL
        reader.readAsDataURL(file);
    } else {
        // Если файл не выбран, очищаем атрибут src
        document.getElementById('upadate-avatarButton').src = '';
    }
});