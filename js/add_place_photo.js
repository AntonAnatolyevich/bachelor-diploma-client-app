document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileElem');
    const clearAllButton = document.getElementById('clear-all');
    const preview = document.getElementById('preview');
    let fileCount = 0;

    dropArea.addEventListener('dragover', function (evt) {
        evt.preventDefault();
        this.classList.add('bg-gray-200');
    });

    dropArea.addEventListener('dragleave', function () {
        this.classList.remove('bg-gray-200');
    });

    dropArea.addEventListener('drop', function (evt) {
        evt.preventDefault();
        this.classList.remove('bg-gray-200');

        const files = evt.dataTransfer.files;

        if (fileCount + files.length <= 5) {
            const isImage = Array.from(files).every(file => file.type.startsWith('image/'));
            if (isImage) {
                handleFiles(files);
                fileCount += files.length;
            } else {
                showWarning();
            }
        } else {
            showWarning();
        }
    });

    dropArea.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        const files = this.files;

        if (fileCount + files.length <= 5) {
            const isImage = Array.from(files).every(file => file.type.startsWith('image/'));
            if (isImage) {
                handleFiles(files);
                fileCount += files.length;
            } else {
                showWarning();
            }
        } else {
            showWarning();
        }
    });

    clearAllButton.addEventListener('click', function () {
        preview.innerHTML = '';
        fileCount = 0;
    });

    preview.addEventListener('click', function (evt) {
        if (evt.target.classList.contains('delete-button')) {
            evt.target.closest('.image-container').remove();
            fileCount--;
        }
    });

    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('image-container', 'w-20', 'h-20', 'relative', 'overflow-hidden');
                const img = document.createElement('img');
                img.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'object-cover');
                reader.readAsDataURL(file);
                reader.onload = function () {
                    img.src = reader.result;
                };
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '❌';
                deleteButton.classList.add('delete-button', 'absolute', 'top-1', 'right-1');
                imgContainer.appendChild(img);
                imgContainer.appendChild(deleteButton);
                preview.appendChild(imgContainer);
            }
        }
    }

    function showWarning() {
        dropArea.classList.add('error');
        dropArea.textContent = 'Можно загрузить только изображения (макс. 5 файлов)';
        setTimeout(function() {
            dropArea.classList.remove('error');
            dropArea.textContent = 'Перетащите изображение или нажмите для выбора';
        }, 2000);
    }
});
