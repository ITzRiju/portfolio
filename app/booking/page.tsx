'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
}

interface BookingForm {
  serviceId: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventType: string;
  guestCount: string;
  specialRequests: string;
  totalAmount: number;
}

const BookingPage = () => {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    serviceId: '',
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventType: '',
    guestCount: '',
    specialRequests: '',
    totalAmount: 0
  });
  
  const [isLoginMode, setIsLoginMode] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    // Fetch services
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
          
          // Pre-select service if provided in URL
          const serviceId = searchParams.get('service');
          if (serviceId) {
            const service = data.find((s: Service) => s.id === parseInt(serviceId));
            if (service) {
              setSelectedService(service);
              setBookingForm(prev => ({
                ...prev,
                serviceId: serviceId,
                totalAmount: service.price
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    checkAuthStatus();
    fetchServices();
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      
      if (response.ok) {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        toast.success('Logged in successfully!');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupForm)
      });
      
      if (response.ok) {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        toast.success('Account created successfully!');
      } else {
        toast.error('Signup failed');
      }
    } catch (error) {
      toast.error('Signup failed');
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setBookingForm(prev => ({
      ...prev,
      serviceId: service.id.toString(),
      totalAmount: service.price
    }));
    setCurrentStep(2);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create booking
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm)
      });
      
      if (bookingResponse.ok) {
        const booking = await bookingResponse.json();
        
        // Initialize Razorpay payment
        const paymentResponse = await fetch('/api/payment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: booking.id,
            amount: bookingForm.totalAmount
          })
        });
        
        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          
          // Load Razorpay script and open payment modal
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
              amount: paymentData.amount,
              currency: 'INR',
              name: 'PhotoStudio',
              description: selectedService?.name,
              order_id: paymentData.orderId,
              handler: async (response: any) => {
                // Verify payment
                const verifyResponse = await fetch('/api/payment/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    bookingId: booking.id
                  })
                });
                
                if (verifyResponse.ok) {
                  toast.success('Booking confirmed! Payment successful.');
                  setCurrentStep(4);
                } else {
                  toast.error('Payment verification failed');
                }
              },
              prefill: {
                name: bookingForm.name,
                email: bookingForm.email,
                contact: bookingForm.phone
              },
              theme: {
                color: '#0ea5e9'
              }
            };
            
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          };
          document.head.appendChild(script);
        }
      }
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const steps = [
    { number: 1, title: 'Select Service', completed: currentStep > 1 },
    { number: 2, title: 'Event Details', completed: currentStep > 2 },
    { number: 3, title: 'Payment', completed: currentStep > 3 },
    { number: 4, title: 'Confirmation', completed: currentStep > 4 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Book Your Session
            </h1>
            <p className="text-xl text-gray-600">
              Let's capture your special moments together
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.completed || currentStep === step.number
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {step.completed ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step.completed || currentStep === step.number
                      ? 'text-primary-600'
                      : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      step.completed ? 'bg-primary-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Choose Your Service
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleServiceSelect(service)}
                      className="border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-primary-500 hover:shadow-lg transition-all duration-300"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary-600">
                          {formatPrice(service.price)}
                        </span>
                        <span className="text-gray-500">{service.duration}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Event Details */}
            {currentStep === 2 && selectedService && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Event Details
                </h2>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.eventDate}
                        onChange={(e) => setBookingForm({...bookingForm, eventDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={bookingForm.eventTime}
                        onChange={(e) => setBookingForm({...bookingForm, eventTime: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingForm.eventLocation}
                        onChange={(e) => setBookingForm({...bookingForm, eventLocation: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      rows={4}
                      value={bookingForm.specialRequests}
                      onChange={(e) => setBookingForm({...bookingForm, specialRequests: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Any specific requirements or requests..."
                    />
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Booking Confirmed!
                </h2>
                <p className="text-gray-600 mb-8">
                  Thank you for your booking. We'll contact you soon to confirm the details.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Login/Signup Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isLoginMode ? 'Login' : 'Sign Up'}
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {isLoginMode ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-primary-600 hover:text-primary-700"
              >
                {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BookingPage;