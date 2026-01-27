// ==================================================

// 1. INITIALIZATION & GLOBAL DATA

// ==================================================

// ================= AUDIO MASTER SYSTEM =================

const AUDIO_KEY = "empire_audio_state";
const TIME_KEY = "empire_audio_time";

function isCheckoutPage() {
    return window.location.pathname.includes("checkout");
}

document.addEventListener("DOMContentLoaded", () => {
    if (isCheckoutPage()) return;

    const audio = document.getElementById("bgAudio");
    const btn = document.getElementById("audioToggle");
    if (!audio || !btn) return;

    let isPlaying = false;

    // Restore time
    const savedTime = localStorage.getItem(TIME_KEY);
    if (savedTime) audio.currentTime = Number(savedTime);

    // Restore state
    const savedState = localStorage.getItem(AUDIO_KEY);

    function playAudio() {
        audio.volume = 0.4;
        audio.play().catch(() => {});
        isPlaying = true;
        btn.textContent = "🔊";
        localStorage.setItem(AUDIO_KEY, "on");
    }

    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        btn.textContent = "🔇";
        localStorage.setItem(AUDIO_KEY, "off");
    }

    // Start on first interaction
    document.addEventListener("click", () => {
        if (savedState !== "off") playAudio();
    }, { once: true });

    // Toggle button
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        isPlaying ? pauseAudio() : playAudio();
    });

    // Save time continuously
    audio.addEventListener("timeupdate", () => {
        localStorage.setItem(TIME_KEY, audio.currentTime);
    });

    // Pause when tab hidden
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) pauseAudio();
    });

    // Pause on unload
    window.addEventListener("beforeunload", () => {
        localStorage.setItem(TIME_KEY, audio.currentTime);
    });
});


const SUPABASE_URL = "https://wolxccbehsbafyirgvgp.supabase.co";

const SUPABASE_KEY = "sb_publishable_1NCRxQCEEOEnr0jJ6H-ASg_JQxgdr3L";



const supabaseClient = window.supabase

    ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

    : null;



let cart = JSON.parse(localStorage.getItem("empire_cart")) || [];

let currentUser = null;

let authInProgress = false; 

let selectedRating = 0; 



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

        description: `Smoked Whisky is deep, bold, and intoxicating. It opens with a warm smoky accord, like oak barrels kissed by fire, instantly giving a dark and mysterious character. \n\nThe heart is rich and smooth, blending aged whiskey notes with subtle sweetness, creating a luxurious and addictive warmth. \n\nAs it settles, hints of amber, soft woods, and gentle spice linger on the skin, leaving a powerful, masculine, and premium trail. \n\nThis fragrance feels royal, confident, and intense — made for evenings, power moves, and statement moments. \n\nNatural ingredients may settle down, shake before use.`,

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

        description: `Ocean Aura is fresh, clean, and effortlessly luxurious. It opens like a cool ocean breeze at dawn — crisp, airy, and energizing. \n\nThe fragrance carries the purity of deep blue waters blended with modern elegance, giving a calm yet confident presence. \n\nAs it evolves, soft aquatic florals and mineral notes add sophistication without sweetness. \n\nThe dry-down is smooth, musky, and slightly woody, leaving a long-lasting, clean trail that feels refined and powerful. \n\nNatural ingredients may settle down, shake before use.`,

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

        description: `Blush Elixir is soft, sensual, and irresistibly elegant. It opens with a delicate burst of fresh fruits and gentle florals, creating a graceful and luminous first impression. \n\nThe heart blooms with romantic petals and creamy sweetness, giving a refined feminine charm that feels modern and luxurious. \n\nAs it settles, warm musks and smooth woods wrap the fragrance in a subtle, addictive softness that lingers beautifully on the skin. \n\nNatural ingredients may settle down, shake before use.`,

        top: "Pink Berries • Lychee • Mandarin Blossom",

        heart: "Rose Petals • Peony • Jasmine",

        base: "White Musk • Vanilla • Sandalwood"

    },

    "pearforest": {

        id: "pearforest",

        name: "Pear Forest",

        price: 4200,

        originalPrice: 4200,

        img: "images/Fruity Forest 1.jpg",

        tagline: "Fresh • Fruity • Floral • Elegant • Modern",

        description: `A fresh, vibrant fragrance that captures the feeling of effortless elegance and modern femininity. \n\nIt opens with a juicy burst of crisp green fruits and sparkling berries, creating an instantly uplifting and playful impression. As the scent unfolds, soft floral notes bloom gently, adding a delicate and feminine heart. \n\nThe fragrance settles into a clean, smooth base of musks and woods, leaving a light yet lasting trail that feels fresh, confident, and refined. \n\nPerfect for everyday wear — bright, youthful, and irresistibly easy to love. \n\nNatural ingredients may settle down, shake before use.`,

        top: "Green Pear • Juicy Berries • Pink Pepper",

        heart: "Peony • Honeysuckle • Soft Floral Accord",

        base: "White Musk • Cedarwood • Light Woods"

    },

    crown: {

        id: "crown",

        name: "Crown of Dunes",

        price: 4200,

        originalPrice: 4200,

        img: "images/Crown of Dunes 1.jpg",

        tagline: "Warm • Amber • Spicy • Woody • Luxurious",

        description: `Crown of Dunes is a warm, luxurious fragrance that blends sweet tonka warmth with rich amber, spices, and deep woody notes. Bold and sensual, it is crafted for evenings and special moments, leaving a long-lasting trail inspired by the mystery and richness of desert nights. \n\nNatural ingredients may settle down, shake before use.`,

        top: "Bergamot • Saffron",

        heart: "Tonka Bean • Rose • Oud",

        base: "Amber • White Musk • Sandalwood • Vanilla"

    },

    supermale: {

        id: "supermale",

        name: "Supermale",

        price: 4800,

        originalPrice: 4800,

        img: "images/Supermale 1.jpg",

        tagline: "Fresh • Bold • Modern • Addictive",

        description: `Supermale is a bold, modern fragrance crafted for confidence and everyday power. Fresh and energetic at the opening, it evolves into warm spices and aromatic depth, settling into a smooth, sensual base that lasts all day. \n\nNatural ingredients may settle down, shake before use.`,

        top: "Mint • Bergamot • Lemon",

        heart: "Lavender • Cinnamon • Clary Sage",

        base: "Vanilla • Amber • Patchouli • Cedarwood"

    },

    berryflora: {

        id: "berryflora",

        name: "Berry Flora",

        price: 4200,

        originalPrice: 4200,

        img: "images/Berry Flora 1.jpg",

        tagline: "Soft • Floral • Fruity • Feminine • Elegant",

        description: `Berry Flora is a soft, radiant fragrance that celebrates femininity through a delicate blend of juicy berries and graceful florals. \n\nFresh and vibrant at the opening, the scent gently unfolds into a floral heart before settling into a smooth, comforting base. Elegant yet playful, Berry Flora is perfect for everyday wear, leaving behind a subtle and irresistible trail. \n\nInspired by a modern floral-fruity classic, this fragrance is designed for women who love freshness with warmth and charm. \n\nA gentle bloom of berries, wrapped in elegance. \n\nNatural ingredients may settle down, shake before use.`,

        top: "Red Berries • Strawberry • Blackcurrant",

        heart: "Jasmine • Violet • Peony",

        base: "Soft Musk • Vanilla • Light Woods"

    },

};



const productReviews = {

    whisky: {

        rating: 4.7,

        total: 327,

        reviews: [

            { name: "Urvi Khandwala", stars: 5, text: "Amazing fragrance. Long lasting and very premium." },

            { name: "Nilesh Parmar", stars: 5, text: "Always my favorite. Perfect for evenings." }

        ]

    },

    crown: {

        rating: 4.8,

        total: 112,

        reviews: [

            { name: "Karthikeyan Nagappan", stars: 5, text: "Rich, warm and luxurious. Smells very expensive." },

            { name: "Aarav Mehta", stars: 4, text: "Perfect for night wear. Strong but classy." }

        ]

    },

    supermale: {

        rating: 4.6,

        total: 189,

        reviews: [

            { name: "Rohit Verma", stars: 5, text: "Fresh yet powerful. Works all day." },

            { name: "Aditya Singh", stars: 4, text: "Great everyday fragrance. Compliment getter." }

        ]

    }

};



// ==================================================

// 3. PAGE LOAD HANDLER

// ==================================================



window.addEventListener("DOMContentLoaded", () => {

    // Product Detail Setup

    const productContainer = document.getElementById("productDetailContainer");

    if (productContainer) {

        const params = new URLSearchParams(window.location.search);

        const productId = params.get("id");

        if (productId) {

            renderProductDetail(productId);

            loadReviews(productId); 

        } else {

            renderNotFound(productContainer);

        }

    }



    // Audio Logic

    const audio = document.getElementById("bgAudio");

    const audioBtn = document.getElementById("audioToggle");

    let isPlaying = false;

    let userInteracted = false;



    function startAudio() {

        if (!isPlaying && audio) {

            audio.volume = 0.4;

            audio.play().catch(() => {});

            isPlaying = true;

            if (audioBtn) audioBtn.textContent = "🔊";

        }

    }



    // Start music on first interaction

    document.addEventListener("click", () => {

        if (!userInteracted) {

            userInteracted = true;

            startAudio();

        }

    }, { once: true });



    // Audio Toggle button

    if (audioBtn) {

        audioBtn.addEventListener("click", (e) => {

            e.stopPropagation();

            if (isPlaying) {

                audio.pause();

                audioBtn.textContent = "🔇";

            } else {

                audio.play();

                audioBtn.textContent = "🔊";

            }

            isPlaying = !isPlaying;

        });

    }



    // Review Stars Listener

    document.addEventListener("click", (e) => {

        const starSpan = e.target.closest(".star-rating span");

        if (starSpan) {

            selectedRating = Number(starSpan.dataset.star);

            updateStars();

        }

    });



    // Initialize Global Utilities

    initContactForm();

    if (supabaseClient) checkAuth();

    updateCartUI();

    initScrollReveal();

    setupWhatsApp();

    updateCheckoutTotals(); 

    initSliders();

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

    if (e.target.id === "searchInput") {

        const term = e.target.value.toLowerCase();

        document.querySelectorAll(".product-card").forEach(card => {

            const name = card.querySelector(".product-name")?.innerText.toLowerCase() || "";

            card.style.display = name.includes(term) ? "block" : "none";

        });

    }



    if (e.target.id === "city" || e.target.id === "state") {

        updateCheckoutTotals();

    }

});



// ==================================================

// 5. AUTHENTICATION (SUPABASE)

// ==================================================



if (supabaseClient) {

    supabaseClient.auth.onAuthStateChange((event, session) => {

        currentUser = session?.user || null;

        updateAuthUI();



        if (event === "SIGNED_IN") {

            authInProgress = false; 

            closeAuth();

            if (session?.user?.email === "chintanmaheshwari714@gmail.com") {

                window.location.href = "admin-secret.html";

            }

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

        const name = currentUser.user_metadata?.full_name || currentUser.email.split("@")[0];

        btn.innerText = `Hi, ${name}`;

        btn.onclick = logout;

        menu?.querySelector('a[href="my-orders.html"]')?.style.setProperty("display", "block");

    } else {

        btn.innerText = "Login";

        btn.onclick = openAuth;

        menu?.querySelector('a[href="my-orders.html"]')?.style.setProperty("display", "none");

    }

}



function openAuth() {

    if (currentUser) return; 

    const modal = document.getElementById("authModal");

    if (!modal || modal.classList.contains("active")) return;

    modal.classList.add("active");

}



function requireAuth(callback) {

    if (currentUser) {

        callback?.();

        return true;

    }

    if (!authInProgress) {

        authInProgress = true;

        openAuth();

    }

    return false;

}



async function signUp() {

    const name = document.getElementById("authName")?.value.trim();

    const email = document.getElementById("authEmail")?.value.trim();

    const phone = document.getElementById("authPhone")?.value.trim();

    const password = document.getElementById("authPassword")?.value;



    if (!name || !email || !password) return;



    const { data, error } = await supabaseClient.auth.signUp({

        email,

        password,

        options: { data: { full_name: name } }

    });



    if (error) {

        alert(error.message);

        return;

    }



    if (data?.user) {

        await supabaseClient.from("profiles").insert({

            id: data.user.id,

            email,

            full_name: name,

            phone: phone || null

        });

    }

    closeAuth();

}



async function signIn() {

    const email = document.getElementById("authEmail")?.value;

    const password = document.getElementById("authPassword")?.value;

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);

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

    authInProgress = false; 

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

    document.getElementById("mobileMenu")?.classList.remove("active");

    document.getElementById("cartSidebar")?.classList.remove("active");

}



// ==================================================

// 6. CART & SHIPPING SYSTEM

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



function buyNow(name, price) {

    // Clear cart and add single item

    cart = [{ name, price, qty: 1 }];

    saveCart();

    updateCartUI();

    // Navigate to checkout

    window.location.href = 'checkout.html';

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

    updateCheckoutTotals(); 

}



function changeQty(index, delta) {

    cart[index].qty += delta;

    if (cart[index].qty <= 0) cart.splice(index, 1);

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



function getShippingCost() {

    const city = document.getElementById("city")?.value.toLowerCase().trim() || "";

    const ncrCities = ["delhi", "new delhi", "noida", "greater noida", "gurgaon", "gurugram", "ghaziabad", "faridabad"];

    return ncrCities.some(c => city.includes(c)) ? 99 : 120;

}



function updateCheckoutTotals() {

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

    const shipping = getShippingCost();

    const shipEl = document.getElementById("shippingValue");

    const subEl = document.getElementById("subtotalValue");

    const finalEl = document.getElementById("finalTotal");



    if (shipEl) shipEl.innerText = `₹${shipping}`;

    if (subEl) subEl.innerText = `₹${subtotal.toLocaleString()}`;

    if (finalEl) finalEl.innerText = `₹${(subtotal + shipping).toLocaleString()}`;

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

        ${renderReviewsSection(productId)}

        ${renderRelatedProducts(productId)}

    `;

}



function renderReviewsSection(productId) {

    const data = productReviews[productId];

    const stars = data ? "★".repeat(Math.round(data.rating)) + "☆".repeat(5 - Math.round(data.rating)) : "☆☆☆☆☆";



    return `

    <section style="margin-top:80px;">

        <h2 style="font-family:'Cinzel'; letter-spacing:3px; margin-bottom:20px;">Customer Reviews</h2>

        <div style="display:flex; gap:40px; margin-bottom:30px;">

            <div>

                <div style="font-size:32px; color:#d4af37;">${data ? data.rating : "0.0"}</div>

                <div style="color:#d4af37;">${stars}</div>

                <div style="font-size:13px; color:#aaa;">Based on ${data ? data.total : "0"} reviews</div>

            </div>

        </div>

        <div id="reviewsList" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:20px; margin-bottom: 40px;"></div>

        <div style="background:#0b0b0b; padding:30px; border-radius:10px; border:1px solid #333;">

            <h3 style="color:#d4af37; margin-bottom:15px;">Write a Review</h3>

            <div class="star-rating" style="font-size:24px; color:#444; cursor:pointer; margin-bottom:15px;">

                <span data-star="1">★</span><span data-star="2">★</span><span data-star="3">★</span><span data-star="4">★</span><span data-star="5">★</span>

            </div>

            <input type="text" id="reviewerName" placeholder="Your Name" style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px; margin-bottom:10px;">

            <textarea id="reviewText" placeholder="Your experience..." style="width:100%; background:#111; border:1px solid #333; color:#fff; padding:10px; height:100px; margin-bottom:15px;"></textarea>

            <button class="btn primary" onclick="submitReview()">Submit Review</button>

        </div>

    </section>

    `;

}



function renderRelatedProducts(currentId) {

    const products = Object.values(productDatabase).filter(p => p.id !== currentId).slice(0, 3);

    return `

    <section style="margin-top:100px;">

        <h2 style="font-family:'Cinzel'; letter-spacing:3px; margin-bottom:30px;">You May Also Like</h2>

        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:30px;">

            ${products.map(p => `

                <div class="product-card" onclick="viewProduct('${p.id}')">

                    <div class="product-media"><img src="${p.img}"></div>

                    <div class="product-body neesh-style">

                        <h3>${p.name}</h3>

                        <div style="color:#d4af37; font-weight:700;">₹${p.price.toLocaleString()}</div>

                    </div>

                </div>

            `).join("")}

        </div>

    </section>

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

    const shipping = getShippingCost();

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);



    const { error } = await supabaseClient

        .from("orders")

        .insert([{

            customer_name: name,

            phone: phone,

            email: currentUser.email,

            items: cart,

            total_amount: subtotal + shipping,

            shipping_cost: shipping,

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



// ==================================================

// 9. DYNAMIC REVIEW LOGIC

// ==================================================



function loadReviews(productId) {

    const container = document.getElementById("reviewsList");

    if (!container) return;



    const localReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];

    const staticData = productReviews[productId]?.reviews || [];

    const allReviews = [...localReviews, ...staticData];



    if (allReviews.length === 0) {

        container.innerHTML = `<p style="color:#888;">No reviews yet. Be the first to review.</p>`;

        return;

    }



    const visibleReviews = allReviews.slice(0, 4);

    const hiddenReviews = allReviews.slice(4);



    let html = visibleReviews.map(r => `

        <div class="review-item" style="background:#0b0b0b; padding:20px; border:1px solid rgba(212,175,55,0.2); border-radius:10px;">

            <div style="color:#d4af37;">${"★".repeat(r.stars)}</div>

            <strong>${r.name}</strong>

            <p style="color:#bbb; font-size:14px; margin-top:8px;">${r.text}</p>

        </div>

    `).join("");



    if (hiddenReviews.length > 0) {

        html += hiddenReviews.map(r => `

            <div class="review-item hidden-review" style="display:none; background:#0b0b0b; padding:20px; border:1px solid rgba(212,175,55,0.2); border-radius:10px;">

                <div style="color:#d4af37;">${"★".repeat(r.stars)}</div>

                <strong>${r.name}</strong>

                <p style="color:#bbb; font-size:14px; margin-top:8px;">${r.text}</p>

            </div>

        `).join("");

        html += `<button id="viewMoreBtn" class="btn ghost small" style="grid-column: 1/-1; margin-top: 10px;" onclick="toggleMoreReviews()">+ View more reviews</button>`;

    }



    container.innerHTML = html;

}



function toggleMoreReviews() {

    document.querySelectorAll(".hidden-review").forEach(r => r.style.display = "block");

    document.getElementById("viewMoreBtn")?.style.setProperty("display", "none");

}



function submitReview() {

    const name = document.getElementById("reviewerName").value.trim();

    const text = document.getElementById("reviewText").value.trim();

    if (!name || !text || selectedRating === 0) {

        alert("Please enter name, rating and review");

        return;

    }



    const params = new URLSearchParams(window.location.search);

    const productId = params.get("id");

    const reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];



    reviews.unshift({ name, stars: selectedRating, text });

    localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));



    document.getElementById("reviewerName").value = "";

    document.getElementById("reviewText").value = "";

    selectedRating = 0;

    updateStars();

    loadReviews(productId);

}



function updateStars() {

    document.querySelectorAll(".star-rating span").forEach(star => {

        star.classList.toggle("active", Number(star.dataset.star) <= selectedRating);

        star.style.color = Number(star.dataset.star) <= selectedRating ? "#d4af37" : "#444";

    });

}



// ==================================================

// 10. UTILITIES & CONTACT FORM

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

            if (e.isIntersecting) e.target.classList.add("reveal-active");

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



// ==================================================

// 11. IMAGE SLIDER LOGIC

// ==================================================



function initSliders() {

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

}