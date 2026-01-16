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
// 2. LOCAL PRODUCT DATABASE
// ==================================================

const productDatabase = {
    whisky: {
        id: "whisky",
        name: "Smoked Whisky",
        price: 2800,
        originalPrice: 2800,
        img: "images/Smoked Whisky.jpg",
        tagline: "Warm • Smoky • Boozy • Luxurious • Powerful",
        description: `Smoked Whisky is deep, bold, and intoxicating. It opens with a warm smoky accord, like oak barrels kissed by fire, instantly giving a dark and mysterious character. \n\nThe heart is rich and smooth, blending aged whiskey notes with subtle sweetness, creating a luxurious and addictive warmth. \n\nAs it settles, hints of amber, soft woods, and gentle spice linger on the skin, leaving a powerful, masculine, and premium trail. \n\nThis fragrance feels royal, confident, and intense — made for evenings, power moves, and statement moments.`,
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
        description: `Ocean Aura is fresh, clean, and effortlessly luxurious. It opens like a cool ocean breeze at dawn — crisp, airy, and energizing. \n\nThe fragrance carries the purity of deep blue waters blended with modern elegance, giving a calm yet confident presence. \n\nAs it evolves, soft aquatic florals and mineral notes add sophistication without sweetness. \n\nThe dry-down is smooth, musky, and slightly woody, leaving a long-lasting, clean trail that feels refined and powerful.`,
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
        description: `Blush Elixir is soft, sensual, and irresistibly elegant. It opens with a delicate burst of fresh fruits and gentle florals, creating a graceful and luminous first impression. \n\nThe heart blooms with romantic petals and creamy sweetness, giving a refined feminine charm that feels modern and luxurious. \n\nAs it settles, warm musks and smooth woods wrap the fragrance in a subtle, addictive softness that lingers beautifully on the skin.`,
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

    initContactForm();
    if (supabaseClient) checkAuth();
    updateCartUI();
    initScrollReveal();
    setupWhatsApp();

    // Force Login Modal if user is not logged in
    setTimeout(() => {
        if (!currentUser) {
            document.getElementById("authModal")?.classList.add("active");
        }
    }, 800);
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

        if (event === "SIGNED_IN" && session?.user?.email === "chintanmaheshwari714@gmail.com") {
            window.location.href = "admin-secret.html";
        }
    });
}

async function checkAuth() {
    if (!supabaseClient) return;
    const { data: { user } } = await supabaseClient.auth.getUser();
    currentUser = user;
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
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    closeAuth();
}

/**
 * UPDATED: Instant Close Auth Modal
 */
function closeAuth() {
    const modal = document.getElementById("authModal");
    if (!modal) return;

    modal.classList.remove("active");
    modal.style.display = "none";

    // force reflow reset (removes lag on reopen)
    requestAnimationFrame(() => {
        modal.style.display = "";
    });
}

async function signInWithGoogle() {
    if (!supabaseClient) return alert("Authentication service unavailable");
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin }
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
    if (typeof force === "boolean") {
        force ? el.classList.add("active") : el.classList.remove("active");
    } else {
        el.classList.toggle("active");
    }
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
                    <span class="new-price">₹${product.price.toLocaleString()}</span>
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
    container.innerHTML = `<p style="color:#d4af37; text-align:center; letter-spacing:2px; padding: 50px;">PRODUCT NOT FOUND</p>`;
}

// ==================================================
// 8. ORDER & INVOICE SYSTEM
// ==================================================

async function placeOrder() {
    if (!supabaseClient) return alert("Connection error");
    if (!requireAuth()) return; 
    if (cart.length === 0) return alert("Cart is empty");

    const name = document.getElementById("checkoutName")?.value || "Customer";
    const phone = document.getElementById("checkoutPhone")?.value || "";
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    const { error } = await supabaseClient
        .from("orders")
        .insert([{
            customer_name: name,
            phone: phone,
            email: currentUser.email,
            items: cart,
            total_amount: total,
            status: "pending"
        }]);

    if (error) {
        alert("Order failed: " + error.message);
        return;
    }

    cart = [];
    saveCart();
    updateCartUI();
    alert("Order placed successfully!");
    toggleCart(false);
}

// ==================================================
// 9. UTILITIES & CONTACT FORM
// ==================================================

function initScrollReveal() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("reveal-active");
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal-hidden").forEach(el => observer.observe(el));
}

function setupWhatsApp() {
    const wa = document.querySelector(".whatsapp-float");
    if (wa) wa.href = "https://wa.me/919911261347";
}

function initContactForm() {
    const form = document.getElementById("contactForm");
    const successMsg = document.getElementById("contactSuccess");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const response = await fetch("https://formsubmit.co/ajax/empire.official2026@gmail.com", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                form.reset();
                if (successMsg) {
                    successMsg.style.display = "block";
                    setTimeout(() => { successMsg.style.display = "none"; }, 5000);
                }
            } else {
                throw new Error("Form submission failed");
            }
        } catch (err) {
            alert("Something went wrong. Please try again.");
            console.error(err);
        }
    });
}

function submitContactForm() {
    const form = document.getElementById("contactForm");
    if (form) form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
}

// ==================================================
// 10. AUTH HELPERS
// ==================================================

function requireAuth() {
    if (!currentUser) {
        document.getElementById("authModal")?.classList.add("active");
        return false;
    }
    return true;
}