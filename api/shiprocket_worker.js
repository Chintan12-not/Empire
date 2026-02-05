export default {
    async fetch(request, env, ctx) {
        // CORS Headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        // Handle Preflight Request
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: corsHeaders,
            });
        }

        if (request.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        }

        try {
            const body = await request.json();

            // 1. LOGIN
            const loginRes = await fetch(
                "https://apiv2.shiprocket.in/v1/external/auth/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: (env.SHIPROCKET_EMAIL || "").trim(),
                        password: (env.SHIPROCKET_PASSWORD || "").trim(),
                    }),
                }
            );

            const loginData = await loginRes.json();
            if (!loginData.token) {
                return new Response(
                    JSON.stringify({ error: "Shiprocket login failed", details: loginData }),
                    {
                        status: 500,
                        headers: {
                            "Content-Type": "application/json",
                            ...corsHeaders,
                        },
                    }
                );
            }

            // 2. CLEAN ITEMS
            const orderItems = body.items.map((i) => ({
                name: i.name,
                sku: i.sku || i.name.replace(/\s/g, "").toUpperCase(),
                units: Number(i.units || i.qty),
                selling_price: Number(i.selling_price || i.price),
            }));

            const subTotal = orderItems.reduce(
                (s, i) => s + i.units * i.selling_price,
                0
            );
            const orderId = "EMP" + Date.now();

            // 3. CREATE ORDER (ADHOC / QUICK ORDER)
            const orderRes = await fetch(
                "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${loginData.token}`,
                    },
                    body: JSON.stringify({
                        order_id: orderId,
                        order_date: new Date().toISOString(),

                        // ✅ REQUIRED: Get from Env or Use Default
                        channel_id: env.SHIPROCKET_CHANNEL_ID || 9572048,

                        pickup_location: "Home",

                        billing_customer_name: body.name.split(" ")[0],
                        billing_last_name: body.name.split(" ").slice(1).join(" ") || "Customer",
                        billing_email: body.email || "orders@empire.com",
                        billing_phone: body.phone.replace(/\D/g, "").slice(-10),
                        billing_address: body.address.replace(/[,|-]/g, " "),
                        billing_city: body.city,
                        billing_state: body.state,
                        billing_pincode: body.pincode,
                        billing_country: "India",

                        shipping_is_billing: true,

                        payment_method: body.payment_method === "COD" ? "COD" : "Prepaid",

                        order_items: orderItems,
                        sub_total: subTotal,

                        shipping_charges: Number(body.shipping_charges || 0),
                        giftwrap_charges: 0,
                        transaction_charges: 0,
                        total_discount: 0,

                        length: 10,
                        breadth: 10,
                        height: 5,
                        weight: 0.5,
                    }),
                }
            );

            const data = await orderRes.json();

            if (!orderRes.ok) {
                return new Response(
                    JSON.stringify({ error: "Shiprocket failed", details: data }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type": "application/json",
                            ...corsHeaders,
                        },
                    }
                );
            }

            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        } catch (err) {
            return new Response(
                JSON.stringify({ error: "Shipping error", details: err.message }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                }
            );
        }
    },
};
