// Sample product data
const products = [
    {
        id: 1,
        name: "Men's Casual Shirt",
        price: 1499,
        category: "men",
        image: "images/shirt1.jpg",
        stock: 15,
        description: "Comfortable cotton shirt for casual wear"
    },
    // More products...
];

// Display products with filtering
function displayProducts(filteredProducts = products) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">Rs. ${product.price.toLocaleString()}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <a href="product-detail.html?id=${product.id}" class="view-details">View Details</a>
        `;
        productsContainer.appendChild(productCard);
    });
}

// Filter products
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    
    let filtered = [...products];
    
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    if (priceFilter === 'under1000') {
        filtered = filtered.filter(p => p.price < 1000);
    } else if (priceFilter === '1000-3000') {
        filtered = filtered.filter(p => p.price >= 1000 && p.price <= 3000);
    } else if (priceFilter === 'over3000') {
        filtered = filtered.filter(p => p.price > 3000);
    }
    
    displayProducts(filtered);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Set up filter event listeners
    document.getElementById('category-filter').addEventListener('change', filterProducts);
    document.getElementById('price-filter').addEventListener('change', filterProducts);
});