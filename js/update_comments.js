document.getElementById('learn_comments').addEventListener('click', function() {
    // Находим все кнопки удаления комментариев
    const eidtButtons = document.querySelectorAll('.edit-comment-btn');
    // Проходимся по каждой кнопке и добавляем обработчик события на клик
    eidtButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Находим родительский элемент комментария
            const commentElement = this.closest('.comment');
            // Получаем идентификатор комментария из атрибута data-id
            const commentId = commentElement.dataset.id;
            sessionStorage.setItem('commentId', commentId);
            if (commentElement) {
                // Находим первый элемент <p> внутри родительского элемента .comment
                const paragraphElement = commentElement.querySelector('p').textContent;
                document.getElementById('chat').value = paragraphElement;
            }
        });
    });
    document.getElementById('update_comment_by_id').addEventListener('click', function() {
        event.preventDefault(); // Отменяем стандартное поведение отправки фо
        // Получаем токен из localStorage
        // // Получаем файлы из input[type="file"]
        // const fileInput = document.getElementById('fileElem');
        // const files = fileInput.files;
        // console.log(files)
        const urlParams = window.location.search;
        let id = urlParams.replace(/^\?/, '');  
        const token = localStorage.getItem('token');
        var jsonUrl = 'http://localhost:8080/api/v1/places/' + id + '/comments/';
        const commentId = sessionStorage.getItem('commentId');
        // // Добавляем файлы в объект FormData, если они выбраны
        // if (files.length > 0) {
        //     for (let i = 0; i < files.length; i++) {
        //         const file = files[i];
        //         formData.append('attachments', file);
        //     }
        // } else {
        //     // Если файлы не выбраны, добавляем пустую строку в attachments
        //     formData.append('attachments', '');
        // }
        const message = document.getElementById('chat').value;
        const data = {
            message: message
        };
    
        // Отправляем POST запрос на сервер
        fetch(jsonUrl + commentId, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' // Используем токен в заголовке
            },
            body: JSON.stringify(data) // Преобразуем объект formData в JSON
        })
        .then(response => {
            window.location.reload();
            console.log(response.json());
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            // Очистить форму после успешной отправки данных
            document.querySelector('form').reset();
        });
    
    });
});
