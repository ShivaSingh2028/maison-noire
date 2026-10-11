import { NextRequest, NextResponse } from 'next/server';
import { addDbNewsletterSubscriber, getDbNewsletterSubscribers } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const subscribers = await getDbNewsletterSubscribers();
    return NextResponse.json({ success: true, count: subscribers.length, subscribers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }
    const result = await addDbNewsletterSubscriber(email);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
