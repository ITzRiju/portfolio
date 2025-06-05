'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PhotoIcon,
  VideoCameraIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  description?: string;
  created_at: string;
}

const PortfolioManagement = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = ['wedding', 'portrait', 'event', 'commercial', 'nature'];

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch('/api/admin/portfolio');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio items:', error);
      // Set demo data for development
      setItems([
        {
          id: 1,
          title: 'Beautiful Wedding Ceremony',
          category: 'wedding',
          type: 'image',
          url: '/images/portfolio/wedding-1.jpg',
          description: 'A magical wedding ceremony captured in golden hour',
          created_at: '2024-01-15'
        },
        {
          id: 2,
          title: 'Corporate Event Highlights',
          category: 'event',
          type: 'video',
          url: '/videos/corporate-event.mp4',
          thumbnail: '/images/portfolio/event-thumb.jpg',
          description: 'Professional corporate event coverage',
          created_at: '2024-01-14'
        },
        {
          id: 3,
          title: 'Portrait Session',
          category: 'portrait',
          type: 'image',
          url: '/images/portfolio/portrait-1.jpg',
          description: 'Professional portrait photography session',
          created_at: '2024-01-13'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
        toast.success('Item deleted successfully!');
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const filteredItems = items.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    return categoryMatch && typeMatch;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600 mt-2">Manage your photography and videography portfolio.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="relative h-48">
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="relative h-full">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full bg-gray-200 flex items-center justify-center">
                      <VideoCameraIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <VideoCameraIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.type === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {item.type === 'image' ? 'Photo' : 'Video'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2 capitalize">{item.category}</p>
              {item.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
              )}
              <p className="text-xs text-gray-400 mb-3">
                {new Date(item.created_at).toLocaleDateString()}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => window.open(item.url, '_blank')}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolio items</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new portfolio item.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <PortfolioModal
          item={editingItem}
          categories={categories}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSave={() => {
            fetchPortfolioItems();
            setShowAddModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

const PortfolioModal = ({
  item,
  categories,
  onClose,
  onSave
}: {
  item: PortfolioItem | null;
  categories: string[];
  onClose: () => void;
  onSave: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    category: item?.category || categories[0],
    type: item?.type || 'image' as 'image' | 'video',
    description: item?.description || '',
    url: item?.url || ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title || '');
      submitData.append('category', formData.category || '');
      submitData.append('type', formData.type || 'image');
      submitData.append('description', formData.description || '');
      
      if (file) {
        submitData.append('file', file);
      } else if (formData.url) {
        submitData.append('url', formData.url);
      }

      const url = item ? `/api/admin/portfolio/${item.id}` : '/api/admin/portfolio';
      const method = item ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (response.ok) {
        toast.success(`Portfolio item ${item ? 'updated' : 'added'} successfully!`);
        onSave();
      } else {
        toast.error(`Failed to ${item ? 'update' : 'add'} portfolio item`);
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {item ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === 'image' ? 'Upload Image' : 'Upload Video or Enter URL'}
              </label>
              <input
                type="file"
                accept={formData.type === 'image' ? 'image/*' : 'video/*'}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {formData.type === 'video' && (
                <div className="mt-2">
                  <input
                    type="url"
                    placeholder="Or enter video URL (YouTube, Vimeo, etc.)"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : (item ? 'Update' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PortfolioManagement;