import { NextRequest, NextResponse } from 'next/server';

// Mock admin credentials (in production, use proper password hashing)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // In production, this should be hashed
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // Validate credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Set admin token cookie
      const response = NextResponse.json({ 
        success: true, 
        user: { 
          id: 1, 
          username: 'admin', 
          role: 'admin' 
        } 
      });
      
      // Set cookie for 24 hours
      response.cookies.set('admin-token', 'admin-session-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      });
      
      return response;
    }
    
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}