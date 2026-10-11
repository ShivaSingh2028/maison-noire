import { NextRequest, NextResponse } from 'next/server';
import { getDbProducts, createDbProduct } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const isNew = searchParams.get('new') === 'true' ? true : undefined;

    const products = getDbProducts({ category, search, featured, isNew });
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const created = createDbProduct(body);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
