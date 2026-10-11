'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowLeft, 
  Plus, 
  CheckCircle, 
  Clock, 
  Truck, 
  CheckCheck,
  RefreshCw,
  ExternalLink,
  Search
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import SafeImage from '@/components/ui/SafeImage';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
  image?: string;
}

interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  shipping_address: {
    address1?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  shipping_method: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  images: { src: string; alt: string }[];
}

interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  totalSubscribers: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'subscribers'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    totalSubscribers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Coats & Outerwear',
    price: 950,
    description: '',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1000&fit=crop&q=85',
  });
  const [savingProduct, setSavingProduct] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, subRes, statsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/newsletter'),
        fetch('/api/stats'),
      ]);

      const [ordersData, productsData, subData, statsData] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        subRes.json(),
        statsRes.json(),
      ]);

      if (ordersData.orders) setOrders(ordersData.orders);
      if (productsData.products) setProducts(productsData.products);
      if (subData.subscribers) setSubscribers(subData.subscribers);
      if (statsData.stats) setStats(statsData.stats);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: status as any } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: status as any } : null));
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          category: newProduct.category,
          price: Number(newProduct.price),
          description: newProduct.description || 'Exclusive luxury design curated by Maison Noire.',
          images: [{ src: newProduct.image, alt: newProduct.name, width: 800, height: 1000 }],
          variants: [
            { type: 'size', label: 'S', value: 's', available: true },
            { type: 'size', label: 'M', value: 'm', available: true },
            { type: 'size', label: 'L', value: 'l', available: true },
          ],
          details: ['Artisanal construction', 'Signature cut'],
          care: ['Dry clean only'],
          inStock: true,
          isNew: true,
          isFeatured: false,
        }),
      });

      if (res.ok) {
        setIsAddProductOpen(false);
        setNewProduct({
          name: '',
          category: 'Coats & Outerwear',
          price: 950,
          description: '',
          image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1000&fit=crop&q=85',
        });
        fetchData();
      }
    } catch (err) {
      console.error('Error saving product:', err);
    } finally {
      setSavingProduct(false);
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-noir pb-24">
      {/* Top Bar */}
      <header className="bg-noir text-parchment border-b border-charcoal/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
            <span className="text-charcoal">|</span>
            <div>
              <h1 className="font-serif text-xl tracking-wider text-white">MAISON NOIRE</h1>
              <p className="text-[10px] tracking-widest uppercase text-gold font-mono">
                Atelier Database Console &bull; SQLite Embedded Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 bg-charcoal text-parchment px-3 py-2 text-xs tracking-wider uppercase hover:bg-stone/30 transition-colors rounded-sm"
              title="Sync Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
            <Link
              href="/shop"
              className="flex items-center gap-2 bg-gold/20 text-gold border border-gold/40 px-4 py-2 text-xs tracking-wider uppercase hover:bg-gold hover:text-noir transition-colors rounded-sm"
            >
              <span>View Catalog</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-stone/20 p-5 rounded-sm shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-stone">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-gold" />
            </div>
            <p className="font-serif text-2xl font-light text-noir">
              {formatPrice(stats.totalRevenue)}
            </p>
            <p className="text-[11px] text-stone mt-1">From processed customer orders</p>
          </div>

          <div className="bg-white border border-stone/20 p-5 rounded-sm shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-stone">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-gold" />
            </div>
            <p className="font-serif text-2xl font-light text-noir">{stats.totalOrders}</p>
            <p className="text-[11px] text-stone mt-1">Saved in SQLite database</p>
          </div>

          <div className="bg-white border border-stone/20 p-5 rounded-sm shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-stone">Active Products</span>
              <Package className="w-4 h-4 text-gold" />
            </div>
            <p className="font-serif text-2xl font-light text-noir">{stats.activeProducts}</p>
            <p className="text-[11px] text-stone mt-1">Ready for purchase in catalog</p>
          </div>

          <div className="bg-white border border-stone/20 p-5 rounded-sm shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-stone">Newsletter Subscribers</span>
              <Users className="w-4 h-4 text-gold" />
            </div>
            <p className="font-serif text-2xl font-light text-noir">{stats.totalSubscribers}</p>
            <p className="text-[11px] text-stone mt-1">Registered clients & VIPs</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-stone/20 flex gap-8 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs tracking-widest uppercase font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-noir text-noir'
                : 'border-transparent text-stone hover:text-noir'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-xs tracking-widest uppercase font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-noir text-noir'
                : 'border-transparent text-stone hover:text-noir'
            }`}
          >
            Catalog Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`pb-3 text-xs tracking-widest uppercase font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'subscribers'
                ? 'border-noir text-noir'
                : 'border-transparent text-stone hover:text-noir'
            }`}
          >
            Subscribers ({subscribers.length})
          </button>
        </div>

        {/* Tab: Orders */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by Order ID, customer, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-stone/30 pl-9 pr-4 py-2 text-xs text-noir rounded-sm outline-none focus:border-gold"
                />
              </div>
              <p className="text-xs text-stone">
                Showing {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'}
              </p>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white border border-stone/20 p-12 text-center rounded-sm">
                <ShoppingBag className="w-8 h-8 text-stone/40 mx-auto mb-3" />
                <h3 className="font-serif text-lg text-noir mb-1">No Orders in Database</h3>
                <p className="text-xs text-stone mb-4">
                  Place an order via the checkout page to see it recorded live here.
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-noir text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-charcoal transition-colors"
                >
                  Create Test Order
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-stone/20 rounded-sm overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-stone/20 text-stone uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone/10">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-stone/5 transition-colors">
                          <td className="py-3 px-4 font-mono font-medium text-noir">
                            {order.id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-noir">{order.customer_name}</div>
                            <div className="text-[11px] text-stone">{order.customer_email}</div>
                          </td>
                          <td className="py-3 px-4 text-stone">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">{order.items.length} items</span>
                            <span className="text-[11px] text-stone block truncate max-w-[180px]">
                              {order.items.map((i) => i.name).join(', ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-serif text-sm font-medium text-noir">
                            {formatPrice(order.total)}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`text-[11px] uppercase tracking-wider px-2 py-1 rounded-sm border font-medium ${
                                order.status === 'confirmed'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : order.status === 'processing'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : order.status === 'shipped'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-gold hover:text-noir text-xs underline font-medium cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Products */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs text-stone">
                Manage your luxury catalog. Products are served from SQLite.
              </p>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="flex items-center gap-2 bg-noir text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-charcoal transition-colors rounded-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-stone/20 rounded-sm p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-3/4 mb-3 bg-[#FAF8F5] overflow-hidden rounded-xs">
                      {p.images[0]?.src && (
                        <SafeImage
                          src={p.images[0].src}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <span className="absolute top-2 right-2 bg-noir/80 text-parchment text-[10px] uppercase px-2 py-0.5 tracking-wider">
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-stone">
                      {p.category}
                    </span>
                    <h3 className="font-serif text-sm text-noir truncate mt-0.5">{p.name}</h3>
                    <p className="font-serif text-sm font-medium text-noir mt-1">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone/10 flex justify-between items-center">
                    <span className="text-[10px] text-stone font-mono">{p.slug}</span>
                    <Link
                      href={`/shop/${p.slug}`}
                      className="text-gold hover:text-noir text-xs flex items-center gap-1"
                    >
                      <span>Store Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Subscribers */}
        {activeTab === 'subscribers' && (
          <div>
            <div className="bg-white border border-stone/20 rounded-sm overflow-hidden shadow-xs">
              <div className="p-4 border-b border-stone/20 flex justify-between items-center">
                <h3 className="font-serif text-base text-noir">Private Salon Subscribers</h3>
                <span className="text-xs text-stone">{subscribers.length} total subscribers</span>
              </div>
              {subscribers.length === 0 ? (
                <div className="p-8 text-center text-stone text-xs">
                  No subscribers yet. Users can subscribe in the footer or home page.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-stone/20 text-stone uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Subscribed At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone/10">
                    {subscribers.map((sub, idx) => (
                      <tr key={sub.id} className="hover:bg-stone/5 transition-colors">
                        <td className="py-3 px-4 text-stone">{idx + 1}</td>
                        <td className="py-3 px-4 font-medium text-noir">{sub.email}</td>
                        <td className="py-3 px-4 text-stone">
                          {new Date(sub.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-noir/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm p-6 shadow-xl border border-stone/30">
            <div className="flex justify-between items-start border-b border-stone/20 pb-4 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold font-mono">
                  Order Invoice
                </span>
                <h2 className="font-serif text-xl text-noir">{selectedOrder.id}</h2>
                <p className="text-xs text-stone">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone hover:text-noir text-lg font-light px-2"
              >
                &times;
              </button>
            </div>

            {/* Customer & Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-[#FAF8F5] p-4 rounded-sm text-xs">
              <div>
                <h4 className="font-medium text-noir uppercase tracking-wider mb-2">Customer</h4>
                <p className="font-medium">{selectedOrder.customer_name}</p>
                <p className="text-stone">{selectedOrder.customer_email}</p>
              </div>
              <div>
                <h4 className="font-medium text-noir uppercase tracking-wider mb-2">Shipping Destination</h4>
                <p>{selectedOrder.shipping_address.address1}</p>
                <p>
                  {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}{' '}
                  {selectedOrder.shipping_address.zip}
                </p>
                <p>{selectedOrder.shipping_address.country}</p>
                <p className="text-gold mt-1 text-[11px] font-medium">
                  {selectedOrder.shipping_method}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <h4 className="font-serif text-sm text-noir mb-3">Purchased Items</h4>
            <div className="divide-y divide-stone/10 border-t border-b border-stone/20 mb-6">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <div className="relative w-12 h-14 bg-stone/10 shrink-0">
                        <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-noir">{item.name}</p>
                      {item.selectedVariants && (
                        <p className="text-[11px] text-stone">
                          {Object.entries(item.selectedVariants)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' | ')}
                        </p>
                      )}
                      <p className="text-stone text-[11px]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-noir">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 text-xs text-stone mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formatPrice(selectedOrder.shipping_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatPrice(selectedOrder.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-serif font-medium text-noir pt-2 border-t border-stone/20">
                <span>Total:</span>
                <span className="text-gold">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone/20">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-stone hover:text-noir"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-noir/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-sm p-6 shadow-xl border border-stone/30">
            <div className="flex justify-between items-center border-b border-stone/20 pb-3 mb-4">
              <h2 className="font-serif text-lg text-noir">Add Piece to Catalog</h2>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-stone hover:text-noir text-lg font-light px-2"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculpted Double-Breasted Peacoat"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full border border-stone/30 p-2 text-noir rounded-sm outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-stone/30 p-2 text-noir rounded-sm outline-none focus:border-gold"
                  >
                    <option value="Coats & Outerwear">Coats & Outerwear</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Knitwear">Knitwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Shoes">Shoes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone uppercase tracking-wider mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: Number(e.target.value) })
                    }
                    className="w-full border border-stone/30 p-2 text-noir rounded-sm outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone uppercase tracking-wider mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Artisanal description of silhouettes and textiles..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full border border-stone/30 p-2 text-noir rounded-sm outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-stone uppercase tracking-wider mb-1">
                  Image URL (Unsplash or CDN)
                </label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full border border-stone/30 p-2 text-noir rounded-sm outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone/20">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-stone hover:text-noir"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="bg-noir text-white px-5 py-2 text-xs uppercase tracking-widest hover:bg-charcoal transition-colors rounded-sm"
                >
                  {savingProduct ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
