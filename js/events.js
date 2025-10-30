document.addEventListener('DOMContentLoaded', () => {
    // Login button
    document.getElementById('loginBtn').addEventListener('click', () => {
        Modal.open('loginModal');
    });

    // Register button
    document.getElementById('registerBtn').addEventListener('click', () => {
        Modal.open('registerModal');
    });

    // Login form handling
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (Auth.login(username, password)) {
            Modal.close('loginModal');
        } else {
            document.getElementById('loginError').textContent = 'Невірний логін або пароль';
        }
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const password2 = document.getElementById('register-password2').value;

        if (password !== password2) {
            document.getElementById('registerError').textContent = 'Паролі не співпадають';
            return;
        }

        const result = Auth.register(username, email, password);
        if (result.success) {
            Modal.close('registerModal');
            alert('Реєстрація успішна!');
        } else {
            document.getElementById('registerError').textContent = result.error;
        }
    });

    // Close buttons for modals
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.closest('.modal-bg').id;
            Modal.close(modalId);
        });
    });

    // Update library when switching to library tab
    document.querySelector('a[href="#lib"]').addEventListener('click', () => {
        Library.updateLibraryUI();
    });

    // Update library when logging in/out
    window.addEventListener('userStateChanged', () => {
        Library.updateLibraryUI();
    });

    // Profile navigation
    document.getElementById('profileNavBtn').addEventListener('click', () => {
        Profile.updateProfile();
    });
});
