import { createClient, Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import { Product } from '@/types';

// ────────────────────────────────────────────────────────────────────
// Client factory — works for BOTH local dev (SQLite file) and Turso
// Local dev  : set nothing, defaults to file:data/maison.db
// Production : set TURSO_URL + TURSO_TOKEN in your Vercel env vars
// ────────────────────────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var _libsqlClient: Client | undefined;
}

function getClient(): Client {
  if (global._libsqlClient) return global._libsqlClient;

  const tursoUrl = process.env.TURSO_URL;
  const tursoToken = process.env.TURSO_TOKEN;

  let client: Client;

  if (tursoUrl && tursoUrl.startsWith('libsql://')) {
    // ── Turso cloud (production on Vercel) ──────────────────────────
    client = createClient({ url: tursoUrl, authToken: tursoToken });
  } else {
    // ── Local SQLite file (development) ─────────────────────────────
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const dbPath = `file:${path.join(dataDir, 'maison.db')}`;
    client = createClient({ url: dbPath });
  }

  global._libsqlClient = client;
  return client;
}

export const db = getClient();

// ────────────────────────────────────────────────────────────────────
// Schema initialisation (run once on startup)
// ────────────────────────────────────────────────────────────────────

let schemaInitialised = false;

export async function ensureSchema() {
  if (schemaInitialised) return;

  await db.batch([
    `CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      price REAL NOT NULL,
      original_price REAL,
      currency TEXT DEFAULT 'USD',
      description TEXT NOT NULL,
      details TEXT NOT NULL,
      care TEXT NOT NULL,
      images TEXT NOT NULL,
      variants TEXT NOT NULL,
      in_stock INTEGER DEFAULT 1,
      is_new INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      material TEXT,
      fit TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      shipping_method TEXT NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      shipping_cost REAL NOT NULL,
      tax REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
  ], 'deferred');

  // Seed products if table is empty
  const { rows } = await db.execute('SELECT COUNT(*) as count FROM products');
  const count = Number((rows[0] as any).count);
  if (count === 0) {
    await seedProducts();
  }

  schemaInitialised = true;
}

// ────────────────────────────────────────────────────────────────────
// Row → Product mapper
// ────────────────────────────────────────────────────────────────────

function mapRow(row: any): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    category: row.category as string,
    subcategory: (row.subcategory as string) || '',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    currency: (row.currency as string) || 'USD',
    description: row.description as string,
    details: row.details ? JSON.parse(row.details as string) : [],
    care: row.care ? JSON.parse(row.care as string) : [],
    images: row.images ? JSON.parse(row.images as string) : [],
    variants: row.variants ? JSON.parse(row.variants as string) : [],
    inStock: Boolean(row.in_stock),
    isNew: Boolean(row.is_new),
    isFeatured: Boolean(row.is_featured),
    material: (row.material as string) || undefined,
    fit: (row.fit as string) || undefined,
  };
}

// ────────────────────────────────────────────────────────────────────
// Products
// ────────────────────────────────────────────────────────────────────

export async function getDbProducts(filters?: {
  category?: string;
  search?: string;
  featured?: boolean;
  isNew?: boolean;
}): Promise<Product[]> {
  await ensureSchema();

  let query = 'SELECT * FROM products WHERE 1=1';
  const args: any[] = [];

  if (filters?.category) {
    query += ' AND LOWER(category) = LOWER(?)';
    args.push(filters.category);
  }
  if (filters?.featured) {
    query += ' AND is_featured = 1';
  }
  if (filters?.isNew) {
    query += ' AND is_new = 1';
  }
  if (filters?.search) {
    query += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)';
    const term = `%${filters.search.toLowerCase()}%`;
    args.push(term, term, term);
  }

  query += ' ORDER BY created_at DESC';

  const { rows } = await db.execute({ sql: query, args });
  return rows.map(mapRow);
}

export async function getDbProductBySlug(slug: string): Promise<Product | null> {
  await ensureSchema();
  const { rows } = await db.execute({ sql: 'SELECT * FROM products WHERE slug = ?', args: [slug] });
  return rows.length > 0 ? mapRow(rows[0]) : null;
}

export async function createDbProduct(data: Partial<Product>): Promise<Product> {
  await ensureSchema();
  const id = data.id || `prod-${Date.now().toString().slice(-8)}`;
  const slug =
    data.slug ||
    (data.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  await db.execute({
    sql: `INSERT INTO products (
      id, name, slug, category, subcategory, price, original_price,
      currency, description, details, care, images, variants,
      in_stock, is_new, is_featured, material, fit
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [
      id, data.name || 'Untitled Piece', slug,
      data.category || 'Coats & Outerwear', data.subcategory || '',
      data.price || 0, data.originalPrice ?? null,
      data.currency || 'USD', data.description || '',
      JSON.stringify(data.details || []),
      JSON.stringify(data.care || []),
      JSON.stringify(data.images || []),
      JSON.stringify(data.variants || []),
      data.inStock !== false ? 1 : 0,
      data.isNew ? 1 : 0,
      data.isFeatured ? 1 : 0,
      data.material || '', data.fit || '',
    ],
  });

  return (await getDbProductBySlug(slug))!;
}

export async function updateDbProduct(slug: string, updates: Partial<Product>): Promise<Product | null> {
  await ensureSchema();
  const existing = await getDbProductBySlug(slug);
  if (!existing) return null;
  const m = { ...existing, ...updates };

  await db.execute({
    sql: `UPDATE products SET
      name=?, category=?, subcategory=?, price=?, original_price=?,
      description=?, details=?, care=?, images=?, variants=?,
      in_stock=?, is_new=?, is_featured=?, material=?, fit=?
    WHERE slug=?`,
    args: [
      m.name, m.category, m.subcategory || '',
      m.price, m.originalPrice ?? null,
      m.description,
      JSON.stringify(m.details || []),
      JSON.stringify(m.care || []),
      JSON.stringify(m.images || []),
      JSON.stringify(m.variants || []),
      m.inStock ? 1 : 0, m.isNew ? 1 : 0, m.isFeatured ? 1 : 0,
      m.material || '', m.fit || '', slug,
    ],
  });
  return getDbProductBySlug(slug);
}

export async function deleteDbProduct(slug: string): Promise<boolean> {
  await ensureSchema();
  const { rowsAffected } = await db.execute({ sql: 'DELETE FROM products WHERE slug=?', args: [slug] });
  return rowsAffected > 0;
}

// ────────────────────────────────────────────────────────────────────
// Orders
// ────────────────────────────────────────────────────────────────────

export interface DbOrder {
  id: string;
  customer_email: string;
  customer_name: string;
  shipping_address: any;
  shipping_method: string;
  items: any[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
}

function mapOrderRow(row: any): DbOrder {
  return {
    ...row,
    subtotal: Number(row.subtotal),
    shipping_cost: Number(row.shipping_cost),
    tax: Number(row.tax),
    total: Number(row.total),
    shipping_address: typeof row.shipping_address === 'string'
      ? JSON.parse(row.shipping_address) : row.shipping_address,
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
  };
}

export async function createDbOrder(order: {
  customer_email: string;
  customer_name: string;
  shipping_address: any;
  shipping_method: string;
  items: any[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
}): Promise<DbOrder> {
  await ensureSchema();
  const orderId = `MN-${Math.floor(100000 + Math.random() * 900000)}`;

  await db.execute({
    sql: `INSERT INTO orders (
      id, customer_email, customer_name, shipping_address, shipping_method,
      items, subtotal, shipping_cost, tax, total, status
    ) VALUES (?,?,?,?,?,?,?,?,?,?,'confirmed')`,
    args: [
      orderId, order.customer_email, order.customer_name,
      JSON.stringify(order.shipping_address), order.shipping_method,
      JSON.stringify(order.items),
      order.subtotal, order.shipping_cost, order.tax, order.total,
    ],
  });

  return (await getDbOrderById(orderId))!;
}

export async function getDbOrders(): Promise<DbOrder[]> {
  await ensureSchema();
  const { rows } = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
  return rows.map(mapOrderRow);
}

export async function getDbOrderById(id: string): Promise<DbOrder | null> {
  await ensureSchema();
  const { rows } = await db.execute({ sql: 'SELECT * FROM orders WHERE id=?', args: [id] });
  return rows.length > 0 ? mapOrderRow(rows[0]) : null;
}

export async function updateDbOrderStatus(id: string, status: string): Promise<boolean> {
  await ensureSchema();
  const { rowsAffected } = await db.execute({ sql: 'UPDATE orders SET status=? WHERE id=?', args: [status, id] });
  return rowsAffected > 0;
}

// ────────────────────────────────────────────────────────────────────
// Newsletter
// ────────────────────────────────────────────────────────────────────

export async function addDbNewsletterSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  await ensureSchema();
  try {
    await db.execute({
      sql: 'INSERT INTO newsletter_subscribers (email) VALUES (?)',
      args: [email.toLowerCase().trim()],
    });
    return { success: true, message: 'Subscribed successfully to private salon updates.' };
  } catch (err: any) {
    if (err.message?.includes('UNIQUE') || err.message?.includes('SQLITE_CONSTRAINT')) {
      return { success: true, message: 'You are already registered for our private releases.' };
    }
    return { success: false, message: 'Could not subscribe at this time.' };
  }
}

export async function getDbNewsletterSubscribers(): Promise<{ id: number; email: string; created_at: string }[]> {
  await ensureSchema();
  const { rows } = await db.execute('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC');
  return rows as any;
}

// ────────────────────────────────────────────────────────────────────
// Analytics
// ────────────────────────────────────────────────────────────────────

export async function getDbStats() {
  await ensureSchema();
  const [r1, r2, r3] = await Promise.all([
    db.execute('SELECT COUNT(*) as count, COALESCE(SUM(total),0) as revenue FROM orders'),
    db.execute('SELECT COUNT(*) as count FROM products WHERE in_stock=1'),
    db.execute('SELECT COUNT(*) as count FROM newsletter_subscribers'),
  ]);
  const recentOrders = await getDbOrders();

  return {
    totalRevenue: Number((r1.rows[0] as any).revenue),
    totalOrders: Number((r1.rows[0] as any).count),
    activeProducts: Number((r2.rows[0] as any).count),
    totalSubscribers: Number((r3.rows[0] as any).count),
    recentOrders: recentOrders.slice(0, 5),
  };
}

// ────────────────────────────────────────────────────────────────────
// Seed data (16 luxury products)
// ────────────────────────────────────────────────────────────────────

async function seedProducts() {
  const { initialProducts } = await import('@/data/initialProducts');
  for (const p of initialProducts) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO products (
        id, name, slug, category, subcategory, price, original_price,
        currency, description, details, care, images, variants,
        in_stock, is_new, is_featured, material, fit
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        p.id, p.name, p.slug, p.category, p.subcategory || '',
        p.price, p.originalPrice ?? null, p.currency || 'USD', p.description,
        JSON.stringify(p.details || []),
        JSON.stringify(p.care || []),
        JSON.stringify(p.images || []),
        JSON.stringify(p.variants || []),
        p.inStock ? 1 : 0, p.isNew ? 1 : 0, p.isFeatured ? 1 : 0,
        p.material || '', p.fit || '',
      ],
    });
  }
}
