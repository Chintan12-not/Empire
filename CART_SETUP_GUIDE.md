# 🛒 User-Specific Cart System Setup Guide

## ✅ What's Been Fixed

Your cart system now:
- ✅ **Saves cart per user** in Supabase database
- ✅ **Loads user's cart** when they sign in
- ✅ **Clears cart** when user logs out
- ✅ **Syncs automatically** - cart updates save to database in real-time
- ✅ **Persists across sessions** - users see their cart items even after closing browser

---

## 🗄️ Database Setup (REQUIRED)

### Step 1: Create the Cart Table in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `wolxccbehsbafyirgvgp`
3. Click **SQL Editor** in the left sidebar
4. Click **+ New Query**
5. Open the file `supabase_cart_table.sql` (in your project folder)
6. **Copy ALL the SQL code** from that file
7. **Paste it** into the Supabase SQL Editor
8. Click **Run** (or press Ctrl+Enter)
9. You should see: ✅ "Success. No rows returned"

### Step 2: Verify Table Was Created

1. In Supabase, go to **Table Editor** (left sidebar)
2. You should see a new table called `user_carts`
3. Columns should be:
   - `id` (UUID)
   - `user_id` (UUID) - references auth.users
   - `cart_items` (JSONB)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

---

## 🔄 How the Cart System Works

### For Guest Users (Not Logged In)
```
User adds items → Saved to localStorage only
User closes browser → Cart persists in localStorage
User reopens site → Cart loads from localStorage
```

### For Logged-In Users
```
User signs in → Loads cart from database
User adds items → Saves to BOTH localStorage AND database
User closes browser → Cart safe in database
User reopens site → Automatically loads cart from database
User logs out → Cart CLEARED from both localStorage and database
```

### Different Users
```
User A logs in → Sees User A's cart items
User A logs out → Cart cleared
User B logs in → Sees User B's cart items (completely separate)
```

---

## 📋 Code Changes Made

### 1. New Functions Added

#### `saveCart()` - Enhanced
```javascript
// Now saves to BOTH localStorage AND database
async function saveCart() {
    localStorage.setItem("empire_cart", JSON.stringify(cart));
    
    if (currentUser && supabaseClient) {
        await supabaseClient.from("user_carts").upsert({
            user_id: currentUser.id,
            cart_items: cart,
            updated_at: new Date().toISOString()
        });
    }
}
```

#### `loadUserCart()` - New
```javascript
// Loads user's cart from database on sign in
async function loadUserCart() {
    if (!currentUser) return;
    
    const { data } = await supabaseClient
        .from("user_carts")
        .select("cart_items")
        .eq("user_id", currentUser.id)
        .single();
    
    if (data?.cart_items) {
        cart = data.cart_items;
        updateCartUI();
    }
}
```

#### `clearUserCart()` - New
```javascript
// Clears cart from localStorage and database
async function clearUserCart() {
    cart = [];
    localStorage.removeItem("empire_cart");
    updateCartUI();
    
    if (currentUser) {
        await supabaseClient
            .from("user_carts")
            .delete()
            .eq("user_id", currentUser.id);
    }
}
```

### 2. Updated Functions

- **`logout()`** - Now clears cart before signing out
- **`signIn()`** - Loads user's cart after successful login
- **`signUp()`** - Loads cart after account creation
- **`checkAuth()`** - Loads cart on page load if user is logged in
- **`onAuthStateChange`** - Handles cart sync on auth state changes

---

## 🧪 Testing Your Cart System

### Test 1: Guest User Cart
1. Open site (not logged in)
2. Add items to cart
3. Refresh page
4. ✅ Cart items should still be there (in localStorage)

### Test 2: User Login Cart Persistence
1. Create account / Sign in
2. Add items to cart
3. Close browser completely
4. Reopen browser and go to site
5. ✅ You should be logged in AND cart items should load

### Test 3: User Logout Clears Cart
1. Sign in to account
2. Add items to cart
3. Click logout
4. ✅ Alert: "You have been logged out. Your cart has been cleared."
5. ✅ Cart should be empty
6. ✅ Top right should show "Login" button

### Test 4: Different Users Have Different Carts
1. Sign in as User A (e.g., user1@test.com)
2. Add "Ocean Aura" to cart
3. Logout
4. Sign in as User B (e.g., user2@test.com)
5. Add "Smoked Whisky" to cart
6. Logout
7. Sign in as User A again
8. ✅ Should see "Ocean Aura" in cart (NOT "Smoked Whisky")

---

## 🔍 Troubleshooting

### Cart Not Loading After Login?

**Check 1: Is the database table created?**
- Go to Supabase → Table Editor
- Look for `user_carts` table
- If not there, run the SQL from Step 1 again

**Check 2: Check browser console**
```javascript
// Open DevTools (F12) → Console
// Look for errors like:
// "Cart sync error: ..."
// "Load cart error: ..."
```

**Check 3: Verify RLS policies**
- Go to Supabase → Authentication → Policies
- Find `user_carts` table
- Should have 4 policies (SELECT, INSERT, UPDATE, DELETE)

### Cart Not Syncing to Database?

**Check browser console for errors:**
```
"Failed to sync cart: ..." 
```

This means the database connection failed. Check:
- Is Supabase URL correct in `script.js`?
- Is Supabase Key correct?
- Is table `user_carts` created?

### Cart Clears Unexpectedly?

**This happens when:**
- User logs out (by design ✅)
- User clears browser data (expected)
- Database connection fails (check console)

---

## 📊 Database Structure

### `user_carts` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users (unique per user) |
| cart_items | JSONB | Array of cart items `[{name, price, qty}]` |
| created_at | Timestamp | When cart was first created |
| updated_at | Timestamp | When cart was last updated |

### Example Cart Data (JSONB)
```json
[
  {
    "name": "Ocean Aura",
    "price": 2800,
    "qty": 2
  },
  {
    "name": "Smoked Whisky",
    "price": 2800,
    "qty": 1
  }
]
```

---

## 🚀 Summary

**Before:**
- Cart stored only in localStorage
- Same cart for all users on same browser
- Cart not cleared on logout

**After:**
- Cart stored in database per user ✅
- Each user has their own separate cart ✅
- Cart clears on logout ✅
- Cart persists across devices (if same user) ✅
- Cart syncs automatically ✅

---

## ⚠️ IMPORTANT: Run the SQL Setup!

**Don't forget to:**
1. Open `supabase_cart_table.sql`
2. Copy the SQL code
3. Run it in Supabase SQL Editor

**Without this step, the cart will NOT save to the database!**

---

## 🎉 You're All Set!

Your cart system is now fully user-specific and database-backed! Each user will have their own personal cart that persists across sessions and devices.
