// Simple auth system using localStorage
const users = JSON.parse(localStorage.getItem('users')) || [
    // Default admin user
    {
        id: 1,
        name: "Admin",
        email: "admin@pakstore.com",
        password: "admin123",
        isAdmin: true
    }
];

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function registerUser(name, email, password) {
    // Simple validation
    if (!name || !email || !password) {
        return { success: false, message: "All fields are required" };
    }
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        return { success: false, message: "Email already registered" };
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // In real app, hash this password
        isAdmin: false
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after registration
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return { success: true, user: newUser };
}

function loginUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return { success: false, message: "Invalid email or password" };
    }
    
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return { success: true, user };
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
}

function updateAuthUI() {
    const authLink = document.getElementById('auth-link');
    const userGreeting = document.getElementById('user-greeting');
    const adminLink = document.getElementById('admin-link');
    
    if (currentUser) {
        if (authLink) authLink.textContent = "Logout";
        if (authLink) authLink.href = "javascript:logoutUser();location.reload()";
        if (userGreeting) userGreeting.textContent = `Hello, ${currentUser.name}`;
        if (adminLink && currentUser.isAdmin) {
            adminLink.style.display = "block";
        }
    } else {
        if (authLink) authLink.textContent = "Login";
        if (authLink) authLink.href = "login.html";
        if (userGreeting) userGreeting.textContent = "";
        if (adminLink) adminLink.style.display = "none";
    }
}

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    
    // Handle login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const result = loginUser(email, password);
            if (result.success) {
                window.location.href = "index.html";
            } else {
                alert(result.message);
            }
        });
    }
    
    // Handle registration form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            const result = registerUser(name, email, password);
            if (result.success) {
                window.location.href = "index.html";
            } else {
                alert(result.message);
            }
        });
    }
});