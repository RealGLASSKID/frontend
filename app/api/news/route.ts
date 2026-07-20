import { NextResponse } from 'next/server';

let news = [
  { id: 1, title: 'JSS3 class records 98% BECE pass rate', date: '12 May 2026', category: 'Achievement', summary: 'Forty-three of our forty-four JSS3 candidates earned distinctions across core subjects.' },
  { id: 2, title: 'Inter-house spelling bee crowns Cherry House champions', date: '04 May 2026', category: 'Event', summary: 'After three rounds of fierce competition...' },
];

export async function GET() {
  return NextResponse.json(news);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newItem = { id: Date.now(), ...body };
  news.push(newItem);
  return NextResponse.json(newItem, { status: 201 });
}
