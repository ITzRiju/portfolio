'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  PhotoIcon,
  EyeIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalPortfolioItems: number;
  totalUsers: number;
  recentBookings: any[];
  monthlyRevenue: number[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    totalPortfolioItems: 0,
    totalUsers: 0,
    recentBookings: [],
    monthlyRevenue: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set demo data for development
      setStats({
        totalBookings: 45,
        totalRevenue: 125000,
        totalPortfolioItems: 120,
        totalUsers: 28,
        recentBookings: [
          { id: 1, client: 'John Doe', service: 'Wedding Photography', date: '2024-01-15', amount: 25000 },
          { id: 2, client: 'Jane Smith', service: 'Portrait Session', date: '2024-01-14', amount: 5000 },
          { id: 3, client: 'Mike Johnson', service: 'Event Photography', date: '2024-01-13', amount: 15000 }
        ],
        monthlyRevenue: [20000, 35000, 28000, 42000, 38000, 45000]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: CalendarIcon,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyRupeeIcon,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Portfolio Items',
      value: stats.totalPortfolioItems,
      icon: PhotoIcon,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'bg-orange-500',
      change: '+5%'
    }
  ];

  const quickActions = [
    {
      title: 'Add Portfolio Item',
      description: 'Upload new photos or videos',
      href: '/admin/portfolio/add',
      icon: PlusIcon,
      color: 'bg-primary-600'
    },
    {
      title: 'Manage Content',
      description: 'Edit website content',
      href: '/admin/content',
      icon: EyeIcon,
      color: 'bg-indigo-600'
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics',
      href: '/admin/analytics',
      icon: ChartBarIcon,
      color: 'bg-emerald-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your photography business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${action.color} p-2 rounded-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
          <Link
            href="/admin/bookings"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{booking.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;