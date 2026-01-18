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
    },
    fruityforest: {
        id: "fruityforest",
        name: "Fruity Forest",
        price: 4200,
        originalPrice: 4200,
        img: "images/Fruity Forest 1.jpg",
        tagline: "Fresh • Fruity • Floral • Elegant • Modern",
        description: `A fresh, vibrant fragrance that captures the feeling of effortless elegance and modern femininity. \n\nIt opens with a juicy burst of crisp green fruits and sparkling berries, creating an instantly uplifting and playful impression. As the scent unfolds, soft floral notes bloom gently, adding a delicate and feminine heart. \n\nThe fragrance settles into a clean, smooth base of musks and woods, leaving a light yet lasting trail that feels fresh, confident, and refined. \n\nPerfect for everyday wear — bright, youthful, and irresistibly easy to love.`,
        top: "Green Pear • Juicy Berries • Pink Pepper",
        heart: "Peony • Honeysuckle • Soft Floral Accord",
        base: "White Musk • Cedarwood • Light Woods"
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
    const menu = document.getElementById("mobileMenu");

    if (!btn) return;

    if (currentUser) {
        const name =
            currentUser.user_metadata?.full_name ||
            currentUser.email.split("@")[0];
        btn.innerText = `Hi, ${name}`;
        btn.onclick = logout;

        // Ensure My Orders is visible
        menu?.querySelector('a[href="my-orders.html"]')?.style.setProperty("display", "block");
    } else {
        btn.innerText = "Login";
        btn.onclick = () =>
            document.getElementById("authModal")?.classList.add("active");

        // Hide My Orders for logged-out users
        menu?.querySelector('a[href="my-orders.html"]')?.style.setProperty("display", "none");
    }
}

async function signIn() {
    const email = document.getElementById("authEmail").value;
    const password = document.getElementById("authPassword").value;
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    closeAuth();
}

async function forgotPassword() {
    const email = document.getElementById("authEmail").value;
    if (!email) return alert("Enter your email first");

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/index.html"
    });

    if (error) return alert(error.message);
    alert("Password reset email sent 📧");
}

function closeAuth() {
    const modal = document.getElementById("authModal");
    if (!modal) return;
    modal.classList.remove("active");
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

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #333; padding-bottom: 10px;">
            <div>
                <strong style="display: block; color: #d4af37;">${item.name}</strong>
                <div style="margin-top:6px; display: flex; align-items: center; gap: 10px;">
                    <button class="btn ghost" style="padding: 2px 8px;" onclick="changeQty(${index}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button class="btn ghost" style="padding: 2px 8px;" onclick="changeQty(${index}, 1)">+</button>
                    <button class="btn ghost" style="padding: 2px 8px; color: #ff4444;" onclick="removeItem(${index})">🗑</button>
                </div>
            </div>
            <strong>₹${(item.price * item.qty).toLocaleString()}</strong>
        </div>
    `).join("");

    if (totalEl) totalEl.innerText = "₹" + cart.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString();
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
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
                <div class="luxury-actions" style="margin-top: 2rem; display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center;">
                        <button class="btn ghost" onclick="updateDetailQty(-1)">−</button>
                        <span id="detailQty" style="margin: 0 15px; font-weight: bold;">1</span>
                        <button class="btn ghost" onclick="updateDetailQty(1)">+</button>
                    </div>
                    <button class="btn primary" onclick="addToCart('${product.name}', ${product.price}, parseInt(document.getElementById('detailQty').innerText))">
                        Add to Cart
                    </button>
                    <button class="btn ghost" onclick="shareProduct('${product.name}')">
                        <span style="font-size: 1.2rem;">➦</span> Share
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
            referral_code: localStorage.getItem("applied_referral") || null,
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

async function openOrders() {
  if (!currentUser || !supabaseClient) return;

  const { data, error } = await supabaseClient
    .from("orders")
    .select("*")
    .eq("email", currentUser.email)
    .order("created_at", { ascending: false });

  if (error) return alert("Error fetching orders");

  alert(
    data.length
      ? data.map(o =>
          `Order ₹${o.total_amount} — ${o.status.toUpperCase()}`
        ).join("\n")
      : "No orders yet"
  );
}

// ==================================================
// 9. UTILITIES & CONTACT FORM
// ==================================================

function shareProduct(name) {
    const productId = name.toLowerCase().replace(/\s/g, "").replace("smoked", "");
    const url = window.location.origin + "/product-detail.html?id=" + productId;
    
    if (navigator.share) {
        navigator.share({
            title: "E'MPIRE Perfumes",
            text: `Check out ${name} by E'MPIRE — a signature luxury fragrance.`,
            url: url
        }).catch(() => console.log("Share cancelled"));
    } else {
        const tempInput = document.createElement("input");
        document.body.appendChild(tempInput);
        tempInput.value = url;
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert("Link copied to clipboard! ✨");
    }
}

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

function requireAuth() {
    if (!currentUser) {
        document.getElementById("authModal")?.classList.add("active");
        return false;
    }
    return true;
}

// ==================================================
// 10. IMAGE SLIDER LOGIC
// ==================================================

document.querySelectorAll(".slider").forEach(slider => {
    const slides = slider.querySelectorAll(".slide");
    if (slides.length === 0) return;
    let index = 0;

    setInterval(() => {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
    }, 2500);
});