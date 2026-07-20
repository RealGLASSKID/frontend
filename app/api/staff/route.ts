import { NextResponse } from 'next/server';

let staff = [
  { id: 1, name: 'Mrs. Adaeze Okonkwo', role: 'Principal', department: 'Administration' },
];

export async function GET() {
  return NextResponse.json(staff);
}
