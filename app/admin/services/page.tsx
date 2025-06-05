'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CurrencyRupeeIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Service {
  id: number;
  name: string;
  category: 'photography' | 'videography';
  price: number;
  duration: string;
  description: string;
  features: string[];
  popular: boolean;
  created_at: string;
}

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
      // Set demo data for development
      setServices([
        {
          id: 1,
          name: 'Wedding Photography Package',
          category: 'photography',
          price: 25000,
          duration: '8 hours',
          description: 'Complete wedding photography coverage with professional editing',
          features: [
            '8 hours of coverage',
            '500+ edited photos',
            'Online gallery',
            'USB with high-res images',
            'Engagement session included'
          ],
          popular: true,
          created_at: '2024-01-15'
        },
        {
          id: 2,
          name: 'Portrait Session',
          category: 'photography',
          price: 5000,
          duration: '2 hours',
          description: 'Professional portrait photography session',
          features: [
            '2 hours session',
            '50+ edited photos',
            'Online gallery',
            'Print release included'
          ],
          popular: false,
          created_at: '2024-01-14'
        },
        {
          id: 3,
          name: 'Wedding Videography',
          category: 'videography',
          price: 35000,
          duration: '10 hours',
          description: 'Cinematic wedding videography with same-day highlights',
          features: [
            '10 hours of coverage',
            'Cinematic highlight reel',
            'Full ceremony footage',
            'Same-day edit',
            'Drone footage included'
          ],
          popular: true,
          created_at: '2024-01-13'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setServices(services.filter(service => service.id !== id));
        toast.success('Service deleted successfully!');
      } else {
        toast.error('Failed to delete service');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const togglePopular = async (id: number, popular: boolean) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ popular: !popular }),
      });

      if (response.ok) {
        setServices(services.map(service => 
          service.id === id ? { ...service, popular: !popular } : service
        ));
        toast.success(`Service ${!popular ? 'marked as popular' : 'unmarked as popular'}!`);
      } else {
        toast.error('Failed to update service');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const filteredServices = services.filter(service => {
    return selectedCategory === 'all' || service.category === selectedCategory;
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
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600 mt-2">Manage your photography and videography service packages.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <label className="block text-sm font-medium text-gray-700">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="photography">Photography</option>
            <option value="videography">Videography</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden ${
              service.popular ? 'border-primary-200 ring-2 ring-primary-100' : 'border-gray-200'
            }`}
          >
            {service.popular && (
              <div className="bg-primary-600 text-white text-center py-2 text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{service.category}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  service.category === 'photography' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {service.category}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">₹{service.price.toLocaleString()}</span>
                  <span className="text-gray-600 ml-2">/ {service.duration}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{service.description}</p>

              <div className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingService(service)}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                    title="Edit service"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => togglePopular(service.id, service.popular)}
                    className={`p-2 transition-colors duration-200 ${
                      service.popular 
                        ? 'text-yellow-500 hover:text-yellow-600' 
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                    title={service.popular ? 'Remove from popular' : 'Mark as popular'}
                  >
                    <CurrencyRupeeIcon className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  title="Delete service"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <CurrencyRupeeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new service package.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingService) && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setShowAddModal(false);
            setEditingService(null);
          }}
          onSave={() => {
            fetchServices();
            setShowAddModal(false);
            setEditingService(null);
          }}
        />
      )}
    </div>
  );
};

const ServiceModal = ({
  service,
  onClose,
  onSave
}: {
  service: Service | null;
  onClose: () => void;
  onSave: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    category: service?.category || 'photography' as 'photography' | 'videography',
    price: service?.price || 0,
    duration: service?.duration || '',
    description: service?.description || '',
    features: service?.features || [''],
    popular: service?.popular || false
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = service ? `/api/admin/services/${service.id}` : '/api/admin/services';
      const method = service ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          features: formData.features.filter(f => f.trim() !== '')
        }),
      });

      if (response.ok) {
        toast.success(`Service ${service ? 'updated' : 'added'} successfully!`);
        onSave();
      } else {
        toast.error(`Failed to ${service ? 'update' : 'add'} service`);
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {service ? 'Edit Service' : 'Add New Service'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'photography' | 'videography' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="photography">Photography</option>
                  <option value="videography">Videography</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 2 hours, 1 day"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter feature"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Feature</span>
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="popular"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="popular" className="ml-2 block text-sm text-gray-900">
                Mark as popular service
              </label>
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
                disabled={isSaving}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : (service ? 'Update' : 'Add Service')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;