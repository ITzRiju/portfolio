'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserPlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  lastLogin: string;
  status: 'active' | 'inactive' | 'suspended';
  totalBookings: number;
  totalSpent: number;
  avatar?: string;
}

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  mode: 'view' | 'edit';
}

const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    status: 'active'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'active'
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const userData = {
        ...user,
        ...formData,
        id: user?.id || `USR${Date.now()}`
      } as User;

      onSave(userData);
      onClose();
      toast.success(user ? 'User updated successfully!' : 'User created successfully!');
    } catch (error) {
      toast.error('Failed to save user');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {mode === 'view' ? 'User Details' : user ? 'Edit User' : 'Add New User'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {mode === 'view' && user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Join Date</label>
                  <p className="text-gray-900">{new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Login</label>
                  <p className="text-gray-900">{new Date(user.lastLogin).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Bookings</label>
                  <p className="text-gray-900">{user.totalBookings}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Spent</label>
                  <p className="text-gray-900">₹{user.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter user name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="spinner mr-2" />
                      Saving...
                    </div>
                  ) : (
                    user ? 'Update User' : 'Create User'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        // Fallback demo data
        setUsers([
          {
            id: 'USR001',
            name: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            phone: '+91 9876543210',
            joinDate: '2023-12-15',
            lastLogin: '2024-01-15',
            status: 'active',
            totalBookings: 5,
            totalSpent: 125000
          },
          {
            id: 'USR002',
            name: 'Priya Sharma',
            email: 'priya@example.com',
            phone: '+91 9876543211',
            joinDate: '2023-11-20',
            lastLogin: '2024-01-14',
            status: 'active',
            totalBookings: 3,
            totalSpent: 75000
          },
          {
            id: 'USR003',
            name: 'Amit Patel',
            email: 'amit@example.com',
            phone: '+91 9876543212',
            joinDate: '2023-10-10',
            lastLogin: '2024-01-10',
            status: 'inactive',
            totalBookings: 2,
            totalSpent: 45000
          },
          {
            id: 'USR004',
            name: 'Sneha Gupta',
            email: 'sneha@example.com',
            phone: '+91 9876543213',
            joinDate: '2023-09-05',
            lastLogin: '2024-01-12',
            status: 'active',
            totalBookings: 7,
            totalSpent: 185000
          },
          {
            id: 'USR005',
            name: 'Vikram Singh',
            email: 'vikram@example.com',
            phone: '+91 9876543214',
            joinDate: '2023-08-15',
            lastLogin: '2023-12-20',
            status: 'suspended',
            totalBookings: 1,
            totalSpent: 15000
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully!');
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
    setShowDropdown(null);
  };

  const handleSaveUser = async (userData: User) => {
    try {
      const isEdit = users.some(user => user.id === userData.id);
      
      if (isEdit) {
        setUsers(users.map(user => user.id === userData.id ? userData : user));
      } else {
        setUsers([...users, { ...userData, joinDate: new Date().toISOString(), lastLogin: new Date().toISOString(), totalBookings: 0, totalSpent: 0 }]);
      }
    } catch (error) {
      toast.error('Failed to save user');
    }
  };

  const openModal = (user: User | null, mode: 'view' | 'edit') => {
    setSelectedUser(user);
    setModalMode(mode);
    setIsModalOpen(true);
    setShowDropdown(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage user accounts and permissions.</p>
        </div>
        <button
          onClick={() => openModal(null, 'edit')}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <UserPlusIcon className="h-5 w-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.totalBookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{user.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === user.id ? null : user.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                      {showDropdown === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => openModal(user, 'view')}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <EyeIcon className="h-4 w-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => openModal(user, 'edit')}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <PencilIcon className="h-4 w-4 mr-2" />
                              Edit User
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                            >
                              <TrashIcon className="h-4 w-4 mr-2" />
                              Delete User
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found.</p>
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        mode={modalMode}
      />
    </div>
  );
};

export default AdminUsers;