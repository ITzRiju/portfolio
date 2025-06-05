import { NextRequest, NextResponse } from 'next/server';

// Mock user credentials (in production, use proper database and password hashing)
const MOCK_USERS = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    password: 'password123' // In production, this should be hashed
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 9876543211',
    password: 'password123'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Find user by email
    const user = MOCK_USERS.find(u => u.email === email);
    
    if (user && user.password === password) {
      const response = NextResponse.json({ 
        success: true, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          phone: user.phone
        } 
      });
      
      // Set user token cookie
      response.cookies.set('user-token', `user-session-${user.id}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
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