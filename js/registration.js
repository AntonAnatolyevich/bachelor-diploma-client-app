// Функция для скрытия сообщений об успешной или неудачной регистрации
function hideMessages() {
    document.getElementById("successMessage").style.display = "none";
    document.getElementById("failureMessage").style.display = "none";
}

document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the username and password values
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Prepare data to be sent as JSON
    var data = {
        username: username,
        password: password
    };

    // Send POST request using Fetch API
    fetch('http://localhost:8080/api/v1/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Показать сообщение об успешной регистрации и скрыть его через 3 секунды
        document.getElementById("successMessage").style.display = "block";
        setTimeout(hideMessages, 3000);
    })
    .catch(error => {
        console.error('Error during registration:', error);
        // Показать сообщение о неудачной регистрации и скрыть его через 3 секунды
        document.getElementById("failureMessage").style.display = "block";
        setTimeout(hideMessages, 3000);
    });

    // Очистить поля формы регистрации после отправки данных
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
});