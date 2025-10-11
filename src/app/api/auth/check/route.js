import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token');
  
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }
  
  const decoded = verifyToken(token.value);
  
  if (!decoded) {
    return NextResponse.json({ authenticated: false });
  }
  
  return NextResponse.json({ 
    authenticated: true, 
    userId: decoded.userId 
  });
}