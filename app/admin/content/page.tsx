'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, PhotoIcon, CheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ContentSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  images?: string[];
  stats?: { label: string; value: string }[];
  skills?: { name: string; percentage: number }[];
}

const ContentManagement = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content');
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
      // Set demo data for development
      setSections([
        {
          id: 'hero',
          title: 'Capturing Life\'s Beautiful Moments',
          subtitle: 'Professional Photography & Videography',
          description: 'Creating timeless memories through the lens of creativity and passion.',
          images: ['/images/hero-1.jpg', '/images/hero-2.jpg', '/images/hero-3.jpg']
        },
        {
          id: 'about',
          title: 'About Me',
          subtitle: 'Professional Photographer & Videographer',
          description: 'With over 8 years of experience in photography and videography, I specialize in capturing the essence of every moment. My passion lies in creating visual stories that resonate with emotions and preserve memories for a lifetime.',
          stats: [
            { label: 'Years Experience', value: '8+' },
            { label: 'Projects Done', value: '500+' },
            { label: 'Happy Clients', value: '200+' }
          ],
          skills: [
            { name: 'Wedding Photography', percentage: 95 },
            { name: 'Portrait Photography', percentage: 90 },
            { name: 'Event Photography', percentage: 88 },
            { name: 'Video Production', percentage: 85 }
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionUpdate = async (sectionId: string, updatedData: Partial<ContentSection>) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/content/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setSections(sections.map(section => 
          section.id === sectionId ? { ...section, ...updatedData } : section
        ));
        setEditingSection(null);
        toast.success('Content updated successfully!');
      } else {
        toast.error('Failed to update content');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (sectionId: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('section', sectionId);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await response.json();
        toast.success('Image uploaded successfully!');
        fetchContent(); // Refresh content
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-2">Edit and manage your website content sections.</p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {section.id} Section
              </h2>
              <button
                onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <PencilIcon className="h-4 w-4" />
                <span>{editingSection === section.id ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {editingSection === section.id ? (
              <EditSectionForm
                section={section}
                onSave={(updatedData) => handleSectionUpdate(section.id, updatedData)}
                onImageUpload={(file) => handleImageUpload(section.id, file)}
                isSaving={isSaving}
              />
            ) : (
              <SectionPreview section={section} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SectionPreview = ({ section }: { section: ContentSection }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
        {section.subtitle && (
          <p className="text-primary-600 font-medium">{section.subtitle}</p>
        )}
        {section.description && (
          <p className="text-gray-600 mt-2">{section.description}</p>
        )}
      </div>

      {section.images && section.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {section.images.map((image, index) => (
            <div key={index} className="relative h-32 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`${section.id} image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {section.stats && (
        <div className="grid grid-cols-3 gap-4">
          {section.stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-primary-600">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {section.skills && (
        <div className="space-y-3">
          {section.skills.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                <span className="text-sm text-gray-500">{skill.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${skill.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EditSectionForm = ({
  section,
  onSave,
  onImageUpload,
  isSaving
}: {
  section: ContentSection;
  onSave: (data: Partial<ContentSection>) => void;
  onImageUpload: (file: File) => void;
  isSaving: boolean;
}) => {
  const [formData, setFormData] = useState(section);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {formData.subtitle !== undefined && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      {formData.description !== undefined && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      {formData.images && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Image</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id={`file-${section.id}`}
            />
            <label
              htmlFor={`file-${section.id}`}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors duration-200"
            >
              <PhotoIcon className="h-5 w-5" />
              <span>Choose Image</span>
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckIcon className="h-4 w-4" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </form>
  );
};

export default ContentManagement;