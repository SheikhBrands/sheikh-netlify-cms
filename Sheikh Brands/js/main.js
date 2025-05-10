/**
 * PakStore - Pakistani eCommerce Website
 * main.js - Core functionality shared across all pages
 */

// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');
const burger = document.querySelector('.burger');
const cartCount = document.getElementById('cart-count');
const authLink = document.getElementById('auth-link');

// Mobile Navigation Toggle
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');
    
    // Toggle burger animation
    document.querySelectorAll('.burger div').forEach((line, index) => {
        if (index === 0) line.style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(-5px, 6px)' : '';
        if (index === 1) line.style.opacity = navLinks.classList.contains('active') ? '0' : '1';
        if (index === 2) line.style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(-5px, -6px)' : '';
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            burger.classList.remove('active');
        }
    });
});

// Update cart count on page load
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) cartCount.textContent = count;
}

// Update auth link based on login status
function updateAuthUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (authLink) {
        if (currentUser) {
            authLink.textContent = "Logout";
            authLink.href = "javascript:logoutUser();location.reload()";
        } else {
            authLink.textContent = "Login";
            authLink.href = "login.html";
        }
    }
}

// Simple logout function
function logoutUser() {
    localStorage.removeItem('currentUser');
    updateAuthUI();
    updateCartCount();
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateAuthUI();
    
    // Add active class to current page link
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage) {
            link.classList.add('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0
    }).format(amount).replace('PKR', 'Rs.');
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add to cart function (used in product listings)
function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} added to cart!`);
}

// Initialize sample products if none exist
function initializeSampleProducts() {
    if (!localStorage.getItem('products')) {
        const sampleProducts = [
            {
                id: 1,
                name: "Men's Casual Shirt",
                price: 1499,
                category: "men",
                image: "images/shirt1.jpg",
                stock: 15,
                description: "Comfortable cotton shirt for casual wear"
            },
            {
                id: 2,
                name: "Women's Kurti",
                price: 1999,
                category: "women",
                image: "images/kurti1.jpg",
                stock: 10,
                description: "Elegant kurti with embroidery work"
            },
            {
                id: 3,
                name: "Kids T-Shirt",
                price: 799,
                category: "kids",
                image: "images/kids-tshirt.jpg",
                stock: 20,
                description: "Colorful t-shirt for kids"
            },
            {
                id: 4,
                name: "Smartphone",
                price: 34999,
                category: "electronics",
                image: "images/phone1.jpg",
                stock: 5,
                description: "Latest smartphone with great features"
            },
            {
                id: 5,
                name: "Home Decor Item",
                price: 2499,
                category: "home",
                image: "images/decor1.jpg",
                stock: 8,
                description: "Beautiful home decoration piece"
            },
            {
                id: 6,
                name: "Men's Jeans",
                price: 2499,
                category: "men",
                image: "images/jeans1.jpg",
                stock: 12,
                description: "Stylish jeans for men"
            }
        ];
        
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
}

// Initialize sample users if none exist
function initializeSampleUsers() {
    if (!localStorage.getItem('users')) {
        const sampleUsers = [
            {
                id: 1,
                name: "Admin",
                email: "admin@pakstore.com",
                password: "admin123",
                isAdmin: true
            },
            {
                id: 2,
                name: "Test User",
                email: "user@pakstore.com",
                password: "user123",
                isAdmin: false
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
}

// Initialize data on first load
initializeSampleProducts();
initializeSampleUsers();