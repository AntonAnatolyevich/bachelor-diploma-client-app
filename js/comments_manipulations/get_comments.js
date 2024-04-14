document.addEventListener('DOMContentLoaded', function() {
    
    const urlParams = window.location.search;
    let id = urlParams.replace(/^\?/, '');  
    // URL файла JSON на сервере
    var jsonUrl = 'http://localhost:8080/api/v1/places/' + id + '/comments';

    // Получаем ссылку на элемент, в который будем добавлять карточки товаров
    var commets_container = document.getElementById('commets_container');

    // Загружаем файл JSON с сервера
    fetch(jsonUrl)
        .then(response => response.json())
        .then(commentsData => {
                let commetnSize =  Object.keys(commentsData).length;
                document.getElementById('commentSize').innerText = 'Комметарии: ' + commetnSize;
                //Получаем json элементы
                commentsData.forEach(async function(commentData) {

                const cardContainer = document.createElement('div');
                cardContainer.dataset.id = commentData.id;
                cardContainer.classList.add('comment', 'flex', 'items-start', 'gap-2.5');
                
                const profilePicture = document.createElement('img');
                profilePicture.classList.add('w-8', 'h-8', 'rounded-full');
                profilePicture.src = commentData.creator.profile_picture;
                profilePicture.alt = "Profile Picture";

                const messageContainer = document.createElement('div');
                messageContainer.classList.add('flex', 'flex-col', 'w-full', 'max-w-[px]', 'leading-1.5', 'p-4', 'border-gray-200', 'bg-gray-100', 'rounded-e-xl', 'rounded-es-xl', 'dark:bg-gray-700');

                const authorInfo = document.createElement('div');
                authorInfo.classList.add('flex', 'items-center', 'space-x-2', 'rtl:space-x-reverse');

                const authorName = document.createElement('span');
                authorName.classList.add('text-sm', 'font-semibold', 'text-gray-900', 'dark:text-white');
                authorName.textContent = commentData.creator.username + '#' + commentData.creator.id;

                const messageTime = document.createElement('span');
                messageTime.classList.add('text-sm', 'font-normal', 'text-gray-500', 'dark:text-gray-400');
                // Создание объекта Date из строки
                let date = new Date(commentData.created_at);
                // Получение дня, месяца, года, часов и минут из объекта Date
                let day = date.getDate();
                let monthIndex = date.getMonth();
                let year = date.getFullYear();
                let hours = date.getHours();
                let minutes = date.getMinutes();
                // Массив названий месяцев
                let monthNames = [
                "января", "февраля", "марта",
                "апреля", "мая", "июня", "июля",
                "августа", "сентября", "октября",
                "ноября", "декабря"
                ];
                messageTime.textContent = day + ' ' + monthNames[monthIndex] + ' ' + year + ', ' + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

                const messageText = document.createElement('p');
                messageText.classList.add('comment_text', 'text-sm', 'font-normal', 'py-2.5', 'text-gray-900', 'dark:text-white');
                messageText.textContent = commentData.message;

                const messageStatus = document.createElement('span');
                messageStatus.classList.add('text-sm', 'font-normal', 'text-gray-500', 'dark:text-gray-400');
                messageStatus.textContent = commentData.status;

                const editButton = document.createElement('button');
                editButton.classList.add('edit-comment-btn', 'p-1', 'text-gray-500', 'dark:text-gray-400', 'hover:text-gray-700', 'dark:hover:text-gray-300', 'focus:outline-none');
                editButton.innerHTML = '<svg class="get_comments_edit_btn" width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.9993 1.18177C11.7686 0.425059 12.8116 0 13.8991 0C14.9866 0 16.0296 0.42506 16.799 1.18177C17.5676 1.93912 18 2.96653 18 4.03713C18 5.10486 17.5705 6.12903 16.8057 6.8858L15.5002 8.21387L9.69976 2.50355L10.9872 1.1938L10.9993 1.18177ZM8.28258 3.94524L3.1861 9.12986L5.36073 11.2713L10.4239 6.05326L8.28258 3.94524ZM2.03244 10.8309L0.0522945 16.6799C-0.0697141 17.0403 0.025572 17.4376 0.29843 17.7062C0.571288 17.9748 0.974884 18.0686 1.34097 17.9485L7.28234 15.9992L2.03244 10.8309ZM8.98663 14.8401L14.0831 9.65555L11.8651 7.47205L6.80193 12.6901L8.98663 14.8401Z" fill="#fb923c"/></svg>';

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-comment-btn', 'p-1', 'text-gray-500', 'dark:text-gray-400', 'hover:text-gray-700', 'dark:hover:text-gray-300', 'focus:outline-none');
                deleteButton.innerHTML = '<svg class="get_comments_delete_btn" width="12" height="16" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="hover: fill-red-400" fill-rule="evenodd" clip-rule="evenodd" d="M4.58579 0.585786C4.96086 0.210714 5.46957 0 6 0H10C10.5304 0 11.0391 0.210714 11.4142 0.585786C11.7893 0.960859 12 1.46957 12 2V4H15C15.5523 4 16 4.44772 16 5C16 5.55228 15.5523 6 15 6V18C15 18.5304 14.7893 19.0391 14.4142 19.4142C14.0391 19.7893 13.5304 20 13 20H3C2.46957 20 1.96086 19.7893 1.58579 19.4142C1.21071 19.0391 1 18.5304 1 18V6C0.447715 6 0 5.55228 0 5C0 4.44772 0.447715 4 1 4H4V2C4 1.46957 4.21071 0.960859 4.58579 0.585786ZM6 4H10V2H6V4ZM7 8C7 7.44772 6.55228 7 6 7C5.44772 7 5 7.44772 5 8V16C5 16.5523 5.44772 17 6 17C6.55228 17 7 16.5523 7 16V8ZM11 8C11 7.44772 10.5523 7 10 7C9.44772 7 9 7.44772 9 8V16C9 16.5523 9.44772 17 10 17C10.5523 17 11 16.5523 11 16V8Z" fill="#ef4444"/></svg>';
                
                
                // Добавляем все созданные элементы в нужный порядок
                authorInfo.append(authorName, messageTime);
                messageContainer.append(authorInfo, messageText, messageStatus);
                cardContainer.append(profilePicture, messageContainer);
                // Добавление кнопок только для комментариев текущего пользователя
                if (commentData.creator.id === localStorage.id) {
                    authorInfo.appendChild(editButton);
                    authorInfo.appendChild(deleteButton);
                }
                commets_container.append(cardContainer);
            });
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
});

