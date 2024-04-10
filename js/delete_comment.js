document.getElementById('learn_comments').addEventListener('click', function() {
    // Находим все кнопки удаления комментариев
    const deleteButtons = document.querySelectorAll('.delete-comment-btn');
    // Проходимся по каждой кнопке и добавляем обработчик события на клик
    const urlParams = window.location.search;
    let id = urlParams.replace(/^\?/, '');  
    // URL файла JSON на сервере
    var jsonUrl = 'http://localhost:8080/api/v1/places/' + id + '/comments/';
    const token = localStorage.getItem('token');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Находим родительский элемент комментария
            const commentElement = this.closest('.comment');
            // Получаем идентификатор комментария из атрибута data-id
            const commentId = commentElement.dataset.id;
            
            // Показываем окно подтверждения
            if (confirm('Вы уверены, что хотите удалить этот комментарий?')) {
                // Если пользователь нажал "ОК", отправляем запрос на удаление комментария
                fetch(jsonUrl + commentId, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}` // Используем токен в заголовке
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка удаления комментария');
                    }
                    // Успешно удален, обновляем список комментариев или какую-либо другую часть интерфейса
                    console.log('Комментарий успешно удален');
                    window.location.reload();
                    // Обновление страницы или части интерфейса
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
            }
        });
    });
});
