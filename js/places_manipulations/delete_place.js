document.getElementById('delete_place_btn').addEventListener('click', function() {
    const urlParams = window.location.search;
    let id = urlParams.replace(/^\?/, '');  
    // URL файла JSON на сервере
    var jsonUrl = 'http://localhost:8080/api/v1/places/' + id;
    const token = localStorage.getItem('token');
    const placeName = sessionStorage.getItem('placeName');
    let delete_check_text = document.getElementById('delete_check_text').value;      
            // Показываем окно подтверждения
            if (delete_check_text === placeName) {
                // Если пользователь нажал "ОК", отправляем запрос на удаление комментария
                fetch(jsonUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}` // Используем токен в заголовке
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка удаления комментария');
                    } else
                    // Успешно удален, обновляем список комментариев или какую-либо другую часть интерфейса
                    window.location.href = 'http://127.0.0.1:5500/html/index.html';
                    // Обновление страницы или части интерфейса
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
    }
});
