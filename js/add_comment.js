// Обработчик для кнопки "Clear All"
// document.getElementById('add_comment_by_id').addEventListener('click', function() {
//     // Очищаем значения всех полей формы
//     document.getElementById('chat').value = '';
//     // Очищаем превью фотографий
// });
// document.getElementById('fileElem').addEventListener('change', function() {
//     // Очищаем предыдущий предпросмотр фотографий
//     // document.getElementById('preview').innerHTML = '';
    
//     // Получаем файлы из input[type="file"]
//     const files = this.files;
    
//     // Создаем элементы img для каждого выбранного файла и добавляем их в контейнер предпросмотра
//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];
        
//         const reader = new FileReader();
        
//         reader.onload = function(e) {
//             const img = document.createElement('img');
//             img.src = e.target.result;
//             img.width = 100; // Устанавливаем ширину предпросмотра
//             img.height = 100; // Устанавливаем высоту предпросмотра
//             document.getElementById('preview').appendChild(img);
//         };
        
//         reader.readAsDataURL(file);
//     }
// });

//     document.getElementById('clear-all').addEventListener('click', function() {
//     document.getElementById('fileElem').value = '';
//     document.getElementById('preview').innerHTML = '';
// });

document.getElementById('add_comment_by_id').addEventListener('click', function(event) {
    // event.preventDefault(); // Отменяем стандартное поведение отправки фо
    // Получаем токен из localStorage
    const token = localStorage.getItem('token');
    //Получаем адрес комментария
    const urlParams = window.location.search;
    let id = urlParams.replace(/^\?/, '');  
    var jsonUrl = 'http://localhost:8080/api/v1/places/' + id + '/comments';

    // Проверяем, что токен присутствует
    if (!token) {
        console.error('Authorization token is missing');
        return;
    }
    // // Получаем файлы из input[type="file"]
    // const fileInput = document.getElementById('fileElem');
    // const files = fileInput.files;
    // console.log(files)

    // Создаем объект FormData для отправки на сервер
    const formData = new FormData();

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
    formData.append('attachments', []);
    formData.append('comment', JSON.stringify({
        message: document.getElementById('chat').value,
    }));

    // Отправляем POST запрос на сервер
    fetch(jsonUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}` // Используем токен в заголовке
        },
        body: formData // Преобразуем объект formData в JSON
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
