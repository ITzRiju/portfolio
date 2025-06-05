import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const userToken = cookieStore.get('user-token');
    
    // For development, we'll simulate user authentication
    // In production, you would validate the token properly
    if (userToken) {
      return NextResponse.json({ 
        authenticated: true, 
        user: { 
          id: 1, 
          name: 'John Doe', 
          email: 'john@example.com',
          phone: '+91 9876543210'
        } 
      });
    }
    
    return NextResponse.json(
      { authenticated: false },
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