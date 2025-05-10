function renderAdminDashboard() {
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = "login.html";
        return;
    }
    
    // Display all products for editing
    const productsContainer = document.getElementById('admin-products');
    productsContainer.innerHTML = products.map(product => `
        <div class="admin-product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Rs. ${product.price}</p>
                <p>Stock: ${product.stock}</p>
            </div>
            <div class="product-actions">
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `).join('');
    
    // Display orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersContainer = document.getElementById('admin-orders');
    ordersContainer.innerHTML = orders.map(order => `
        <div class="admin-order-card">
            <h3>Order #${order.id}</h3>
            <p>Customer: ${order.customer.name}</p>
            <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
            <p>Total: Rs. ${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</p>
            <p>Status: ${order.status}</p>
            <button onclick="updateOrderStatus(${order.id}, 'completed')">Mark Completed</button>
        </div>
    `).join('');
}

function addNewProduct() {
    const name = prompt("Enter product name:");
    const price = parseFloat(prompt("Enter product price:"));
    const category = prompt("Enter category (men/women/kids/electronics):");
    const stock = parseInt(prompt("Enter stock quantity:"));
    const description = prompt("Enter product description:");
    
    if (name && price && category && stock && description) {
        const newProduct = {
            id: Date.now(),
            name,
            price,
            category,
            stock,
            description,
            image: "images/default-product.jpg" // Default image
        };
        
        products.push(newProduct);
        saveProducts();
        renderAdminDashboard();
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newName = prompt("Edit product name:", product.name);
    const newPrice = parseFloat(prompt("Edit product price:", product.price));
    const newStock = parseInt(prompt("Edit stock quantity:", product.stock));
    
    if (newName) product.name = newName;
    if (!isNaN(newPrice)) product.price = newPrice;
    if (!isNaN(newStock)) product.stock = newStock;
    
    saveProducts();
    renderAdminDashboard();
}

function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
            saveProducts();
            renderAdminDashboard();
        }
    }
}

function updateOrderStatus(orderId, status) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        renderAdminDashboard();
    }
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('admin.html')) {
        renderAdminDashboard();
    }
});