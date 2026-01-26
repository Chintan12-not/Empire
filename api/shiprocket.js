export default async function handler(req, res) {
  // ✅ CORS HEADERS (IMPORTANT)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    // Login to Shiprocket
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

    // Create shipment
    const orderRes = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`
        },
        body: JSON.stringify({
          order_id: body.order_id,
          order_date: new Date().toISOString(),
          pickup_location: "Primary",
          billing_customer_name: body.name,
          billing_phone: body.phone.replace(/\D/g, "").slice(-10),
          billing_address: body.address.replace(/[,|-]/g, " "),
          billing_city: body.city.trim(),
          billing_state: body.state.trim(),
          billing_pincode: String(body.pincode).replace(/\D/g, "").slice(0, 6),
          billing_country: "India",
          payment_method: "Prepaid",
          order_items: body.items,
          sub_total: body.total,
          length: 10,
          breadth: 10,
          height: 5,
          weight: 0.5
        })
      }
    );

    const data = await orderRes.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Shipping error", details: err.message });
  }
}
