// Shopping Cart Management
let cart = [];

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const productsGrid = document.getElementById('productsGrid');

// Cart Modal Toggle
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

// Add to Cart Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
        const button = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
        
        // Check if it's the featured product or regular product
        if (button.classList.contains('featured-btn')) {
            addFeaturedToCart();
        } else {
            const productCard = button.closest('.product-card');
            addToCart(productCard);
        }
    }
});

// Add Featured Product to Cart
function addFeaturedToCart() {
    const product = {
        id: 'featured-' + Date.now(),
        name: 'Samurai King Reeding',
        category: 'Premium',
        price: 150.00,
        image: document.getElementById('featuredImg').src
    };
    
    cart.push(product);
    updateCart();
    showNotification('Added to cart!');
}

// Add Product to Cart
function addToCart(productCard) {
    const product = {
        id: 'product-' + Date.now(),
        name: productCard.querySelector('.product-name').textContent,
        category: productCard.querySelector('.product-category').textContent,
        price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')),
        image: productCard.querySelector('.product-image-wrapper img').src
    };
    
    cart.push(product);
    updateCart();
    showNotification('Added to cart!');
}

// Update Cart Display
function updateCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price;
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-category">${item.category}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">&times;</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = '$' + total.toFixed(2);
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #000;
        color: #fff;
        padding: 15px 25px;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Filter Functionality
const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
const priceCheckboxes = document.querySelectorAll('input[name="price"]');

categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
});

priceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
});

function filterProducts() {
    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const selectedPrices = Array.from(priceCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const category = product.dataset.category;
        const price = parseFloat(product.dataset.price);
        
        let showProduct = true;
        
        // Filter by category
        if (selectedCategories.length > 0) {
            showProduct = selectedCategories.includes(category);
        }
        
        // Filter by price
        if (showProduct && selectedPrices.length > 0) {
            let matchesPrice = false;
            selectedPrices.forEach(range => {
                if (range === '0-20' && price < 20) matchesPrice = true;
                if (range === '20-100' && price >= 20 && price <= 100) matchesPrice = true;
                if (range === '100-200' && price > 100 && price <= 200) matchesPrice = true;
                if (range === '200+' && price > 200) matchesPrice = true;
            });
            showProduct = matchesPrice;
        }
        
        product.style.display = showProduct ? 'flex' : 'none';
    });
}

// Pagination
const paginationBtns = document.querySelectorAll('.pagination-btn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

paginationBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.id === 'prevBtn' || this.id === 'nextBtn') return;
        
        paginationBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Scroll to top of products
        window.scrollTo({
            top: document.querySelector('.products-grid').offsetTop - 100,
            behavior: 'smooth'
        });
    });
});

// Sort Functionality
const sortBtn = document.getElementById('sortBtn');
let currentSort = 'price-asc';

sortBtn.addEventListener('click', () => {
    const products = Array.from(document.querySelectorAll('.product-card'));
    const grid = document.getElementById('productsGrid');
    
    // Toggle sort order
    currentSort = currentSort === 'price-asc' ? 'price-desc' : 'price-asc';
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        
        return currentSort === 'price-asc' ? priceA - priceB : priceB - priceA;
    });
    
    // Clear and re-append sorted products
    grid.innerHTML = '';
    products.forEach(product => grid.appendChild(product));
    
    // Update sort button text
    const sortValue = sortBtn.querySelector('.sort-value');
    sortValue.textContent = currentSort === 'price-asc' ? 'Price (Low to High)' : 'Price (High to Low)';
});

// Smooth scroll for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize
console.log('Bejamas Shopping initialized');
