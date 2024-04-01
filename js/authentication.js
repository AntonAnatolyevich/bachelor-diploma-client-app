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
            document.getElementById("failureMessage").style.display = "none";
            return response.json();
        })
        .then(data => {
            console.log('Authentication successful:', data);
            // Здесь можно выполнять дополнительные действия после успешной авторизации
        })
        .catch(error => {
            console.error('Error during authentication:', error);
        });
});