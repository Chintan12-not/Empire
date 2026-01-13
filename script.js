// ==================================================
// 1. INITIALIZATION & GLOBAL DATA
// ==================================================

const SUPABASE_URL = "https://wolxccbehsbafyirgvgp.supabase.co";
const SUPABASE_KEY = "sb_publishable_1NCRxQCEEOEnr0jJ6H-ASg_JQxgdr3L";

const supabaseClient = window.supabase
    ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

let cart = JSON.parse(localStorage.getItem("empire_cart")) || [];
let currentUser = null;

// ==================================================
// 2. LOCAL PRODUCT DATABASE (PRICES UPDATED TO 2800)
// ==================================================

const productDatabase = {
    whisky: {
        id: "whisky",
        name: "Smoked Whisky",
        price: 2800,
        originalPrice: 2800,
        img: "images/Smoked Whisky.jpg",
        tagline: "Warm • Smoky • Boozy • Luxurious • Powerful",
        description: `Smoked Whisky is deep, bold, and intoxicating. It opens with a warm smoky accord, like oak barrels kissed by fire, instantly giving a dark and mysterious character.

The heart is rich and smooth, blending aged whiskey notes with subtle sweetness, creating a luxurious and addictive warmth.

As it settles, hints of amber, soft woods, and gentle spice linger on the skin, leaving a powerful, masculine, and premium trail.

This fragrance feels royal, confident, and intense — made for evenings, power moves, and statement moments.`,
        top: "Smoked Oak • Whiskey Accord • Light Spicy Pepper",
        heart: "Charred Wood • Caramelized Amber • Toasted Vanilla",
        base: "Dark Amber • Leather • Dry Woods • Soft Musk"
    },
    ocean: {
        id: "ocean",
        name: "Ocean Aura",
        price: 2800,
        originalPrice: 2800,
        img: "images/Ocean Aura.jpg",
        tagline: "Fresh • Aquatic • Clean • Elegant • Premium",
        description: `Ocean Aura is fresh, clean, and effortlessly luxurious. It opens like a cool ocean breeze at dawn — crisp, airy, and energizing.

The fragrance carries the purity of deep blue waters blended with modern elegance, giving a calm yet confident presence.

As it evolves, soft aquatic florals and mineral notes add sophistication without sweetness.

The dry-down is smooth, musky, and slightly woody, leaving a long-lasting, clean trail that feels refined and powerful.

Ocean Aura is fresh but not basic, cool yet commanding — perfect for daily wear, summer days, and moments where quiet confidence speaks louder than noise.`,
        top: "Marine Accord • Bergamot • Lemon Zest",
        heart: "Sea Salt • Water Lily • Lavender",
        base: "White Musk • Driftwood • Ambergris"
    },
    blush: {
        id: "blush",
        name: "Blush ELIXIR",
        price: 2800,
        originalPrice: 2800,
        img: "images/Blush ELIXIR.jpg",
        tagline: "Soft • Floral • Elegant • Feminine • Luxurious",
        description: `Blush Elixir is soft, sensual, and irresistibly elegant. It opens with a delicate burst of fresh fruits and gentle florals, creating a graceful and luminous first impression.

The heart blooms with romantic petals and creamy sweetness, giving a refined feminine charm that feels modern and luxurious.

As it settles, warm musks and smooth woods wrap the fragrance in a subtle, addictive softness that lingers beautifully on the skin.

Blush Elixir is romantic yet confident, sweet but never overpowering — made for moments when elegance, charm, and quiet luxury define your presence.`,
        top: "Pink Berries • Lychee • Mandarin Blossom",
        heart: "Rose Petals • Peony • Jasmine",
        base: "White Musk • Vanilla • Sandalwood"
    }
};

// ==================================================
// 3. PAGE LOAD HANDLER
// ==================================================

window.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("productDetailContainer");
    if (productContainer) {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");
        productId ? renderProductDetail(productId) : renderNotFound(productContainer);
    }

    if (supabaseClient) checkAuth();
    
    updateCartUI();
    initScrollReveal();
    setupWhatsApp();
});

// ==================================================
// 4. NAVIGATION & SEARCH
// ==================================================

function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

function toggleMenu() {
    document.getElementById("mobileMenu")?.classList.toggle("active");
}

document.addEventListener("input", (e) => {
    if (e.target.id !== "searchInput") return;
    const term = e.target.value.toLowerCase();
    document.querySelectorAll(".product-card").forEach(card => {
        const name = card.querySelector(".product-name")?.innerText.toLowerCase() || "";
        card.style.display = name.includes(term) ? "block" : "none";
    });
});

// ==================================================
// 5. AUTHENTICATION (SUPABASE)
// ==================================================

if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
        currentUser = session?.user || null;
        updateAuthUI();

        // AUTO OPEN ADMIN PANEL FOR ADMIN EMAIL
        if (
            event === "SIGNED_IN" &&
            session?.user?.email === "chintamaheshwari714@gmail.com"
        ) {
            window.location.href = "admin-secret.html";
        }
    });
}

async function checkAuth() {
    if (!supabaseClient) return;
    const { data } = await supabaseClient.auth.getUser();
    currentUser = data.user;
    updateAuthUI();
}

function updateAuthUI() {
    const btn = document.getElementById("authBtn");
    if (!btn) return;
    if (currentUser) {
        const name = currentUser.user_metadata?.full_name || currentUser.email.split("@")[0];
        btn.innerText = `Hi, ${name}`;
        btn.onclick = logout;
    } else {
        btn.innerText = "Login";
        btn.onclick = () => document.getElementById("authModal")?.classList.add("active");
    }
}

async function signIn() {
    const email = document.getElementById("authEmail").value;
    const password = document.getElementById("authPassword").value;
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    closeAuth();
}

function closeAuth() {
    document.getElementById("authModal")?.classList.remove("active");
}

async function signInWithGoogle() {
    if (!supabaseClient) {
        alert("Authentication service unavailable");
        return;
    }

    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin
        }
    });

    if (error) alert(error.message);
}

async function logout() {
    await supabaseClient.auth.signOut();
    currentUser = null;
    updateAuthUI();
}

// ==================================================
// 6. CART SYSTEM
// ==================================================

function saveCart() {
    localStorage.setItem("empire_cart", JSON.stringify(cart));
}

function addToCart(name, price, qty = 1) {
    const item = cart.find(i => i.name === name);
    item ? (item.qty += qty) : cart.push({ name, price, qty });
    saveCart();
    updateCartUI();
    toggleCart(true);
}

function updateCartUI() {
    const count = document.getElementById("cartCount");
    if (count) count.innerText = cart.reduce((s, i) => s + i.qty, 0);

    const container = document.getElementById("cartItemsContainer");
    const totalEl = document.getElementById("cartTotalValue");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-msg">Your selection is empty.</p>`;
        if (totalEl) totalEl.innerText = "₹0";
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} × ${item.qty}</span>
            <strong>₹${(item.price * item.qty).toLocaleString()}</strong>
        </div>
    `).join("");

    if (totalEl) totalEl.innerText = "₹" + cart.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString();
}

function toggleCart(force) {
    const el = document.getElementById("cartSidebar");
    if (!el) return;
    force === true ? el.classList.add("active") : (force === false ? el.classList.remove("active") : el.classList.toggle("active"));
}

// ==================================================
// 7. PRODUCT DETAIL RENDERING
// ==================================================

function renderProductDetail(productId) {
    const product = productDatabase[productId];
    const container = document.getElementById("productDetailContainer");
    if (!product || !container) return;

    container.innerHTML = `
        <div class="luxury-detail-grid">
            <div class="luxury-image">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="luxury-info">
                <h1 class="luxury-title">${product.name}</h1>
                <p class="luxury-tagline">${product.tagline}</p>
                <div class="price-block">
                    <span class="old-price">₹${product.originalPrice.toLocaleString()}</span>
                    <span class="new-price">₹${product.price.toLocaleString()}</span>
                    <span class="discount-text">70% OFF</span>
                </div>
                <p class="luxury-desc" style="white-space: pre-line; line-height: 1.6; margin-bottom: 2rem;">${product.description}</p>
                <div class="luxury-notes">
                    <h3 style="margin-bottom: 1rem; border-bottom: 1px solid #d4af37; display: inline-block;">Fragrance Notes</h3>
                    <div class="notes-row">
                        <div style="margin-bottom: 10px;"><strong>Top: </strong>${product.top}</div>
                        <div style="margin-bottom: 10px;"><strong>Heart: </strong>${product.heart}</div>
                        <div style="margin-bottom: 10px;"><strong>Base: </strong>${product.base}</div>
                    </div>
                </div>
                <div class="luxury-actions" style="margin-top: 2rem;">
                    <button class="btn ghost" onclick="updateDetailQty(-1)">−</button>
                    <span id="detailQty" style="margin: 0 15px; font-weight: bold;">1</span>
                    <button class="btn ghost" onclick="updateDetailQty(1)">+</button>
                    <button class="btn primary" style="margin-left: 20px;" onclick="addToCart('${product.name}', ${product.price}, parseInt(document.getElementById('detailQty').innerText))">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateDetailQty(change) {
    const el = document.getElementById("detailQty");
    if (el) el.innerText = Math.max(1, parseInt(el.innerText) + change);
}

function renderNotFound(container) {
    container.innerHTML = `<p style="color:#d4af37; text-align:center; letter-spacing:2px;">PRODUCT NOT FOUND</p>`;
}

// ==================================================
// 8. ORDER & INVOICE SYSTEM
// ==================================================

async function placeOrder() {
    if (!supabaseClient) {
        alert("Supabase not connected");
        return;
    }

    if (!currentUser) {
        alert("Please login to place order");
        return;
    }

    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const name = document.getElementById("checkoutName")?.value || "Customer";
    const phone = document.getElementById("checkoutPhone")?.value || "";
    const email = currentUser.email;
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    const { error } = await supabaseClient
        .from("orders")
        .insert([
            {
                customer_name: name,
                phone: phone,
                email: email,
                items: cart,
                total_amount: total,
                status: "pending"
            }
        ]);

    if (error) {
        console.error(error);
        alert("Order failed: " + error.message);
        return;
    }

    cart = [];
    localStorage.removeItem("empire_cart");
    updateCartUI();
    alert("Order placed successfully!");
}

function generateInvoice(order) {
    if (!window.jspdf) {
        alert("Invoice system not loaded");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const invoiceNo = "EB-" + Date.now();
    const date = new Date().toLocaleDateString("en-IN");

    doc.setFont("helvetica", "bold").setFontSize(16).text("E’MPIRE BOUTIQUE", 20, 20);
    doc.setFontSize(12).text("BILL OF SUPPLY", 20, 28);
    doc.setFont("helvetica", "normal").setFontSize(9).text("(GST not applicable – seller not registered under GST)", 20, 34);
    doc.setFontSize(10).text(`Invoice No: ${invoiceNo}`, 20, 44);
    doc.text(`Date: ${date}`, 20, 50);

    doc.setFont("helvetica", "bold").text("Seller Details", 20, 62);
    doc.setFont("helvetica", "normal").text("Business Name: E’MPIRE BOUTIQUE", 20, 68);
    // ... other invoice fields ...

    doc.save(`EMPIRE_Bill_of_Supply_${invoiceNo}.pdf`);
}

// ==================================================
// 9. UTILITIES
// ==================================================

function initScrollReveal() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => e.isIntersecting && e.target.classList.add("reveal-active"));
    });
    document.querySelectorAll(".reveal-hidden").forEach(el => observer.observe(el));
}

function setupWhatsApp() {
    const wa = document.querySelector(".whatsapp-float");
    if (wa) wa.href = "https://wa.me/919911261347";
}