'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Booking {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_name: string;
  service_price: number;
  event_date: string;
  event_type: string;
  event_location: string;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_id?: string;
  created_at: string;
}

const BookingsManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      // Set demo data for development
      setBookings([
        {
          id: 1,
          client_name: 'John Doe',
          client_email: 'john@example.com',
          client_phone: '+91 9876543210',
          service_name: 'Wedding Photography Package',
          service_price: 25000,
          event_date: '2024-02-15',
          event_type: 'Wedding',
          event_location: 'Mumbai, Maharashtra',
          special_requests: 'Please include drone shots of the venue',
          status: 'confirmed',
          payment_status: 'paid',
          payment_id: 'pay_123456789',
          created_at: '2024-01-15'
        },
        {
          id: 2,
          client_name: 'Jane Smith',
          client_email: 'jane@example.com',
          client_phone: '+91 9876543211',
          service_name: 'Portrait Session',
          service_price: 5000,
          event_date: '2024-02-10',
          event_type: 'Portrait',
          event_location: 'Delhi, India',
          status: 'pending',
          payment_status: 'pending',
          created_at: '2024-01-14'
        },
        {
          id: 3,
          client_name: 'Mike Johnson',
          client_email: 'mike@example.com',
          client_phone: '+91 9876543212',
          service_name: 'Event Photography',
          service_price: 15000,
          event_date: '2024-01-20',
          event_type: 'Corporate Event',
          event_location: 'Bangalore, Karnataka',
          status: 'completed',
          payment_status: 'paid',
          payment_id: 'pay_987654321',
          created_at: '2024-01-13'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setBookings(bookings.map(booking => 
          booking.id === id ? { ...booking, status: status as any } : booking
        ));
        toast.success('Booking status updated successfully!');
      } else {
        toast.error('Failed to update booking status');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const statusMatch = selectedStatus === 'all' || booking.status === selectedStatus;
    const paymentMatch = selectedPaymentStatus === 'all' || booking.payment_status === selectedPaymentStatus;
    return statusMatch && paymentMatch;
  });

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
        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        <p className="text-gray-600 mt-2">Manage client bookings and track payments.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: bookings.length, color: 'bg-blue-500' },
          { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-green-500' },
          { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'bg-purple-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                  Event Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{booking.client_name}</div>
                        <div className="text-sm text-gray-500">{booking.client_email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.service_name}</div>
                    <div className="text-sm text-gray-500">{booking.event_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(booking.event_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{booking.service_price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={booking.status}
                      onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(booking.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.payment_status)}`}>
                      {booking.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetailsModal(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">No bookings match the selected filters.</p>
        </div>
      )}

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

const BookingDetailsModal = ({
  booking,
  onClose
}: {
  booking: Booking;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Booking Details - #{booking.id}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Client Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Client Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.client_name}</p>
                    <p className="text-sm text-gray-500">Client Name</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.client_email}</p>
                    <p className="text-sm text-gray-500">Email</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.client_phone}</p>
                    <p className="text-sm text-gray-500">Phone</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Service Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{booking.service_name}</p>
                  <p className="text-sm text-gray-500">Service</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">₹{booking.service_price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Price</p>
                </div>
              </div>
            </div>

            {/* Event Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Event Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(booking.event_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">Event Date</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{booking.event_type}</p>
                  <p className="text-sm text-gray-500">Event Type</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-900">{booking.event_location}</p>
                  <p className="text-sm text-gray-500">Location</p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.special_requests && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Special Requests</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {booking.special_requests}
                </p>
              </div>
            )}

            {/* Status Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Status Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">Booking Status</p>
                </div>
                <div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                    booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.payment_status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">Payment Status</p>
                </div>
                {booking.payment_id && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.payment_id}</p>
                    <p className="text-sm text-gray-500">Payment ID</p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Date */}
            <div>
              <p className="text-sm text-gray-500">
                Booking created on {new Date(booking.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsManagement;