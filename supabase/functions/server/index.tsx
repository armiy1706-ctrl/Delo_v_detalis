import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c325e4cf/health", (c) => {
  return c.json({ status: "ok" });
});

/**
 * Create a new order
 */
app.post("/make-server-c325e4cf/orders", async (c) => {
  try {
    const orderData = await c.req.json();
    const orderId = `order:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullOrder = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString()
    };
    
    // Save to KV store
    await kv.set(orderId, fullOrder);

    // Save to user history if tgId is present
    const tgId = orderData.customer?.tgId;
    if (tgId) {
      const historyKey = `history:${tgId}`;
      const history = await kv.get(historyKey) || [];
      await kv.set(historyKey, [...history, orderId]);

      // Send Telegram notification
      const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
      if (botToken) {
        const text = `🌸 *Новый заказ!* \n\n` +
                     `📦 *ID:* ${orderId}\n` +
                     `👤 *Клиент:* ${orderData.customer.name}\n` +
                     `💰 *Сумма:* ${orderData.total} ₽\n\n` +
                     `Букеты:\n${orderData.items.map((i: any) => `- ${i.name} (${i.quantity} шт)`).join('\n')}`;
        
        try {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: tgId,
              text,
              parse_mode: 'Markdown'
            })
          });
        } catch (tgError) {
          console.error(`Telegram notification failed: ${tgError}`);
        }
      }
    }

    console.log(`Order created: ${orderId}`);
    return c.json({ success: true, orderId });
  } catch (error) {
    console.error(`Error creating order: ${error}`);
    return c.json({ success: false, error: "Failed to create order" }, 500);
  }
});

/**
 * Get user history
 */
app.get("/make-server-c325e4cf/history", async (c) => {
  try {
    const tgId = c.req.query('tgId');
    if (!tgId) return c.json({ success: false, error: "Missing tgId" }, 400);

    const historyKey = `history:${tgId}`;
    const orderIds = await kv.get(historyKey) || [];
    
    // Fetch all orders in history
    const orders = [];
    for (const id of orderIds) {
      const order = await kv.get(id);
      if (order) orders.push(order);
    }

    return c.json({ success: true, orders: orders.reverse() });
  } catch (error) {
    console.error(`Error fetching history: ${error}`);
    return c.json({ success: false, error: "Failed to fetch history" }, 500);
  }
});

/**
 * Get all orders (using prefix)
 */
app.get("/make-server-c325e4cf/orders", async (c) => {
  try {
    const orders = await kv.getByPrefix("order:");
    return c.json({ success: true, orders });
  } catch (error) {
    console.error(`Error fetching orders: ${error}`);
    return c.json({ success: false, error: "Failed to fetch orders" }, 500);
  }
});

Deno.serve(app.fetch);
