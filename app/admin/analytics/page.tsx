'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    totalRevenue: number;
    conversionRate: number;
    viewsChange: number;
    visitorsChange: number;
    revenueChange: number;
    conversionChange: number;
  };
  monthlyData: {
    month: string;
    views: number;
    visitors: number;
    revenue: number;
    bookings: number;
  }[];
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  topPages: {
    page: string;
    views: number;
    percentage: number;
  }[];
  recentBookings: {
    id: string;
    service: string;
    amount: number;
    date: string;
    status: string;
  }[];
}

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?period=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        // Fallback demo data
        setAnalyticsData({
          overview: {
            totalViews: 12543,
            uniqueVisitors: 8921,
            totalRevenue: 245000,
            conversionRate: 3.2,
            viewsChange: 12.5,
            visitorsChange: 8.3,
            revenueChange: 15.7,
            conversionChange: -2.1
          },
          monthlyData: [
            { month: 'Jan', views: 8500, visitors: 6200, revenue: 180000, bookings: 45 },
            { month: 'Feb', views: 9200, visitors: 6800, revenue: 195000, bookings: 52 },
            { month: 'Mar', views: 10100, visitors: 7400, revenue: 220000, bookings: 58 },
            { month: 'Apr', views: 11300, visitors: 8100, revenue: 245000, bookings: 65 },
            { month: 'May', views: 12543, visitors: 8921, revenue: 275000, bookings: 72 },
            { month: 'Jun', views: 13200, visitors: 9500, revenue: 290000, bookings: 78 }
          ],
          deviceStats: {
            desktop: 45,
            mobile: 42,
            tablet: 13
          },
          topPages: [
            { page: '/', views: 4521, percentage: 36.1 },
            { page: '/portfolio', views: 2876, percentage: 22.9 },
            { page: '/services', views: 2134, percentage: 17.0 },
            { page: '/booking', views: 1654, percentage: 13.2 },
            { page: '/about', views: 1358, percentage: 10.8 }
          ],
          recentBookings: [
            { id: 'BK001', service: 'Wedding Photography', amount: 45000, date: '2024-01-15', status: 'confirmed' },
            { id: 'BK002', service: 'Portrait Session', amount: 8000, date: '2024-01-14', status: 'pending' },
            { id: 'BK003', service: 'Event Coverage', amount: 25000, date: '2024-01-13', status: 'confirmed' },
            { id: 'BK004', service: 'Product Photography', amount: 12000, date: '2024-01-12', status: 'completed' },
            { id: 'BK005', service: 'Corporate Event', amount: 35000, date: '2024-01-11', status: 'confirmed' }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track your website performance and business metrics.</p>
        </div>
        <div className="flex space-x-2">
          {['7d', '30d', '90d', '1y'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {period === '7d' && 'Last 7 days'}
              {period === '30d' && 'Last 30 days'}
              {period === '90d' && 'Last 90 days'}
              {period === '1y' && 'Last year'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.overview.totalViews)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getChangeIcon(analyticsData.overview.viewsChange)}
            <span className={`text-sm font-medium ml-1 ${getChangeColor(analyticsData.overview.viewsChange)}`}>
              {Math.abs(analyticsData.overview.viewsChange)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.overview.uniqueVisitors)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getChangeIcon(analyticsData.overview.visitorsChange)}
            <span className={`text-sm font-medium ml-1 ${getChangeColor(analyticsData.overview.visitorsChange)}`}>
              {Math.abs(analyticsData.overview.visitorsChange)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CurrencyRupeeIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getChangeIcon(analyticsData.overview.revenueChange)}
            <span className={`text-sm font-medium ml-1 ${getChangeColor(analyticsData.overview.revenueChange)}`}>
              {Math.abs(analyticsData.overview.revenueChange)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.conversionRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getChangeIcon(analyticsData.overview.conversionChange)}
            <span className={`text-sm font-medium ml-1 ${getChangeColor(analyticsData.overview.conversionChange)}`}>
              {Math.abs(analyticsData.overview.conversionChange)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ComputerDesktopIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Desktop</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${analyticsData.deviceStats.desktop}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{analyticsData.deviceStats.desktop}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DevicePhoneMobileIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Mobile</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${analyticsData.deviceStats.mobile}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{analyticsData.deviceStats.mobile}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <GlobeAltIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Tablet</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${analyticsData.deviceStats.tablet}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{analyticsData.deviceStats.tablet}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{page.page}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-primary-600 h-1.5 rounded-full" 
                      style={{ width: `${page.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-medium text-gray-900">{formatNumber(page.views)}</p>
                  <p className="text-xs text-gray-500">{page.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(booking.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;