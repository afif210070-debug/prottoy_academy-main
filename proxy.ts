import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  // সার্ভারের ট্রাফিক জ্যাম খুলে সরাসরি লোকালহোস্টে পাস করে দেওয়া হলো
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/faculty/:path*'] };
