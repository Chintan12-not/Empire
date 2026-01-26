export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body;

    // 1. LOGIN
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
    if (!loginData.token) {
      return res.status(500).json({ error: "Shiprocket login failed", details: loginData });
    }

    // 2. CLEAN ITEMS
    const orderItems = body.items.map(i => ({
      name: i.name,
      sku: i.sku || i.name.replace(/\s/g, "").toUpperCase(),
      units: Number(i.units || i.qty),
      selling_price: Number(i.selling_price || i.price)
    }));

    const subTotal = orderItems.reduce((s, i) => s + i.units * i.selling_price, 0);
    const orderId = "EMP" + Date.now();

    // 3. CREATE ORDER (NON-ADHOC)
    const orderRes = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`
        },
        body: JSON.stringify({
          order_id: orderId,
          order_date: new Date().toISOString(),
          pickup_location: "Home",

          billing_customer_name: body.name,
          billing_email: body.email || "orders@empire.com",
          billing_phone: body.phone.replace(/\D/g, "").slice(-10),
          billing_address: body.address.replace(/[,|-]/g, " "),
          billing_city: body.city,
          billing_state: body.state,
          billing_pincode: body.pincode,
          billing_country: "India",

          shipping_is_billing: true,

          payment_method: "Prepaid",
          order_items: orderItems,
          sub_total: subTotal,

          length: 10,
          breadth: 10,
          height: 5,
          weight: 0.5
        })
      }
    );

    const data = await orderRes.json();

    if (!orderRes.ok) {
      return res.status(400).json({ error: "Shiprocket failed", details: data });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Shipping error", details: err.message });
  }
}
