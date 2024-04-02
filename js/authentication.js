document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var userData = {
        username: username,
        password: password
    };

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    };

    var url = 'http://localhost:8080/api/v1/auth/login';

    fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                document.getElementById("failureMessage").style.display = "block";
                setTimeout(function() {
                    document.getElementById("failureMessage").style.display = "none";
                }, 3000);
                throw new Error('Network response was not ok');
            }
            document.getElementById("succesMessage").style.display = "none";
            document.getElementById("succesMessage").style.display = "block";
                setTimeout(function() {
                    document.getElementById("succesMessage").style.display = "none";
                }, 3000);
            return response.json();
        })
        .then(data => {
            console.log('Успешная авторизация');
            console.log('Токен:', data.token);
            console.log('ID пользователя:', data.user.id);
            console.log('Логин пользователя:', data.user.username);
            console.log('Имя пользователя:', data.user.name);
            console.log('Фамилия пользователя:', data.user.last_name);
            console.log('email', data.user.email);
            console.log('Изображение пользователя:', data.user.profile_picture);

            localStorage.setItem('token', data.token); // Сохранение токена в localStorage
            localStorage.setItem('id', data.user.id); // Сохранение ID пользователя в localStorage
            localStorage.setItem('username', data.user.username); // Сохранение имени пользователя в localStorage
            localStorage.setItem('name', data.user.name); // Сохранение имени пользователя в localStorage
            localStorage.setItem('last_name', data.user.last_name); // Сохранение фамилии пользователя в localStorage
            localStorage.setItem('email', data.user.email); // Сохранение email пользователя в localStorage
            localStorage.setItem('profile_picture', data.user.profile_picture); // Сохранение URL аватара пользователя в localStorage
            window.location.href = 'http://127.0.0.1:5500/html/index.html';

        })
        .catch(error => {
            console.error('Error during authentication:', error);
        });
});

// Проверка наличия токена при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (token) {
        // Если токен есть, скрываем кнопку входа
        var loginButton = document.getElementById('authenticationButton');
        loginButton.style.display = 'none';

    } else {
        // Если токена нет, показываем кнопку входа
        var logoutButton = document.getElementById('logoutButton');
        logoutButton.style.display = 'none';
    }

    // Проверка наличия данных пользователя и отображение иконки пользователя
    const username = localStorage.getItem('username');
    const profilePicture = localStorage.getItem('profile_picture');
    if (username && profilePicture) {
        const userIcon = document.getElementById('userIcon');
        userIcon.style.backgroundImage = `url(${profilePicture})`;
        userIcon.title = username;
        userIcon.style.display = 'block';
    }

    var addPlaceButton = document.getElementById('AddPlace');
    addPlaceButton.disabled = false;
});

// Обработчик события для кнопки выхода
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('email');
    localStorage.removeItem('profile_picture');
    window.location.href = 'http://127.0.0.1:5500/html/index.html'; // Перенаправление на страницу входа после выхода
});