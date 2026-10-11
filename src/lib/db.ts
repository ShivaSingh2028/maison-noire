import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { initialProducts } from '@/data/initialProducts';
import { Product } from '@/types';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'maison.db');

declare global {
  // eslint-disable-next-line no-var
  var _sqliteDb: Database.Database | undefined;
}

function getDatabase(): Database.Database {
  if (!global._sqliteDb) {
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initSchema(db);
    global._sqliteDb = db;
  }
  return global._sqliteDb;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
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
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
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
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const countStmt = db.prepare('SELECT COUNT(*) as count FROM products');
  const { count } = countStmt.get() as { count: number };

  if (count === 0 && initialProducts && initialProducts.length > 0) {
    const insertStmt = db.prepare(`
      INSERT INTO products (
        id, name, slug, category, subcategory, price, original_price,
        currency, description, details, care, images, variants,
        in_stock, is_new, is_featured, material, fit
      ) VALUES (
        @id, @name, @slug, @category, @subcategory, @price, @original_price,
        @currency, @description, @details, @care, @images, @variants,
        @in_stock, @is_new, @is_featured, @material, @fit
      )
    `);

    const insertMany = db.transaction((prods: Product[]) => {
      for (const p of prods) {
        insertStmt.run({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          subcategory: p.subcategory || '',
          price: p.price,
          original_price: p.originalPrice || null,
          currency: p.currency || 'USD',
          description: p.description,
          details: JSON.stringify(p.details || []),
          care: JSON.stringify(p.care || []),
          images: JSON.stringify(p.images || []),
          variants: JSON.stringify(p.variants || []),
          in_stock: p.inStock ? 1 : 0,
          is_new: p.isNew ? 1 : 0,
          is_featured: p.isFeatured ? 1 : 0,
          material: p.material || '',
          fit: p.fit || '',
        });
      }
    });

    insertMany(initialProducts);
  }
}

export const db = getDatabase();

function mapDbRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    subcategory: row.subcategory || '',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    currency: row.currency || 'USD',
    description: row.description,
    details: row.details ? JSON.parse(row.details) : [],
    care: row.care ? JSON.parse(row.care) : [],
    images: row.images ? JSON.parse(row.images) : [],
    variants: row.variants ? JSON.parse(row.variants) : [],
    inStock: Boolean(row.in_stock),
    isNew: Boolean(row.is_new),
    isFeatured: Boolean(row.is_featured),
    material: row.material || undefined,
    fit: row.fit || undefined,
  };
}

// ---------------- Product Database Operations ---------------- //

export function getDbProducts(filters?: {
  category?: string;
  search?: string;
  featured?: boolean;
  isNew?: boolean;
}): Product[] {
  let query = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];

  if (filters?.category) {
    query += ' AND LOWER(category) = LOWER(?)';
    params.push(filters.category);
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
    params.push(term, term, term);
  }

  query += ' ORDER BY created_at DESC';
  const rows = db.prepare(query).all(...params);
  return rows.map(mapDbRowToProduct);
}

export function getDbProductBySlug(slug: string): Product | null {
  const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug);
  return row ? mapDbRowToProduct(row) : null;
}

export function createDbProduct(data: Partial<Product>): Product {
  const id = data.id || `prod-${Date.now().toString().slice(-6)}`;
  const slug =
    data.slug ||
    (data.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const stmt = db.prepare(`
    INSERT INTO products (
      id, name, slug, category, subcategory, price, original_price,
      currency, description, details, care, images, variants,
      in_stock, is_new, is_featured, material, fit
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    data.name || 'Untitled Piece',
    slug,
    data.category || 'Coats & Outerwear',
    data.subcategory || '',
    data.price || 0,
    data.originalPrice || null,
    data.currency || 'USD',
    data.description || '',
    JSON.stringify(data.details || []),
    JSON.stringify(data.care || []),
    JSON.stringify(data.images || []),
    JSON.stringify(data.variants || []),
    data.inStock !== false ? 1 : 0,
    data.isNew ? 1 : 0,
    data.isFeatured ? 1 : 0,
    data.material || '',
    data.fit || ''
  );

  return getDbProductBySlug(slug)!;
}

export function updateDbProduct(slug: string, updates: Partial<Product>): Product | null {
  const existing = getDbProductBySlug(slug);
  if (!existing) return null;

  const merged = { ...existing, ...updates };

  const stmt = db.prepare(`
    UPDATE products SET
      name = ?, category = ?, subcategory = ?, price = ?, original_price = ?,
      description = ?, details = ?, care = ?, images = ?, variants = ?,
      in_stock = ?, is_new = ?, is_featured = ?, material = ?, fit = ?
    WHERE slug = ?
  `);

  stmt.run(
    merged.name,
    merged.category,
    merged.subcategory || '',
    merged.price,
    merged.originalPrice || null,
    merged.description,
    JSON.stringify(merged.details || []),
    JSON.stringify(merged.care || []),
    JSON.stringify(merged.images || []),
    JSON.stringify(merged.variants || []),
    merged.inStock ? 1 : 0,
    merged.isNew ? 1 : 0,
    merged.isFeatured ? 1 : 0,
    merged.material || '',
    merged.fit || '',
    slug
  );

  return getDbProductBySlug(slug);
}

export function deleteDbProduct(slug: string): boolean {
  const res = db.prepare('DELETE FROM products WHERE slug = ?').run(slug);
  return res.changes > 0;
}

// ---------------- Order Database Operations ---------------- //

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

export function createDbOrder(order: {
  customer_email: string;
  customer_name: string;
  shipping_address: any;
  shipping_method: string;
  items: any[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
}): DbOrder {
  const orderId = `MN-${Math.floor(100000 + Math.random() * 900000)}`;

  const stmt = db.prepare(`
    INSERT INTO orders (
      id, customer_email, customer_name, shipping_address, shipping_method,
      items, subtotal, shipping_cost, tax, total, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
  `);

  stmt.run(
    orderId,
    order.customer_email,
    order.customer_name,
    JSON.stringify(order.shipping_address),
    order.shipping_method,
    JSON.stringify(order.items),
    order.subtotal,
    order.shipping_cost,
    order.tax,
    order.total
  );

  return getDbOrderById(orderId)!;
}

export function getDbOrders(): DbOrder[] {
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  return rows.map((row: any) => ({
    ...row,
    shipping_address: JSON.parse(row.shipping_address),
    items: JSON.parse(row.items),
  }));
}

export function getDbOrderById(id: string): DbOrder | null {
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!row) return null;
  return {
    ...(row as any),
    shipping_address: JSON.parse((row as any).shipping_address),
    items: JSON.parse((row as any).items),
  };
}

export function updateDbOrderStatus(id: string, status: string): boolean {
  const res = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  return res.changes > 0;
}

// ---------------- Newsletter Operations ---------------- //

export function addDbNewsletterSubscriber(email: string): { success: boolean; message: string } {
  try {
    const stmt = db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)');
    stmt.run(email.toLowerCase().trim());
    return { success: true, message: 'Subscribed successfully to private salon updates.' };
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return { success: true, message: 'You are already registered for our private releases.' };
    }
    return { success: false, message: 'Could not subscribe at this time.' };
  }
}

export function getDbNewsletterSubscribers(): { id: number; email: string; created_at: string }[] {
  return db.prepare('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC').all() as any;
}

// ---------------- Analytics / Stats ---------------- //

export function getDbStats() {
  const totalOrdersRow = db.prepare('SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM orders').get() as any;
  const totalProductsRow = db.prepare('SELECT COUNT(*) as count FROM products WHERE in_stock = 1').get() as any;
  const totalSubscribersRow = db.prepare('SELECT COUNT(*) as count FROM newsletter_subscribers').get() as any;
  const recentOrders = getDbOrders().slice(0, 5);

  return {
    totalRevenue: totalOrdersRow.revenue,
    totalOrders: totalOrdersRow.count,
    activeProducts: totalProductsRow.count,
    totalSubscribers: totalSubscribersRow.count,
    recentOrders,
  };
}
