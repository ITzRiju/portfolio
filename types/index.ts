// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Admin Types
export interface Admin {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Service Types
export interface Service {
  id: number;
  name: string;
  description: string;
  category: 'photography' | 'videography' | 'editing' | 'other';
  price: number;
  duration: string;
  features: string[];
  image?: string;
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Portfolio Types
export interface PortfolioItem {
  id: number;
  title: string;
  description?: string;
  category: 'wedding' | 'portrait' | 'event' | 'commercial' | 'landscape' | 'other';
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  isFeature: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface Booking {
  id: number;
  userId: number;
  serviceId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventType: string;
  guestCount?: number;
  specialRequests?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  paymentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  service?: Service;
}

// Payment Types
export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  currency: string;
  paymentMethod: 'razorpay' | 'bank_transfer' | 'cash' | 'other';
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// Newsletter Types
export interface NewsletterSubscriber {
  id: number;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
  unsubscribedAt?: string;
}

// Website Content Types
export interface WebsiteSection {
  id: number;
  sectionName: string;
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  isActive: boolean;
  orderIndex: number;
  updatedAt: string;
}

// Settings Types
export interface WebsiteSettings {
  id: number;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  updatedAt: string;
}

// Analytics Types
export interface AnalyticsData {
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
  }[];
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  topPages: {
    page: string;
    views: number;
    uniqueViews: number;
  }[];
  recentBookings: Booking[];
}

// Form Types
export interface BookingFormData {
  serviceId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventType: string;
  guestCount?: number;
  specialRequests?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface AdminLoginFormData {
  username: string;
  password: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Filter Types
export interface BookingFilters {
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PortfolioFilters {
  category?: string;
  type?: string;
  search?: string;
}

export interface ServiceFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: React.ReactNode;
}

export interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// File Upload Types
export interface FileUpload {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  uploadedBy: number;
  createdAt: string;
}

// Activity Log Types
export interface ActivityLog {
  id: number;
  userId?: number;
  adminId?: number;
  action: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalPortfolioItems: number;
  totalUsers: number;
  recentBookings: Booking[];
  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];
}