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
            return new Response(null, { headers: corsHeaders });
        }

        if (request.method !== "POST") {
            return new Response("Method not allowed", { status: 405, headers: corsHeaders });
        }

        try {
            const body = await request.json();
            const { customer, items, total, order_id } = body;

            if (!customer || !customer.email) {
                return new Response("Missing customer email", { status: 400, headers: corsHeaders });
            }

            // Generate HTML for Items
            const itemsHtml = items.map(item => `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                        <strong>${item.name}</strong><br>
                        <span style="font-size: 12px; color: #777;">Quantity: ${item.units || item.qty}</span>
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                        ₹${(item.price * (item.units || item.qty)).toLocaleString('en-IN')}
                    </td>
                </tr>
            `).join('');

            // Email Template
            const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f9f9f9; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                    .header { text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 20px; }
                    .header h1 { color: #d4af37; margin: 0; font-family: 'Times New Roman', serif; text-transform: uppercase; letter-spacing: 2px; }
                    .content { color: #333; line-height: 1.6; }
                    .order-details { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .total { text-align: right; font-size: 18px; font-weight: bold; color: #d4af37; margin-top: 10px; }
                    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #999; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://empireparfum.com/images/logo.png" alt="E'MPIRE Logo" style="max-width: 150px; display: block; margin: 0 auto 10px auto;">
                        <h1>E'MPIRE</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${customer.customer_name}</strong>,</p>
                        <p>Thank you for choosing E'MPIRE. We have received your order and are preparing it with the utmost care.</p>
                        <p><strong>Order ID:</strong> ${order_id}</p>
                        
                        <table class="order-details">
                            ${itemsHtml}
                        </table>
                        
                        <div class="total">
                            Total Paid: ₹${Number(total).toLocaleString('en-IN')}
                        </div>

                        <p style="margin-top: 20px;">You will receive another email with tracking details once your package is shipped.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 E'MPIRE Luxury Fragrances. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            `;

            // Call Resend API
            const resendRes = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    from: "E'MPIRE <order@empireparfum.com>",
                    to: [customer.email],
                    subject: `Order Confirmation - ${order_id}`,
                    html: emailHtml
                })
            });

            const resendData = await resendRes.json();

            if (!resendRes.ok) {

                return new Response(JSON.stringify({ error: "Email failed", details: resendData }), { status: 500, headers: corsHeaders });
            }

            return new Response(JSON.stringify({ success: true, id: resendData.id }), { status: 200, headers: corsHeaders });

        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
        }
    }
};
