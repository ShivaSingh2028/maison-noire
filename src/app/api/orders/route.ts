import { NextRequest, NextResponse } from 'next/server';
import { getDbOrders, createDbOrder } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await getDbOrders();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.customer_email || !body.customer_name || !body.items || !body.total) {
      return NextResponse.json(
        { success: false, error: 'Customer details, items, and total are required' },
        { status: 400 }
      );
    }
    const order = await createDbOrder({
      customer_email: body.customer_email,
      customer_name: body.customer_name,
      shipping_address: body.shipping_address || {},
      shipping_method: body.shipping_method || 'Standard Shipping',
      items: body.items,
      subtotal: body.subtotal || body.total,
      shipping_cost: body.shipping_cost || 0,
      tax: body.tax || 0,
      total: body.total,
    });
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
