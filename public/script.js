document.addEventListener('DOMContentLoaded', function() {

    if (document.getElementById('login-form')) {

        initAuthPage();
    } else if (document.getElementById('username')) {

        initProfilePage();
    }
});

function initAuthPage() {
    document.getElementById('show-register').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    });
    
    document.getElementById('show-login').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });
 
    document.getElementById('login').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = this.querySelector('input[type="text"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/profile';
            } else {
                alert('Login failed');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    document.getElementById('register').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = this.querySelector('input[type="text"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            if (response.ok) {
                alert('Registration successful. Please login.');
                document.getElementById('register-form').style.display = 'none';
                document.getElementById('login-form').style.display = 'block';
            } else {
                response.json().then(data => alert(data.error || 'Registration failed'));
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

function initProfilePage() {
    fetch('/profile')
        .then(response => {
            if (!response.ok) {
                window.location.href = '/';
            }
        });
    
    document.getElementById('username').textContent = 'User';

    document.getElementById('logout').addEventListener('click', function() {
        fetch('/logout', { method: 'POST' })
            .then(() => window.location.href = '/');
    });

    const themeSelector = document.getElementById('theme-selector');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.body.className = savedTheme;
    themeSelector.value = savedTheme;
    
    themeSelector.addEventListener('change', function() {
        const theme = this.value;
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    });

    function loadData() {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                document.getElementById('data-display').innerHTML = `
                    <p><strong>Timestamp:</strong> ${data.timestamp}</p>
                    <p><strong>Data:</strong> ${data.data.join(', ')}</p>
                `;
                document.getElementById('cache-status').textContent = 
                    data.cached ? '(Data from cache)' : '(Fresh data)';
            });
    }
    
    document.getElementById('refresh-data').addEventListener('click', loadData);
    loadData(); 
}