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
                     `📞 *Тел:* ${orderData.customer.phone}\n` +
                     `📍 *Адрес:* ${orderData.customer.city}, ${orderData.customer.address}\n` +
                     `⏰ *Доставка:* ${orderData.customer.deliveryDate} в ${orderData.customer.deliveryTime}\n` +
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
 * Submit a review
 */
app.post("/make-server-c325e4cf/reviews", async (c) => {
  try {
    const { productId, rating, text, userName } = await c.req.json();
    if (!productId || !rating) return c.json({ success: false, error: "Invalid data" }, 400);

    const reviewId = `review:${productId}:${Date.now()}`;
    const review = {
      productId,
      rating,
      text,
      userName: userName || "Аноним",
      createdAt: new Date().toISOString()
    };

    await kv.set(reviewId, review);
    return c.json({ success: true, review });
  } catch (error) {
    console.error(`Error submitting review: ${error}`);
    return c.json({ success: false, error: "Failed to submit review" }, 500);
  }
});

/**
 * Get reviews for a product
 */
app.get("/make-server-c325e4cf/reviews/:productId", async (c) => {
  try {
    const productId = c.req.param('productId');
    const reviews = await kv.getByPrefix(`review:${productId}:`);
    return c.json({ success: true, reviews: reviews.reverse() });
  } catch (error) {
    console.error(`Error fetching reviews: ${error}`);
    return c.json({ success: false, error: "Failed to fetch reviews" }, 500);
  }
});

/**
 * Get ratings summary for all products
 */
app.get("/make-server-c325e4cf/ratings", async (c) => {
  try {
    const allReviews = await kv.getByPrefix("review:");
    const summary: Record<string, { average: number, count: number }> = {};

    allReviews.forEach((review: any) => {
      const pid = review.productId;
      if (!summary[pid]) {
        summary[pid] = { totalRating: 0, count: 0, average: 0 };
      }
      (summary[pid] as any).totalRating += review.rating;
      summary[pid].count += 1;
    });

    Object.keys(summary).forEach(pid => {
      summary[pid].average = Number(((summary[pid] as any).totalRating / summary[pid].count).toFixed(1));
      delete (summary[pid] as any).totalRating;
    });

    return c.json({ success: true, summary });
  } catch (error) {
    console.error(`Error fetching ratings: ${error}`);
    return c.json({ success: false, error: "Failed to fetch ratings" }, 500);
  }
});

/**
 * Get user photo via Telegram Bot API
 */
app.get("/make-server-c325e4cf/user-photo", async (c) => {
  try {
    const tgId = c.req.query('tgId');
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    
    if (!tgId || !botToken) return c.json({ success: false, error: "Missing tgId or token" }, 400);

    // Try to get from cache first
    const cacheKey = `photo:${tgId}`;
    const cachedUrl = await kv.get(cacheKey);
    if (cachedUrl) return c.json({ success: true, photoUrl: cachedUrl });

    // Fetch from Telegram
    const photosRes = await fetch(`https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${tgId}&limit=1`);
    const photosData = await photosRes.json();

    if (photosData.ok && photosData.result.total_count > 0) {
      const fileId = photosData.result.photos[0][0].file_id;
      const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
      const fileData = await fileRes.json();

      if (fileData.ok) {
        const filePath = fileData.result.file_path;
        const photoUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        
        // Cache for 24 hours (approx, kv.set doesn't have TTL usually in our util, but good to store)
        await kv.set(cacheKey, photoUrl);
        return c.json({ success: true, photoUrl });
      }
    }
    
    return c.json({ success: false, error: "No photo found" });
  } catch (error) {
    console.error(`Error fetching user photo: ${error}`);
    return c.json({ success: false, error: "Failed to fetch photo" }, 500);
  }
});

Deno.serve(app.fetch);
