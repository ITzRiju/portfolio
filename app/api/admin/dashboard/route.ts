import { NextResponse } from 'next/server';

// Mock dashboard data
const dashboardData = {
  totalBookings: 45,
  totalRevenue: 125000,
  totalPortfolioItems: 120,
  totalUsers: 28,
  recentBookings: [
    {
      id: 1,
      client: 'John Doe',
      service: 'Wedding Photography',
      date: '2024-01-15',
      amount: 25000,
      status: 'confirmed'
    },
    {
      id: 2,
      client: 'Jane Smith',
      service: 'Portrait Session',
      date: '2024-01-14',
      amount: 5000,
      status: 'pending'
    },
    {
      id: 3,
      client: 'Mike Johnson',
      service: 'Event Photography',
      date: '2024-01-13',
      amount: 15000,
      status: 'confirmed'
    },
    {
      id: 4,
      client: 'Sarah Wilson',
      service: 'Wedding Videography',
      date: '2024-01-12',
      amount: 35000,
      status: 'completed'
    },
    {
      id: 5,
      client: 'David Brown',
      service: 'Commercial Photography',
      date: '2024-01-11',
      amount: 12000,
      status: 'confirmed'
    }
  ],
  monthlyRevenue: [20000, 35000, 28000, 42000, 38000, 45000],
  monthlyBookings: [8, 12, 10, 15, 13, 18],
  serviceBreakdown: [
    { name: 'Wedding Photography', count: 15, revenue: 75000 },
    { name: 'Portrait Session', count: 12, revenue: 24000 },
    { name: 'Event Photography', count: 8, revenue: 40000 },
    { name: 'Wedding Videography', count: 6, revenue: 90000 },
    { name: 'Commercial Photography', count: 4, revenue: 20000 }
  ],
  upcomingBookings: [
    {
      id: 6,
      client: 'Emily Davis',
      service: 'Wedding Photography',
      date: '2024-01-20',
      time: '10:00 AM',
      location: 'Grand Palace Hotel'
    },
    {
      id: 7,
      client: 'Robert Taylor',
      service: 'Corporate Event',
      date: '2024-01-22',
      time: '2:00 PM',
      location: 'Business Center'
    },
    {
      id: 8,
      client: 'Lisa Anderson',
      service: 'Portrait Session',
      date: '2024-01-25',
      time: '11:00 AM',
      location: 'Studio'
    }
  ]
};

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}