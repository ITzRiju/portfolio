import { NextRequest, NextResponse } from 'next/server';

// Mock services data
const services = [
  {
    id: 1,
    name: 'Wedding Photography',
    description: 'Complete wedding photography package with pre-wedding, ceremony, and reception coverage',
    price: 50000,
    duration: '8-10 hours',
    features: [
      'Pre-wedding consultation',
      'Full day coverage',
      'High-resolution edited photos',
      'Online gallery',
      'Print release'
    ]
  },
  {
    id: 2,
    name: 'Portrait Session',
    description: 'Professional portrait photography for individuals, couples, or families',
    price: 8000,
    duration: '1-2 hours',
    features: [
      'Studio or outdoor location',
      '20-30 edited photos',
      'Online gallery',
      'Print release',
      'Wardrobe consultation'
    ]
  },
  {
    id: 3,
    name: 'Event Photography',
    description: 'Corporate events, parties, and special occasions photography',
    price: 25000,
    duration: '4-6 hours',
    features: [
      'Event coverage',
      'Candid and posed shots',
      'Quick turnaround',
      'Online gallery',
      'High-resolution images'
    ]
  },
  {
    id: 4,
    name: 'Product Photography',
    description: 'Professional product photography for e-commerce and marketing',
    price: 5000,
    duration: '2-3 hours',
    features: [
      'Multiple angles',
      'White background',
      'Lifestyle shots',
      'High-resolution images',
      'Quick delivery'
    ]
  },
  {
    id: 5,
    name: 'Wedding Videography',
    description: 'Cinematic wedding videography with highlight reel and full ceremony',
    price: 75000,
    duration: '8-10 hours',
    features: [
      'Cinematic highlights',
      'Full ceremony recording',
      'Drone footage (if permitted)',
      '4K quality',
      'Music and editing'
    ]
  },
  {
    id: 6,
    name: 'Commercial Photography',
    description: 'Professional photography for businesses, marketing, and branding',
    price: 15000,
    duration: '3-4 hours',
    features: [
      'Brand-focused shots',
      'Team photography',
      'Office/location shots',
      'Marketing materials',
      'Commercial license'
    ]
  }
];

export async function GET() {
  try {
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // In a real app, you would save to database
    const newService = {
      id: services.length + 1,
      ...body
    };
    services.push(newService);
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}