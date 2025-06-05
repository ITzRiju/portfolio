import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin-token');
    
    if (adminToken) {
      try {
        // Verify the JWT token
        const decoded = jwt.verify(adminToken.value, process.env.JWT_SECRET!);
        return NextResponse.json({ 
          authenticated: true, 
          user: decoded 
        });
      } catch (jwtError) {
        // Token is invalid
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }
    }
    
    // Allow in development only
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        authenticated: true, 
        user: { id: 1, username: 'admin', role: 'admin' } 
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
