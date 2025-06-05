import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin-token');
    
    // For development, we'll allow access without proper authentication
    // In production, you would validate the token properly
    if (adminToken || process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        authenticated: true, 
        user: { 
          id: 1, 
          username: 'admin', 
          role: 'admin' 
        } 
      });
    }
    
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}