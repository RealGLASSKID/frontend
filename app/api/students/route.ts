import { NextResponse } from 'next/server';

let students = [
  { id: 1, name: 'Adebayo Olawale', class: 'JSS1A', age: 12, admissionDate: '2025-09-01' },
  { id: 2, name: 'Chinaza Okoro', class: 'Primary 5', age: 10, admissionDate: '2025-09-01' },
];

export async function GET() {
  return NextResponse.json(students);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newStudent = { id: Date.now(), ...body };
  students.push(newStudent);
  return NextResponse.json(newStudent, { status: 201 });
}
