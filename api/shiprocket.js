export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    // Login to Shiprocket
    const login = await fetch(
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

    const loginData = await login.json();

    // Create shipment
    const order = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginData.token}`
        },
        body: JSON.stringify({
          order_id: body.order_id,
          order_date: new Date().toISOString(),
          pickup_location: "Primary",
          billing_customer_name: body.name,
          billing_phone: body.phone,
          billing_address: body.address,
          billing_city: body.city,
          billing_state: body.state,
          billing_pincode: body.pincode,
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

    const result = await order.json();
    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ error: "Shiprocket failed", message: err.message });
  }
}
