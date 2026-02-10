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
    
    // Save to KV store
    await kv.set(orderId, {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString()
    });

    console.log(`Order created: ${orderId}`);
    return c.json({ success: true, orderId });
  } catch (error) {
    console.error(`Error creating order: ${error}`);
    return c.json({ success: false, error: "Failed to create order" }, 500);
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
