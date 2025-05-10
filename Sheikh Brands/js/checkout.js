// Cities with delivery charges
const cities = [
    { name: "Karachi", deliveryCharge: 150 },
    { name: "Lahore", deliveryCharge: 200 },
    { name: "Islamabad", deliveryCharge: 250 },
    { name: "Rawalpindi", deliveryCharge: 250 },
    { name: "Multan", deliveryCharge: 300 },
    { name: "Faisalabad", deliveryCharge: 300 },
    { name: "Peshawar", deliveryCharge: 350 },
    { name: "Other Cities", deliveryCharge: 500 }
];

function populateCities() {
    const citySelect = document.getElementById('city');
    if (!citySelect) return;
    
    citySelect.innerHTML = cities.map(city => 
        `<option value="${city.name}" data-charge="${city.deliveryCharge}">${city.name} (Rs. ${city.deliveryCharge})</option>`
    ).join('');
    
    citySelect.addEventListener('change', updateOrderSummary);
}

function updateOrderSummary() {
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const citySelect = document.getElementById('city');
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (!citySelect) return;
    
    const deliveryCharge = parseInt(citySelect.selectedOptions[0].dataset.charge) || 0;
    const grandTotal = cartTotal + deliveryCharge;
    
    document.getElementById('subtotal').textContent = `Rs. ${cartTotal.toLocaleString()}`;
    document.getElementById('delivery-charge').textContent = `Rs. ${deliveryCharge.toLocaleString()}`;
    document.getElementById('grand-total').textContent = `Rs. ${grandTotal.toLocaleString()}`;
    
    // Show/hide payment instructions based on method
    document.getElementById('cod-instructions').style.display = 
        paymentMethod === 'cod' ? 'block' : 'none';
    document.getElementById('easypaisa-instructions').style.display = 
        paymentMethod === 'easypaisa' ? 'block' : 'none';
    document.getElementById('jazzcash-instructions').style.display = 
        paymentMethod === 'jazzcash' ? 'block' : 'none';
}

function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (!name || !phone || !address || !city) {
        alert('Please fill in all required fields');
        return;
    }
    
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: { name, email, phone, address, city },
        items: [...cart],
        paymentMethod,
        status: 'pending'
    };
    
    // Save order to localStorage (in a real app, this would be an API call)
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    updateCart();
    
    // Redirect to thank you page or show confirmation
    window.location.href = `order-confirmation.html?id=${order.id}`;
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    populateCities();
    updateOrderSummary();
    
    // Add event listeners
    document.getElementById('city').addEventListener('change', updateOrderSummary);
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', updateOrderSummary);
    });
    
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        placeOrder();
    });
});