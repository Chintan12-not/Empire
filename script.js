// Initialize cart and user from local storage
let cart = JSON.parse(localStorage.getItem('empire_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('empire_user')) || null;

// === 1. MASTER PRODUCT DATABASE ===
const productDatabase = {
    'blush': {
        name: "Blush ELIXIR",
        price: 4250,
        img: 'images/Blush ELIXIR.jpg',
        tagline: "Soft • Floral • Elegant • Feminine • Luxurious",
        description: "Blush Elixir is soft, sensual, and irresistibly elegant. It opens with a delicate burst of fresh fruits and gentle florals...",
        details: "Romantic yet confident, sweet but never overpowering.",
        top: "Pink Berries, Lychee",
        heart: "Rose, Jasmine",
        base: "Vanilla, Sandalwood"
    },
    'whisky': {
        name: "Smoked Whisky",
        price: 4899,
        img: 'images/Smoked Whisky.jpg',
        tagline: "Bold • Smoky • Masculine • Intense",
        description: "A rich, complex blend of aged bourbon and charred oak.",
        details: "A rich, masculine scent featuring charred oak.",
        top: "Black Pepper",
        heart: "Whisky, Tobacco",
        base: "Oak, Amber"
    },
    'ocean': {
        name: "Ocean Aura",
        price: 3950,
        img: 'images/Ocean Aura.jpg',
        tagline: "Fresh • Aquatic • Breezy",
        description: "The essence of the Mediterranean in a bottle.",
        details: "Inspired by coastal breezes.",
        top: "Sea Salt",
        heart: "Neroli",
        base: "Driftwood"
    },
    'oud': {
        name: "Royal Oud",
        price: 4199,
        img: 'images/p1.jpg',
        tagline: "Majestic • Spicy • Deep",
        description: "Liquid gold creation. Precious Cambodian Oud.",
        details: "An unmistakable aura of power.",
        top: "Saffron",
        heart: "Oud, Rosewood",
        base: "Sandalwood"
    }
};

// === 2. INITIALIZATION ===
window.onload = () => {
    updateCartUI();
    checkUser();
    updateNavAuth(); // Calls the empty function as requested
    
    const path = window.location.pathname;
    if (path.includes('checkout.html')) renderCheckout();
    if (path.includes('product-detail.html')) {
        const productId = new URLSearchParams(window.location.search).get('id'); 
        if (productId) renderProductDetail(productId);
    }
    
    initScrollReveal();
    
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        initSearch();
    }
};

// === 3. AUTHENTICATION FUNCTIONS ===
function updateNavAuth() {
  // Sign-in removed as requested
}

function checkUser() {
    currentUser = JSON.parse(localStorage.getItem('empire_user'));
    return currentUser;
}

// === 4. ENHANCED CART SYSTEM ===
function addToCart(name, price, qty = 1) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }
    
    saveCart();
    updateCartUI();
    toggleCart(true);
    toast(`${qty}x ${name} added to selection`);
}

function updateCartUI() {
    const countLabel = document.getElementById('cartCount');
    if (countLabel) {
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        countLabel.innerText = totalQty;
        countLabel.style.display = totalQty > 0 ? 'inline' : 'none';
    }
    
    const container = document.getElementById('cartItemsContainer');
    const totalLabel = document.getElementById('cartTotalValue');
    const checkoutBtn = document.querySelector('.cart-sidebar-footer .btn.primary');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Your selection is empty.</p>';
        if (totalLabel) totalLabel.innerText = '₹0';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateCartItem(${index}, ${item.qty - 1})" ${item.qty <= 1 ? 'disabled' : ''}>−</button>
                <span>${item.qty}</span>
                <button onclick="updateCartItem(${index}, ${item.qty + 1})">+</button>
                <button class="cart-remove-btn" onclick="removeFromCart(${index})">✕</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (totalLabel) totalLabel.innerText = `₹${total.toLocaleString()}`;
}

function updateCartItem(index, newQty) {
    if (newQty < 1) {
        removeFromCart(index);
        return;
    }
    cart[index].qty = newQty;
    saveCart();
    updateCartUI();
}

function removeFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    toast(`${itemName} removed from selection`);
}

// === 5. PRODUCT NAVIGATION ===
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

function renderProductDetail(productId) {
    const container = document.getElementById('productDetailContainer');
    if (!container) return;
    
    const product = productDatabase[productId];
    if (!product) {
        container.innerHTML = '<p>Product not found</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="product-detail-images">
            <img src="${product.img}" alt="${product.name}" class="product-main-image">
        </div>
        <div class="product-detail-info">
            <h1 class="product-detail-title">${product.name}</h1>
            <div class="product-tagline">${product.tagline}</div>
            <div class="product-detail-price">₹${product.price.toLocaleString()}</div>
            <div class="product-description">
                <p>${product.description}</p>
                <p>${product.details}</p>
            </div>
            <div class="scent-notes-detail">
                <h3>Fragrance Notes</h3>
                <div class="notes-grid">
                    <div class="note-card"><h4>Top</h4><p>${product.top}</p></div>
                    <div class="note-card"><h4>Heart</h4><p>${product.heart}</p></div>
                    <div class="note-card"><h4>Base</h4><p>${product.base}</p></div>
                </div>
            </div>
            <div class="product-actions">
                <div class="quantity-selector">
                    <button onclick="updateDetailQty(-1)">−</button>
                    <span id="detailQty">1</span>
                    <button onclick="updateDetailQty(1)">+</button>
                </div>
                <button class="btn primary" onclick="addToCart('${product.name}', ${product.price}, parseInt(document.getElementById('detailQty').innerText))">
                    Add to Selection
                </button>
            </div>
        </div>`;
}

function updateDetailQty(change) {
    const qtyElement = document.getElementById('detailQty');
    let qty = parseInt(qtyElement.innerText);
    qty = Math.max(1, qty + change);
    qtyElement.innerText = qty;
}

// === 6. SEARCH & UTILITIES ===
function initSearch() {
    const navRight = document.querySelector('.nav-right');
    if (navRight && !document.querySelector('.search-container')) {
        const searchHTML = `
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Search fragrances...">
                <button class="search-btn" onclick="performSearch()">
                    <i class="fa fa-search"></i>
                </button>
            </div>`;
        navRight.insertAdjacentHTML('afterbegin', searchHTML);
        document.getElementById('searchInput').addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    }
}

function performSearch(query = '') {
    const searchTerm = query || document.getElementById('searchInput').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const notes = card.querySelector('.scent-notes').textContent.toLowerCase();
        card.style.display = (title.includes(searchTerm) || notes.includes(searchTerm)) ? 'block' : 'none';
    });
}

function saveCart() { localStorage.setItem('empire_cart', JSON.stringify(cart)); }

function toggleCart(open) {
    const sidebar = document.getElementById('cartSidebar');
    if (!sidebar) return;
    if (open === true) sidebar.classList.add('active');
    else if (open === false) sidebar.classList.remove('active');
    else sidebar.classList.toggle('active');
}

function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('active');
}

function submitContact(event) {
    event.preventDefault();
    toast('Message sent to our concierge!');
    event.target.reset();
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('reveal-active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-hidden').forEach(el => observer.observe(el));
}

function toast(msg) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 300);
    }, 3000);
}