let stars = 
    document.getElementsByClassName("star");
let output = 
    document.getElementById("output");
    let n = 0;
// Funtion to update rating
function gfg(value) {
    n = value;
    remove();
    for (let i = 0; i < n; i++) {
        if (n == 1) cls = "one";
        else if (n == 2) cls = "two";
        else if (n == 3) cls = "three";
        else if (n == 4) cls = "four";
        else if (n == 5) cls = "five";
        stars[i].className = "star " + cls;
    }
    output.innerText = "Rating is: " + n + "/5";
}

// To remove the pre-applied styling
function remove() {
    let i = 0;
    while (i < 5) {
        stars[i].className = "star";
        i++;
    }
}

document.getElementById('submit_rating').addEventListener('click', function() {
        // Отправляем POST запрос на сервер
        const urlParams = window.location.search;
        let id = urlParams.replace(/^\?/, '');
        let token = localStorage.getItem('token');

        // let rating = {rating: n};

        const rating = {
            "name": "string",
            "short_description": "string",
            "full_description": "string",
            "how_to_get": "string",
            "address": "string",
            "rating": n,
            "latitude": 0,
            "longitude": 0,
            "tags": [
              "string"
            ]
          };

        console.log(rating);

        fetch(`http://localhost:8080/api/v1/places/${id}/rates`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' // Используем токен в заголовке
            },
            body: JSON.stringify(rating) // Преобразуем объект formData в JSON
        })
        .then(response => {
            
            console.log(response.json());
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            // Очистить форму после успешной отправки данных
            document.querySelector('form').reset();
        });
})