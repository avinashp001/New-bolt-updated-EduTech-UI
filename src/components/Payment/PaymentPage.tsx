// src/components/Payment/PaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DollarSign, CheckCircle, XCircle, Loader2, User, Mail, Phone, CreditCard, ArrowRight, RefreshCcw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [step, setStep] = useState(1); // 1: Plan Confirmation, 2: User Details, 3: Payment, 4: Status
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | null>(null);
  const [paymentMessage, setPaymentMessage] = useState('');

  const planDetails = location.state as { planName: string; price: string; duration: string } | undefined;

  const [customerDetails, setCustomerDetails] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    phone: '', // Phone number is often collected during payment
  });

  useEffect(() => {
    if (!planDetails) {
      navigate('/pricing', { replace: true }); // Redirect if no plan selected
      return;
    }

    // Pre-fill customer details from authenticated user
    if (user) {
      setCustomerDetails(prev => ({
        ...prev,
        name: user.full_name || prev.name,
        email: user.email || prev.email,
      }));
    }

    // Dynamically load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay SDK loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      showError('Payment Error', 'Failed to load payment gateway. Please try again.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [planDetails, user, navigate, showError]);

  if (!planDetails) {
    return null; // Will be redirected by useEffect
  }

  const handleCustomerDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const initiateRazorpayPayment = async () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      showError('Missing Information', 'Please fill in all customer details.');
      return;
    }

    setIsLoading(true);
    setStep(3); // Move to payment processing step

    // In a real application, you would make an API call to your backend
    // to create an order and get an order_id.
    // For this frontend-only example, we'll simulate it.
    const amountInPaise = parseFloat(planDetails.price.replace('₹', '')) * 100; // Razorpay expects amount in smallest currency unit (paise)

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID
      amount: amountInPaise,
      currency: 'INR',
      name: 'EduAI',
      description: `${planDetails.planName} Subscription`,
      image: '/vite.svg', // Your company logo
      prefill: {
        name: customerDetails.name,
        email: customerDetails.email,
        contact: customerDetails.phone,
      },
      notes: {
        plan_name: planDetails.planName,
        user_id: user?.id,
      },
      theme: {
        color: '#3b82f6', // Primary color for the checkout form
      },
      handler: async (response: any) => {
        // This function is called when the payment is successful
        console.log('Payment successful:', response);
        // In a real app, you would send response.razorpay_payment_id,
        // response.razorpay_order_id, and response.razorpay_signature to your backend for verification.
        setPaymentStatus('success');
        setPaymentMessage('Your subscription was successful! Welcome to EduAI.');
        showSuccess('Payment Successful', 'Your plan has been activated!');
        setIsLoading(false);
        setStep(4); // Move to status step
      },
      modal: {
        ondismiss: () => {
          // This function is called when the payment modal is closed without completing payment
          console.log('Payment modal dismissed');
          setPaymentStatus('failed');
          setPaymentMessage('Payment was cancelled or failed. Please try again.');
          showError('Payment Cancelled', 'You closed the payment window.');
          setIsLoading(false);
          setStep(4); // Move to status step
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      setPaymentStatus('failed');
      setPaymentMessage('Could not initiate payment. Please try again.');
      showError('Payment Error', 'Failed to open payment gateway.');
      setIsLoading(false);
      setStep(4); // Move to status step
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: // Plan Confirmation
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Confirm Your Plan</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <p className="text-blue-800 text-lg font-semibold">{planDetails.planName}</p>
              <p className="text-blue-700 text-4xl font-bold my-2">{planDetails.price}</p>
              <p className="text-blue-600 text-sm">billed {planDetails.duration}</p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <span>Proceed to Details</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        );
      case 2: // User Details
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Your Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerDetails.name}
                  onChange={handleCustomerDetailsChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerDetails.email}
                  onChange={handleCustomerDetailsChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerDetails.phone}
                  onChange={handleCustomerDetailsChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              onClick={initiateRazorpayPayment}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Proceed to Payment</span>
            </button>
          </div>
        );
      case 3: // Payment Processing
        return (
          <div className="text-center py-12">
            <LoadingSpinner message="Initiating payment..." variant="brain" />
            <p className="text-slate-600 mt-4">Please do not close this window.</p>
          </div>
        );
      case 4: // Payment Status
        return (
          <div className="text-center py-8">
            {paymentStatus === 'success' ? (
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            )}
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              {paymentStatus === 'success' ? 'Payment Successful!' : 'Payment Failed!'}
            </h3>
            <p className="text-slate-600 mb-6">{paymentMessage}</p>
            {paymentStatus === 'success' ? (
              <button
                onClick={() => navigate('/app/dashboard')}
                className="btn-primary flex items-center justify-center space-x-2 mx-auto"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setStep(2)} // Go back to details to retry
                className="btn-secondary flex items-center justify-center space-x-2 mx-auto"
              >
                <span>Try Again</span>
                <RefreshCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Secure Checkout</h2>
          <div className="flex items-center space-x-2 text-slate-500">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Step {step} of 4</span>
          </div>
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
};

export default PaymentPage;
