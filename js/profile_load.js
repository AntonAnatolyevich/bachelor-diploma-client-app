document.addEventListener('DOMContentLoaded', function() {
    const name = localStorage.getItem('name');
    const username = localStorage.getItem('username');
    const last_name = localStorage.getItem('last_name');
    const email = localStorage.getItem('email');
    const profile_picture = localStorage.getItem('profile_picture');
    const id = localStorage.getItem('id');
        
        document.getElementById('avatar_username').innerText = name + ' ' + last_name;
        document.getElementById('email').innerText = email;
        document.getElementById('header_avatar').setAttribute('src', profile_picture);

        document.getElementById('profile_login').innerText = id;
        document.getElementById('profile_login').innerText = username + '#' + id;
        document.getElementById('profile_name').innerText = name + ' ' + last_name;
        document.getElementById('profile_email').innerText = email;
        document.getElementById('profile_avatar').setAttribute('src', profile_picture)
});