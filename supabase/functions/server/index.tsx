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
  return c.json({ success: true, status: "ok" });
});

/**
 * Create a new order
 */
app.post("/make-server-c325e4cf/orders", async (c) => {
  try {
    const orderData = await c.req.json();
    
    // Generate a short numeric ID starting from 1000
    // We use a combination of timestamp suffix and a small random part for uniqueness
    const shortId = (1000 + (Math.floor(Date.now() / 1000) % 9000)).toString();
    const orderId = `order:${shortId}`;
    
    const fullOrder = {
      ...orderData,
      id: orderId,
      status: "Принят",
      createdAt: new Date().toISOString()
    };
    
    // Save to KV store
    await kv.set(orderId, fullOrder);

    // Handle notifications
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const adminChatId = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID');
    const tgId = orderData.customer?.tgId;

    if (botToken) {
      const orderSummary = orderData.items.map((i: any) => `- ${i.name} (${i.quantity} шт)`).join('\n');
      const displayId = `#${orderId.replace('order:', '')}`;
      
      const recipientInfo = orderData.customer.isRecipient 
        ? "Тот же, что и заказчик" 
        : `${orderData.customer.recipientName} (${orderData.customer.recipientPhone})`;

      // 1. Message for the CUSTOMER
      const customerText = `🌸 *Ваш заказ оформлен!* \n\n` +
                           `📦 *Заказ:* ${displayId}\n` +
                           `📅 *Дата:* ${orderData.customer.date.split('-').reverse().join('.')}\n` +
                           `⏰ *Время:* ${orderData.customer.time}\n` +
                           `💰 *Сумма:* ${orderData.total} ₽\n\n` +
                           `*Состав:*\n${orderSummary}\n\n` +
                           `✨ Мы пришлем уведомление, когда статус заказа изменится.`;

      // 2. Message for the ADMIN
      const deliveryDate = orderData.customer.date ? orderData.customer.date.split('-').reverse().join('.') : "не указана";
      const deliveryTime = orderData.customer.time || "не указано";

      const adminText = `🚀 *АДМИН: НОВЫЙ ЗАКАЗ*\n\n` +
                        `📦 *ID:* ${displayId}\n` +
                        `👤 *Заказчик:* ${orderData.customer.name}\n` +
                        `📞 *Тел:* ${orderData.customer.phone}\n` +
                        `📍 *Адрес:* ${orderData.customer.address}, д. ${orderData.customer.house}, кв. ${orderData.customer.flat}\n` +
                        `📅 *Дата доставки:* ${deliveryDate}\n` +
                        `⏰ *Время доставки:* ${deliveryTime}\n` +
                        `🎁 *Получатель:* ${recipientInfo}\n` +
                        `💬 *Коммент:* ${orderData.customer.comment || "—"}\n` +
                        `💰 *Сумма:* ${orderData.total} ₽\n\n` +
                        `*Букеты:*\n${orderSummary}`;

      // Send to Customer
      if (tgId) {
        const historyKey = `history:${tgId}`;
        const history = await kv.get(historyKey) || [];
        await kv.set(historyKey, [...history, orderId]);

        try {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: tgId, text: customerText, parse_mode: 'Markdown' })
          });
        } catch (e) { console.error("Error sending to customer:", e); }
      }

      // Send to Admin
      if (adminChatId) {
        try {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: adminChatId, text: adminText, parse_mode: 'Markdown' })
          });
        } catch (e) { console.error("Error sending to admin:", e); }
      }
    }

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

    const cacheKey = `photo:${tgId}`;
    const cachedUrl = await kv.get(cacheKey);
    if (cachedUrl) return c.json({ success: true, photoUrl: cachedUrl });

    const photosRes = await fetch(`https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${tgId}&limit=1`);
    const photosData = await photosRes.json();

    if (photosData.ok && photosData.result.total_count > 0) {
      const fileId = photosData.result.photos[0][0].file_id;
      const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
      const fileData = await fileRes.json();

      if (fileData.ok) {
        const filePath = fileData.result.file_path;
        const photoUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
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

/**
 * Admin: Get all orders
 */
app.get("/make-server-c325e4cf/admin/orders", async (c) => {
  try {
    const adminId = c.req.query('adminId');
    if (!adminId) return c.json({ success: false, error: "Unauthorized" }, 401);
    const allData = await kv.getByPrefix("order:");
    return c.json({ success: true, orders: allData.reverse() });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch orders" }, 500);
  }
});

/**
 * Admin: Update order status
 */
app.post("/make-server-c325e4cf/admin/orders/:id/status", async (c) => {
  try {
    const id = c.req.param('id');
    const { status, adminId } = await c.req.json();
    if (!adminId) return c.json({ success: false, error: "Unauthorized" }, 401);

    const order = await kv.get(id);
    if (!order) return c.json({ success: false, error: "Order not found" }, 404);

    const oldStatus = order.status;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    await kv.set(id, order);

    const tgId = order.customer?.tgId;
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    
    if (tgId && botToken && oldStatus !== status) {
      const text = `🌸 *Обновление статуса заказа!*\n\n` +
                   `Заказ *${id.split('-')[0].replace('order:', '')}*\n` +
                   `Новый статус: *${status}*\n\n` +
                   `Спасибо, что выбрали нас!`;
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: tgId, text, parse_mode: 'Markdown' })
        });
      } catch (tgError) {}
    }
    return c.json({ success: true, order });
  } catch (error) {
    return c.json({ success: false, error: "Failed to update status" }, 500);
  }
});

/**
 * Admin: Get all users
 */
app.get("/make-server-c325e4cf/admin/users", async (c) => {
  try {
    const adminId = c.req.query('adminId');
    if (!adminId) return c.json({ success: false, error: "Unauthorized" }, 401);

    const allOrders = await kv.getByPrefix("order:");
    const usersMap = new Map();

    for (const order of allOrders) {
      const tgId = order.customer?.tgId;
      if (tgId && !usersMap.has(tgId)) {
        usersMap.set(tgId, {
          tgId,
          name: order.customer.name,
          phone: order.customer.phone
        });
      }
    }

    return c.json({ success: true, users: Array.from(usersMap.values()) });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch users" }, 500);
  }
});

// Default 404 handler to ensure JSON response
app.notFound((c) => {
  return c.json({ success: false, error: "Route not found" }, 404);
});

Deno.serve(app.fetch);
