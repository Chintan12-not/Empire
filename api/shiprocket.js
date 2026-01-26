export default async function handler(req, res) {
  // ===============================
  // CORS (for local testing)
  // ===============================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    // ===============================
    // 1. LOGIN TO SHIPROCKET
    // ===============================
    const loginRes = await fetch(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: process.env.SHIPROCKET_EMAIL,
          password: process.env.SHIPROCKET_PASSWORD
        })
      }
    );

    const loginData = await loginRes.json();

    if (!loginData?.token) {
      return res.status(500).json({
        error: "Shiprocket login failed",
        details: loginData
      });
    }

    // ===============================
    // 2. CLEAN ORDER ITEMS (CRITICAL)
    // ===============================
    const orderItems = body.items.map(i => ({
      name: i.name,
      sku: i.sku || i.name.replace(/\s/g, "").toUpperCase(),
      units: Number(i.units || i.qty),
      selling_price: Number(i.selling_price || i.price)
    }));

    // ===============================
    // 3. CALCULATE TOTAL (MANDATORY)
    // ===============================
    const calculatedTotal = orderItems.reduce(
      (sum, i) => sum + (i.units * i.selling_price),
      0
    );

    // ===============================
    // 4. SAFE UNIQUE ORDER ID
    // ===============================
    const safeOrderId = "EMP" + Date.now();

    // ===============================
    // 5. CREATE SHIPMENT
    // ===============================
    const orderRes = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`
        },
        body: JSON.stringify({
          order_id: safeOrderId,
          order_date: new Date().toISOString(),

          // ⚠️ MUST MATCH PICKUP LOCATION NAME IN DASHBOARD
          pickup_location: "Home",

          billing_customer_name: body.name.trim(),
          billing_phone: body.phone.replace(/\D/g, "").slice(-10),
          billing_address: body.address.replace(/[,|-]/g, " "),
          billing_city: body.city.trim(),
          billing_state: body.state.trim(),
          billing_pincode: String(body.pincode).replace(/\D/g, "").slice(0, 6),
          billing_country: "India",

          payment_method: "Prepaid",
          order_items: orderItems,
          sub_total: calculatedTotal,

          length: 10,
          breadth: 10,
          height: 5,
          weight: 0.5
        })
      }
    );

    const orderData = await orderRes.json();

    // ===============================
    // 6. HANDLE SHIPROCKET ERRORS
    // ===============================
    if (!orderRes.ok) {
      return res.status(400).json({
        error: "Shiprocket failed",
        details: orderData
      });
    }

    // ===============================
    // 7. SUCCESS
    // ===============================
    return res.status(200).json(orderData);

  } catch (err) {
    console.error("Shiprocket ERROR:", err);
    return res.status(500).json({
      error: "Shipping error",
      details: err.message
    });
  }
}
