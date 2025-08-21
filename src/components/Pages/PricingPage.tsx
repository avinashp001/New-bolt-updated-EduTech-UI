// import React, { useState } from 'react';
// import { 
//   Check, 
//   X, 
//   Star, 
//   Crown, 
//   Zap, 
//   Shield, 
//   Users, 
//   Brain,
//   Target,
//   BarChart3,
//   Clock,
//   BookOpen,
//   Award,
//   Rocket,
//   MessageSquare,
//   Phone,
//   Mail,
//   CheckCircle,
//   ArrowRight,
//   Sparkles,
//   Globe,
//   Heart
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import SEOHead from '../SEO/SEOHead';

// const PricingPage: React.FC = () => {
//   const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
//   const [selectedPlan, setSelectedPlan] = useState('student');

//   const plans = [
//     {
//       id: 'free',
//       name: 'Free Trial',
//       price: { monthly: 0, yearly: 0 },
//       description: 'Perfect for getting started',
//       popular: false,
//       features: [
//         { name: 'Basic AI mentor access', included: true },
//         { name: 'Simple study planning', included: true },
//         { name: 'Basic analytics', included: true },
//         { name: 'Upload 5 study materials', included: true },
//         { name: 'Community support', included: true },
//         { name: 'Advanced AI features', included: false },
//         { name: 'Unlimited uploads', included: false },
//         { name: 'Priority support', included: false },
//         { name: 'Advanced analytics', included: false },
//         { name: 'Custom integrations', included: false }
//       ],
//       cta: 'Start Free Trial',
//       color: 'border-slate-200',
//       bgColor: 'bg-white',
//       textColor: 'text-slate-800'
//     },
//     {
//       id: 'student',
//       name: 'Student Plan',
//       price: { monthly: 999, yearly: 9990 },
//       description: 'Most popular for serious students',
//       popular: true,
//       features: [
//         { name: 'Full AI mentor access', included: true },
//         { name: 'Personalized study plans', included: true },
//         { name: 'Advanced analytics', included: true },
//         { name: 'Unlimited material uploads', included: true },
//         { name: 'Performance predictions', included: true },
//         { name: 'Email support', included: true },
//         { name: 'Mobile app access', included: true },
//         { name: 'Priority support', included: false },
//         { name: 'Custom integrations', included: false },
//         { name: 'Dedicated manager', included: false }
//       ],
//       cta: 'Choose Student Plan',
//       color: 'border-blue-500',
//       bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
//       textColor: 'text-blue-800'
//     },
//     {
//       id: 'premium',
//       name: 'Premium Plan',
//       price: { monthly: 1999, yearly: 19990 },
//       description: 'For serious aspirants who want everything',
//       popular: false,
//       features: [
//         { name: 'Everything in Student Plan', included: true },
//         { name: 'Priority AI processing', included: true },
//         { name: 'Advanced performance analytics', included: true },
//         { name: 'Custom study strategies', included: true },
//         { name: 'Priority support (24/7)', included: true },
//         { name: 'Phone support', included: true },
//         { name: 'Expert consultation calls', included: true },
//         { name: 'Custom integrations', included: true },
//         { name: 'Dedicated success manager', included: true },
//         { name: 'Early access to features', included: true }
//       ],
//       cta: 'Choose Premium',
//       color: 'border-purple-500',
//       bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
//       textColor: 'text-purple-800'
//     }
//   ];

//   const institutionalFeatures = [
//     'Bulk student management',
//     'Custom branding options',
//     'Advanced reporting dashboard',
//     'API access for integrations',
//     'Dedicated support team',
//     'Custom AI model training',
//     'White-label solutions',
//     'Enterprise security features'
//   ];

//   const faqs = [
//     {
//       question: 'Can I switch plans anytime?',
//       answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.'
//     },
//     {
//       question: 'Is there a money-back guarantee?',
//       answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact us for a full refund.'
//     },
//     {
//       question: 'What payment methods do you accept?',
//       answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. International payments via PayPal are also supported.'
//     },
//     {
//       question: 'How does the free trial work?',
//       answer: 'The 14-day free trial includes access to core features with some limitations. No credit card required to start.'
//     },
//     {
//       question: 'Do you offer student discounts?',
//       answer: 'Yes! We offer special discounts for students with valid ID. Contact our support team for discount codes.'
//     }
//   ];

//   const getYearlySavings = (monthlyPrice: number) => {
//     const yearlyPrice = monthlyPrice * 10; // 2 months free
//     const monthlyCost = monthlyPrice * 12;
//     return monthlyCost - yearlyPrice;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <SEOHead
//         title="Pricing Plans - Affordable AI-Powered Exam Preparation | EduAI"
//         description="Choose the perfect EduAI plan for your exam preparation needs. Flexible pricing with free trial, student plans, and premium features. 30-day money-back guarantee."
//         keywords="EduAI pricing, exam preparation cost, AI tutoring plans, student subscription, competitive exam preparation pricing"
//       />

//       <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
//             <Star className="w-4 h-4" />
//             <span>Flexible Pricing Plans</span>
//           </div>
//           <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
//             Choose Your 
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Success Plan</span>
//           </h1>
//           <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
//             Flexible pricing designed for students. Start free, upgrade when ready, and achieve your exam goals 
//             with the most advanced AI-powered preparation platform.
//           </p>
//         </div>

//         {/* Billing Toggle */}
//         <div className="flex items-center justify-center mb-12">
//           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-2">
//             <div className="flex items-center space-x-1">
//               <button
//                 onClick={() => setBillingCycle('monthly')}
//                 className={`px-6 py-3 rounded-xl font-medium transition-all ${
//                   billingCycle === 'monthly'
//                     ? 'bg-blue-600 text-white shadow-lg'
//                     : 'text-slate-600 hover:text-slate-800'
//                 }`}
//               >
//                 Monthly
//               </button>
//               <button
//                 onClick={() => setBillingCycle('yearly')}
//                 className={`px-6 py-3 rounded-xl font-medium transition-all relative ${
//                   billingCycle === 'yearly'
//                     ? 'bg-blue-600 text-white shadow-lg'
//                     : 'text-slate-600 hover:text-slate-800'
//                 }`}
//               >
//                 Yearly
//                 <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
//                   Save 17%
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
//           {plans.map((plan) => (
//             <div
//               key={plan.id}
//               className={`relative rounded-3xl shadow-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
//                 plan.popular ? 'border-blue-500 scale-105' : plan.color
//               } ${plan.bgColor}`}
//             >
//               {plan.popular && (
//                 <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                   <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
//                     <Star className="w-4 h-4 inline mr-1" />
//                     Most Popular
//                   </div>
//                 </div>
//               )}

//               <div className="p-8">
//                 {/* Plan Header */}
//                 <div className="text-center mb-8">
//                   <h3 className={`text-2xl font-bold mb-2 ${plan.textColor}`}>{plan.name}</h3>
//                   <p className="text-slate-600 mb-6">{plan.description}</p>
                  
//                   <div className="mb-6">
//                     <div className="flex items-baseline justify-center space-x-2">
//                       <span className="text-4xl font-bold text-slate-800">
//                         ₹{plan.price[billingCycle].toLocaleString()}
//                       </span>
//                       {plan.price[billingCycle] > 0 && (
//                         <span className="text-slate-600">
//                           /{billingCycle === 'monthly' ? 'month' : 'year'}
//                         </span>
//                       )}
//                     </div>
//                     {billingCycle === 'yearly' && plan.price.monthly > 0 && (
//                       <div className="text-green-600 text-sm font-medium mt-2">
//                         Save ₹{getYearlySavings(plan.price.monthly).toLocaleString()} per year
//                       </div>
//                     )}
//                   </div>

//                   <Link
//                     to="/get-started"
//                     className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${
//                       plan.popular
//                         ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
//                         : 'bg-slate-800 text-white hover:bg-slate-700'
//                     }`}
//                   >
//                     <Rocket className="w-5 h-5" />
//                     <span>{plan.cta}</span>
//                   </Link>
//                 </div>

//                 {/* Features List */}
//                 <div className="space-y-4">
//                   {plan.features.map((feature, index) => (
//                     <div key={index} className="flex items-center space-x-3">
//                       {feature.included ? (
//                         <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//                       ) : (
//                         <X className="w-5 h-5 text-slate-300 flex-shrink-0" />
//                       )}
//                       <span className={`text-sm ${
//                         feature.included ? 'text-slate-700' : 'text-slate-400'
//                       }`}>
//                         {feature.name}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Institutional Pricing */}
//         <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 mb-16">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <div className="flex items-center space-x-3 mb-6">
//                 <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
//                   <Users className="w-6 h-6 text-white" />
//                 </div>
//                 <h2 className="text-3xl font-bold text-slate-800">Institutional Plans</h2>
//               </div>
              
//               <p className="text-lg text-slate-600 leading-relaxed mb-8">
//                 Perfect for schools, coaching centers, and educational institutions. 
//                 Get bulk licensing with advanced management features and dedicated support.
//               </p>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                 {institutionalFeatures.map((feature, index) => (
//                   <div key={index} className="flex items-center space-x-3">
//                     <CheckCircle className="w-5 h-5 text-green-600" />
//                     <span className="text-slate-700">{feature}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//                 <Link
//                   to="/contact"
//                   className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
//                 >
//                   <Phone className="w-5 h-5" />
//                   <span>Contact Sales</span>
//                 </Link>
//                 <button className="inline-flex items-center space-x-2 border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all duration-300">
//                   <Mail className="w-5 h-5" />
//                   <span>Request Demo</span>
//                 </button>
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8">
//               <div className="text-center">
//                 <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
//                   <Crown className="w-12 h-12 text-white" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-slate-800 mb-4">Enterprise Features</h3>
//                 <div className="space-y-4">
//                   <div className="bg-white rounded-xl p-4">
//                     <div className="text-3xl font-bold text-orange-600">500+</div>
//                     <div className="text-slate-600">Students per license</div>
//                   </div>
//                   <div className="bg-white rounded-xl p-4">
//                     <div className="text-3xl font-bold text-red-600">24/7</div>
//                     <div className="text-slate-600">Dedicated support</div>
//                   </div>
//                   <div className="bg-white rounded-xl p-4">
//                     <div className="text-3xl font-bold text-purple-600">Custom</div>
//                     <div className="text-slate-600">AI model training</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* FAQ Section */}
//         <div className="mb-16">
//           <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Frequently Asked Questions</h2>
//           <div className="max-w-4xl mx-auto space-y-6">
//             {faqs.map((faq, index) => (
//               <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//                 <h3 className="text-lg font-bold text-slate-800 mb-3">{faq.question}</h3>
//                 <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Money Back Guarantee */}
//         <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-12 text-white text-center mb-16">
//           <Shield className="w-16 h-16 mx-auto mb-6" />
//           <h2 className="text-3xl font-bold mb-4">30-Day Money-Back Guarantee</h2>
//           <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
//             We're confident you'll love EduAI. If you're not completely satisfied within 30 days, 
//             we'll refund your money, no questions asked.
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="flex items-center justify-center space-x-3">
//               <CheckCircle className="w-6 h-6 text-green-200" />
//               <span className="text-green-100">Full refund within 30 days</span>
//             </div>
//             <div className="flex items-center justify-center space-x-3">
//               <CheckCircle className="w-6 h-6 text-green-200" />
//               <span className="text-green-100">No questions asked</span>
//             </div>
//             <div className="flex items-center justify-center space-x-3">
//               <CheckCircle className="w-6 h-6 text-green-200" />
//               <span className="text-green-100">Keep all downloaded materials</span>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA */}
//         <div className="text-center">
//           <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white">
//             <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Exam Preparation?</h2>
//             <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
//               Join 500,000+ students who have revolutionized their study approach with EduAI. 
//               Start your journey to exam success today.
//             </p>
            
//             <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
//               <Link
//                 to="/get-started"
//                 className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
//               >
//                 <Rocket className="w-5 h-5" />
//                 <span>Start Free Trial</span>
//               </Link>
//               <Link
//                 to="/contact"
//                 className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-slate-800 transition-all duration-300 transform hover:scale-105"
//               >
//                 <MessageSquare className="w-5 h-5" />
//                 <span>Talk to Expert</span>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPage;








// // src/components/Pages/PricingPage.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Check,
//   X,
//   Star,
//   Crown,
//   Zap,
//   Shield,
//   Users,
//   Brain,
//   Target,
//   BarChart3,
//   Clock,
//   BookOpen,
//   Award,
//   Rocket,
//   MessageSquare,
//   Phone,
//   Mail,
//   CheckCircle,
//   ArrowRight,
//   Sparkles,
//   Globe,
//   Heart
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import SEOHead from '../SEO/SEOHead';

// // Define the structure for a subscription plan with monthly/yearly options
// interface SubscriptionPlan {
//   id: string;
//   name: string;
//   popular: boolean;
//   monthly: {
//     originalPrice: number;
//     discountedPrice: number;
//     bonus: string[];
//     accessDetails: string;
//   };
//   yearly: {
//     originalPrice: number;
//     discountedPrice: number;
//     bonus: string[];
//     accessDetails: string;
//   };
// }

// const PricingPage: React.FC = () => {
//   const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
//   const [selectedSubscription, setSelectedSubscription] = useState<string>('mains');
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);
//   const [comparisonView, setComparisonView] = useState<'all' | 'free' | 'monthly' | 'yearly'>('all'); // NEW state for comparison table view

//   // Define subscription plans with monthly and yearly pricing
//   const subscriptionPlans: SubscriptionPlan[] = [
//     {
//       id: 'prelims',
//       name: 'For Prelims',
//       popular: false,
//       monthly: {
//         originalPrice: 16800 / 12, // Example monthly original
//         discountedPrice: 4899 / 12, // Example monthly discounted
//         bonus: ['GS Modules of all subjects'],
//         accessDetails: 'Get complete access for 1 month',
//       },
//       yearly: {
//         originalPrice: 16800,
//         discountedPrice: 4899,
//         bonus: ['GS Modules of all subjects', 'Full Mock Test Series'],
//         accessDetails: 'Get complete access for 12 months',
//       },
//     },
//     {
//       id: 'mains',
//       name: 'For Prelims & Mains',
//       popular: true,
//       monthly: {
//         originalPrice: 20400 / 12, // Example monthly original
//         discountedPrice: 5699 / 12, // Example monthly discounted
//         bonus: ['GS Modules of all subjects', 'Current Affairs Monthly Digest'],
//         accessDetails: 'Get complete access for 1 month',
//       },
//       yearly: {
//         originalPrice: 20400,
//         discountedPrice: 5699,
//         bonus: ['GS Modules of all subjects', 'Current Affairs Monthly Digest', 'Personalized Mentorship'],
//         accessDetails: 'Get complete access for 12 months',
//       },
//     },
//   ];

//   // NEW: Features for comparison table
//   const featuresComparison = [
//     { name: 'AI Mentor Access', free: 'Limited', monthly: 'Full', yearly: 'Full' },
//     { name: 'Personalized Study Plans', free: 'Basic', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'Real-time Analytics', free: 'Basic', monthly: 'Advanced', yearly: 'Advanced' },
//     { name: 'Study Material Uploads', free: '5 materials', monthly: 'Unlimited', yearly: 'Unlimited' },
//     { name: 'Performance Predictions', free: 'No', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'AI-Generated Tests', free: 'Limited', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'Study Session Tracking', free: 'Yes', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'Weekly Assessments', free: 'No', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'Priority AI Processing', free: 'No', monthly: 'No', yearly: 'Yes' },
//     { name: 'Custom Study Strategies', free: 'No', monthly: 'No', yearly: 'Yes' },
//     { name: 'Expert Consultation Calls', free: 'No', monthly: 'No', yearly: 'Yes' },
//     { name: 'Dedicated Success Manager', free: 'No', monthly: 'No', yearly: 'Yes' },
//     { name: 'Early Access to Features', free: 'No', monthly: 'No', yearly: 'Yes' },
//     { name: 'Community Support', free: 'Yes', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'Email Support', free: 'No', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'Phone Support', free: 'No', monthly: 'No', yearly: 'Yes' },
//     { name: 'Mobile App Access', free: 'No', monthly: 'Yes', yearly: 'Yes' },
//   ];


//   // Find the currently selected plan based on ID
//   const currentPlan = subscriptionPlans.find(plan => plan.id === selectedSubscription);
//   // Get the details for the current billing cycle
//   const currentPlanDetails = currentPlan ? (billingCycle === 'monthly' ? currentPlan.monthly : currentPlan.yearly) : null;

//   // Function to load Razorpay script
//   useEffect(() => {
//     const loadRazorpayScript = () => {
//       if (window.Razorpay && !razorpayLoaded) {
//         setRazorpayLoaded(true);
//         return;
//       }
//       if (document.getElementById('razorpay-checkout-script')) {
//         setRazorpayLoaded(true);
//         return;
//       }

//       const script = document.createElement('script');
//       script.id = 'razorpay-checkout-script';
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.async = true;
//       script.onload = () => {
//         setRazorpayLoaded(true);
//       };
//       script.onerror = () => {
//         console.error('Failed to load Razorpay script.');
//         alert('Failed to load payment gateway. Please try again.');
//         document.body.style.overflow = ''; // Reset overflow on script load error
//       };
//       document.body.appendChild(script);
//     };

//     loadRazorpayScript();

//     // Cleanup effect to ensure overflow is reset on component unmount
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [razorpayLoaded]);

//   // Function to display Razorpay checkout
//   const displayRazorpay = () => {
//     if (!razorpayLoaded || !window.Razorpay) {
//       alert('Payment gateway not loaded yet. Please wait a moment and try again.');
//       return;
//     }

//     if (!currentPlanDetails) {
//       alert('Please select a subscription plan.');
//       return;
//     }

//     // IMPORTANT: In a real application, the order_id should be generated on your backend.
//     // This is a placeholder for demonstration purposes.
//     const orderId = `order_${Date.now()}`; // Mock order ID

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID
//       amount: currentPlanDetails.discountedPrice * 100, // Amount in paisa
//       currency: 'INR',
//       name: 'EduAI',
//       description: `${currentPlan.name} ${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
//       order_id: orderId, // Replace with actual order ID from backend
//       handler: function (response: any) {
//         // This function is called when the payment is successful
//         alert('Payment Successful! Payment ID: ' + response.razorpay_payment_id);
//         document.body.style.overflow = ''; // Reset overflow on success
//       },
//       prefill: {
//         name: 'Student Name', // Replace with actual user name
//         email: 'student@example.com', // Replace with actual user email
//         contact: '9999999999', // Replace with actual user contact
//       },
//       notes: {
//         subscription_plan: currentPlan.id,
//         billing_cycle: billingCycle,
//       },
//       theme: {
//         color: '#3B82F6', // Primary color for the checkout form
//       },
//       modal: {
//         ondismiss: function() {
//           // This function is called when the payment modal is closed
//           alert('Payment process cancelled.');
//           document.body.style.overflow = ''; // Reset overflow on dismiss
//         }
//       }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();

//     // Fallback to reset overflow if modal doesn't appear after a short delay
//     setTimeout(() => {
//       const razorpayModal = document.querySelector('.razorpay-backdrop'); // Common class for Razorpay modal backdrop
//       if (!razorpayModal) {
//         console.warn('Razorpay modal did not appear. Resetting body overflow.');
//         document.body.style.overflow = '';
//       }
//     }, 500); // Check after 500ms
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <SEOHead
//         title="Pricing Plans - Affordable AI-Powered Exam Preparation | EduAI"
//         description="Choose the perfect EduAI plan for your exam preparation needs. Flexible pricing with free trial, student plans, and premium features. 30-day money-back guarantee."
//         keywords="EduAI pricing, exam preparation cost, AI tutoring plans, student subscription, competitive exam preparation pricing"
//       />

//       <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
//             <Star className="w-4 h-4" />
//             <span>Flexible Pricing Plans</span>
//           </div>
//           <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
//             Choose Your
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Success Plan</span>
//           </h1>
//           <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
//             Unlock your full potential with our AI-powered exam preparation. Select the plan that best fits your goals.
//           </p>
//         </div>

//         {/* NEW: Comparison Table Section */}
//         <div className="mb-12 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//           <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Compare Our Plans</h2>

//           {/* Comparison View Toggle */}
//           <div className="flex justify-center mb-6">
//             <div className="bg-slate-100 rounded-full p-1 flex space-x-1">
//               <button
//                 onClick={() => setComparisonView('all')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   comparisonView === 'all' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'
//                 }`}
//               >
//                 All Plans
//               </button>
//               <button
//                 onClick={() => setComparisonView('free')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   comparisonView === 'free' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'
//                 }`}
//               >
//                 Free
//               </button>
//               <button
//                 onClick={() => setComparisonView('monthly')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   comparisonView === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'
//                 }`}
//               >
//                 Monthly
//               </button>
//               <button
//                 onClick={() => setComparisonView('yearly')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   comparisonView === 'yearly' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'
//                 }`}
//               >
//                 Yearly
//               </button>
//             </div>
//           </div>

//           {/* Comparison Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50">
//                   <th className="p-3 text-sm font-semibold text-slate-700 rounded-tl-lg">Feature</th>
//                   {(comparisonView === 'all' || comparisonView === 'free') && (
//                     <th className="p-3 text-sm font-semibold text-slate-700">Free</th>
//                   )}
//                   {(comparisonView === 'all' || comparisonView === 'monthly') && (
//                     <th className="p-3 text-sm font-semibold text-slate-700">For Prelims (Monthly)</th>
//                   )}
//                   {(comparisonView === 'all' || comparisonView === 'yearly') && (
//                     <th className="p-3 text-sm font-semibold text-slate-700 rounded-tr-lg">For Prelims & Mains (Yearly)</th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {featuresComparison.map((feature, index) => (
//                   <tr key={index} className="border-t border-slate-200 hover:bg-slate-50">
//                     <td className="p-3 text-sm text-slate-800 font-medium">{feature.name}</td>
//                     {(comparisonView === 'all' || comparisonView === 'free') && (
//                       <td className="p-3 text-center">
//                         {feature.free === 'Yes' ? (
//                           <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
//                         ) : feature.free === 'No' ? (
//                           <X className="w-5 h-5 text-red-500 mx-auto" />
//                         ) : (
//                           <span className="text-sm text-slate-600">{feature.free}</span>
//                         )}
//                       </td>
//                     )}
//                     {(comparisonView === 'all' || comparisonView === 'monthly') && (
//                       <td className="p-3 text-center">
//                         {feature.monthly === 'Yes' ? (
//                           <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
//                         ) : feature.monthly === 'No' ? (
//                           <X className="w-5 h-5 text-red-500 mx-auto" />
//                         ) : (
//                           <span className="text-sm text-slate-600">{feature.monthly}</span>
//                         )}
//                       </td>
//                     )}
//                     {(comparisonView === 'all' || comparisonView === 'yearly') && (
//                       <td className="p-3 text-center">
//                         {feature.yearly === 'Yes' ? (
//                           <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
//                         ) : feature.yearly === 'No' ? (
//                           <X className="w-5 h-5 text-red-500 mx-auto" />
//                         ) : (
//                           <span className="text-sm text-slate-600">{feature.yearly}</span>
//                         )}
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Billing Cycle Selector (Monthly/Yearly) */}
//         <div className="flex justify-center mb-8">
//           <div className="bg-white rounded-full p-1 shadow-md border border-slate-200">
//             <div className="flex space-x-1">
//               <button
//                 onClick={() => setBillingCycle('monthly')}
//                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                   billingCycle === 'monthly'
//                     ? 'bg-blue-600 text-white shadow-lg'
//                     : 'text-slate-700 hover:bg-slate-100'
//                   }`}
//               >
//                 Monthly
//               </button>
//               <button
//                 onClick={() => setBillingCycle('yearly')}
//                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                   billingCycle === 'yearly'
//                     ? 'bg-blue-600 text-white shadow-lg'
//                     : 'text-slate-700 hover:bg-slate-100'
//                   }`}
//               >
//                 Yearly
//                 {/* Display save percentage only for yearly plan if it offers savings */}
//                 {currentPlan && currentPlan.yearly.discountedPrice < (currentPlan.monthly.discountedPrice * 12) && (
//                   <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
//                     Save {Math.round(((currentPlan.monthly.discountedPrice * 12 - currentPlan.yearly.discountedPrice) / (currentPlan.monthly.discountedPrice * 12)) * 100)}%
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Subscription Options */}
//         <div className="space-y-6 mb-12">
//           {subscriptionPlans.map(plan => {
//             const planDetails = billingCycle === 'monthly' ? plan.monthly : plan.yearly;
//             const isPopular = plan.popular && billingCycle === 'yearly'; // Only show popular for yearly
//             const savePercentage = plan.yearly.discountedPrice < (plan.monthly.discountedPrice * 12)
//               ? Math.round(((plan.monthly.discountedPrice * 12 - plan.yearly.discountedPrice) / (plan.monthly.discountedPrice * 12)) * 100)
//               : 0;

//             return (
//               <label
//                 key={plan.id}
//                 htmlFor={plan.id}
//                 className={`relative block bg-white rounded-2xl shadow-lg border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
//                   selectedSubscription === plan.id ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   id={plan.id}
//                   name="subscription"
//                   value={plan.id}
//                   checked={selectedSubscription === plan.id}
//                   onChange={() => setSelectedSubscription(plan.id)}
//                   className="sr-only" // Hide default radio button
//                 />
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center">
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
//                       selectedSubscription === plan.id ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
//                     }`}>
//                       {selectedSubscription === plan.id && <Check className="w-3 h-3 text-white" />}
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
//                       <p className="text-slate-500 text-sm mt-1">{planDetails.accessDetails}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-slate-500 line-through">₹{planDetails.originalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
//                     <p className="text-2xl font-bold text-slate-800">₹{planDetails.discountedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex items-center justify-between">
//                   <div className="text-sm text-slate-600">
//                     <span className="font-bold">BONUS:</span> {planDetails.bonus.join(', ')}
//                   </div>
//                   {isPopular && (
//                     <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
//                       MOST POPULAR
//                     </span>
//                   )}
//                   {billingCycle === 'yearly' && savePercentage > 0 && (
//                     <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
//                       Save {savePercentage}%
//                     </span>
//                   )}
//                 </div>
//               </label>
//             );
//           })}
//         </div>

//         {/* Enrol Now Button */}
//         <div className="text-center mb-12">
//           <button
//             onClick={displayRazorpay}
//             disabled={!currentPlanDetails || !razorpayLoaded}
//             className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-2xl hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Enrol Now
//           </button>
//           <p className="text-slate-500 text-sm mt-4">
//             By proceeding, you agree to Razorpay's <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Notice</Link> and our <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>.
//           </p>
//         </div>

//         {/* FAQ Section (Existing content, kept for completeness) */}
//         <div className="mb-16">
//           <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Frequently Asked Questions</h2>
//           <div className="max-w-4xl mx-auto space-y-6">
//             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//               <h3 className="text-lg font-bold text-slate-800 mb-3">Can I switch plans anytime?</h3>
//               <p className="text-slate-600 leading-relaxed">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.</p>
//             </div>
//             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//               <h3 className="text-lg font-bold text-slate-800 mb-3">Is there a money-back guarantee?</h3>
//               <p className="text-slate-600 leading-relaxed">We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.</p>
//             </div>
//             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//               <h3 className="text-lg font-bold text-slate-800 mb-3">What payment methods do you accept?</h3>
//               <p className="text-slate-600 leading-relaxed">We accept all major credit/debit cards, UPI, net banking, and digital wallets. International payments via PayPal are also supported.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA (Existing content, kept for completeness) */}
//         <div className="text-center">
//           <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white">
//             <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Exam Preparation?</h2>
//             <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
//               Join 500,000+ students who have revolutionized their study approach with EduAI.
//               Start your journey to exam success today.
//             </p>

//             <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
//               <Link
//                 to="/get-started"
//                 className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
//               >
//                 <Rocket className="w-5 h-5" />
//                 <span>Start Free Trial</span>
//               </Link>
//               <Link
//                 to="/contact"
//                 className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-slate-800 transition-all duration-300 transform hover:scale-105"
//               >
//                 <MessageSquare className="w-5 h-5" />
//                 <span>Talk to Expert</span>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPage;






















// // src/components/Pages/PricingPage.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Check,
//   X,
//   Star,
//   Crown,
//   Zap,
//   Shield,
//   Users,
//   Brain,
//   Target,
//   BarChart3,
//   Clock,
//   BookOpen,
//   Award,
//   Rocket,
//   MessageSquare,
//   Phone,
//   Mail,
//   CheckCircle,
//   ArrowRight,
//   Sparkles,
//   Globe,
//   Heart
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import SEOHead from '../SEO/SEOHead';

// // Define the structure for a subscription plan with monthly/yearly options
// interface SubscriptionPlan {
//   id: string;
//   name: string;
//   popular: boolean;
//   monthly: {
//     originalPrice: number;
//     discountedPrice: number;
//     bonus: string[];
//     accessDetails: string;
//   };
//   yearly: {
//     originalPrice: number;
//     discountedPrice: number;
//     bonus: string[];
//     accessDetails: string;
//   };
// }

// const PricingPage: React.FC = () => {
//   const [billingCycle, setBillingCycle] = useState<'free' | 'monthly' | 'yearly'>('free'); // NEW: Default to 'free'
//   const [selectedSubscription, setSelectedSubscription] = useState<string>('free'); // NEW: Default to 'free'
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);
//   const [comparisonView, setComparisonView] = useState<'all' | 'free' | 'monthly' | 'yearly'>('all'); // NEW state for comparison table view

//   // Define subscription plans with monthly and yearly pricing
//   const subscriptionPlans: SubscriptionPlan[] = [
//     // NEW: Free Plan
//     {
//       id: 'free',
//       name: 'Free Plan',
//       popular: false,
//       monthly: { // Using monthly structure for free plan details
//         originalPrice: 0,
//         discountedPrice: 0,
//         bonus: ['Basic AI mentor access', 'Limited study planning', 'Community support'],
//         accessDetails: 'Always Free',
//       },
//       yearly: { // Using yearly structure for free plan details
//         originalPrice: 0,
//         discountedPrice: 0,
//         bonus: ['Basic AI mentor access', 'Limited study planning', 'Community support'],
//         accessDetails: 'Always Free',
//       },
//     },
//     {
//       id: 'prelims',
//       name: 'For Prelims',
//       popular: false,
//       monthly: {
//         originalPrice: 16800 / 12, // Example monthly original
//         discountedPrice: 4899 / 12, // Example monthly discounted
//         bonus: ['GS Modules of all subjects'],
//         accessDetails: 'Get complete access for 1 month',
//       },
//       yearly: {
//         originalPrice: 16800,
//         discountedPrice: 4899,
//         bonus: ['GS Modules of all subjects', 'Full Mock Test Series'],
//         accessDetails: 'Get complete access for 12 months',
//       },
//     },
//     {
//       id: 'mains',
//       name: 'For Prelims & Mains',
//       popular: true,
//       monthly: {
//         originalPrice: 20400 / 12, // Example monthly original
//         discountedPrice: 5699 / 12, // Example monthly discounted
//         bonus: ['GS Modules of all subjects', 'Current Affairs Monthly Digest'],
//         accessDetails: 'Get complete access for 1 month',
//       },
//       yearly: {
//         originalPrice: 20400,
//         discountedPrice: 5699,
//         bonus: ['GS Modules of all subjects', 'Current Affairs Monthly Digest', 'Personalized Mentorship'],
//         accessDetails: 'Get complete access for 12 months',
//       },
//     },
//   ];

//   // NEW: Features for comparison table
//   const featuresComparison = [
//     { name: 'AI Mentor Access', free: 'Limited', monthly: 'Full', yearly: 'Full' },
//     { name: 'Personalized Study Plans', free: 'Basic', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'Real-time Analytics', free: 'Basic', monthly: 'Advanced', yearly: 'Advanced' },
//     { name: 'Study Material Uploads', free: '5 materials', monthly: 'Unlimited', yearly: 'Unlimited' },
//     { name: 'Performance Predictions', free: 'No', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'AI-Generated Tests', free: 'Limited', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'Study Session Tracking', free: 'Yes', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'Weekly Assessments', free: 'No', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'Priority AI Processing', free: 'No', monthly: 'No', yearly: 'Yes' },
//     { name: 'Custom Study Strategies', free: 'No', monthly: 'No', yearly: 'Yes' },
//     { name: 'Expert Consultation Calls', free: 'No', monthly: 'No', yearly: 'Yes' },
//     { name: 'Dedicated Success Manager', free: 'No', monthly: 'No', yearly: 'Yes' },
//     { name: 'Early Access to Features', free: 'No', monthly: 'No', yearly: 'Yes' },
//     { name: 'Community Support', free: 'Yes', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'Email Support', free: 'No', monthly: 'Yes', yearly: 'Yes' },
//     { name: 'Phone Support', free: 'No', monthly: 'No', yearly: 'Yes' },
//     { name: 'Mobile App Access', free: 'No', monthly: 'Yes', yearly: 'Yes' },
//   ];


//   // Find the currently selected plan based on ID
//   const currentPlan = subscriptionPlans.find(plan => plan.id === selectedSubscription);
//   // Get the details for the current billing cycle
//   const currentPlanDetails = currentPlan ? (billingCycle === 'monthly' ? currentPlan.monthly : currentPlan.yearly) : null;

//   // Function to load Razorpay script
//   useEffect(() => {
//     const loadRazorpayScript = () => {
//       if (window.Razorpay && !razorpayLoaded) {
//         setRazorpayLoaded(true);
//         return;
//       }
//       if (document.getElementById('razorpay-checkout-script')) {
//         setRazorpayLoaded(true);
//         return;
//       }

//       const script = document.createElement('script');
//       script.id = 'razorpay-checkout-script';
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.async = true;
//       script.onload = () => {
//         setRazorpayLoaded(true);
//       };
//       script.onerror = () => {
//         console.error('Failed to load Razorpay script.');
//         alert('Failed to load payment gateway. Please try again.');
//         document.body.style.overflow = ''; // Reset overflow on script load error
//       };
//       document.body.appendChild(script);
//     };

//     loadRazorpayScript();

//     // Cleanup effect to ensure overflow is reset on component unmount
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [razorpayLoaded]);

//   // Function to display Razorpay checkout
//   const displayRazorpay = () => {
//     if (!razorpayLoaded || !window.Razorpay) {
//       alert('Payment gateway not loaded yet. Please wait a moment and try again.');
//       return;
//     }

//     if (!currentPlanDetails) {
//       alert('Please select a subscription plan.');
//       return;
//     }

//     // IMPORTANT: In a real application, the order_id should be generated on your backend.
//     // This is a placeholder for demonstration purposes.
//     const orderId = `order_${Date.now()}`; // Mock order ID

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID
//       amount: currentPlanDetails.discountedPrice * 100, // Amount in paisa
//       currency: 'INR',
//       name: 'EduAI',
//       description: `${currentPlan.name} ${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
//       order_id: orderId, // Replace with actual order ID from backend
//       handler: function (response: any) {
//         // This function is called when the payment is successful
//         alert('Payment Successful! Payment ID: ' + response.razorpay_payment_id);
//         document.body.style.overflow = ''; // Reset overflow on success
//       },
//       prefill: {
//         name: 'Student Name', // Replace with actual user name
//         email: 'student@example.com', // Replace with actual user email
//         contact: '9999999999', // Replace with actual user contact
//       },
//       notes: {
//         subscription_plan: currentPlan.id,
//         billing_cycle: billingCycle,
//       },
//       theme: {
//         color: '#3B82F6', // Primary color for the checkout form
//       },
//       modal: {
//         ondismiss: function() {
//           // This function is called when the payment modal is closed
//           alert('Payment process cancelled.');
//           document.body.style.overflow = ''; // Reset overflow on dismiss
//         }
//       }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();

//     // Fallback to reset overflow if modal doesn't appear after a short delay
//     setTimeout(() => {
//       const razorpayModal = document.querySelector('.razorpay-backdrop'); // Common class for Razorpay modal backdrop
//       if (!razorpayModal) {
//         console.warn('Razorpay modal did not appear. Resetting body overflow.');
//         document.body.style.overflow = '';
//       }
//     }, 500); // Check after 500ms
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <SEOHead
//         title="Pricing Plans - Affordable AI-Powered Exam Preparation | EduAI"
//         description="Choose the perfect EduAI plan for your exam preparation needs. Flexible pricing with free trial, student plans, and premium features. 30-day money-back guarantee."
//         keywords="EduAI pricing, exam preparation cost, AI tutoring plans, student subscription, competitive exam preparation pricing"
//       />

//       <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
//             <Star className="w-4 h-4" />
//             <span>Flexible Pricing Plans</span>
//           </div>
//           <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
//             Choose Your
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Success Plan</span>
//           </h1>
//           <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
//             Unlock your full potential with our AI-powered exam preparation. Select the plan that best fits your goals.
//           </p>
//         </div>

//         {/* NEW: Comparison Table Section */}
//         <div className="mb-12 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//           <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Compare Our Plans</h2>

//           {/* Comparison View Toggle */}
//           <div className="flex justify-center mb-6">
//             <div className="bg-slate-100 rounded-full p-1 flex space-x-1">
//               <button
//                 onClick={() => setComparisonView('all')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   comparisonView === 'all' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'
//                 }`}
//               >
//                 All Plans
//               </button>
//               <button
//                 onClick={() => setComparisonView('free')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   comparisonView === 'free' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'
//                 }`}
//               >
//                 Free
//               </button>
//               <button
//                 onClick={() => setComparisonView('monthly')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   comparisonView === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'
//                 }`}
//               >
//                 Monthly
//               </button>
//               <button
//                 onClick={() => setComparisonView('yearly')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   comparisonView === 'yearly' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'
//                 }`}
//               >
//                 Yearly
//               </button>
//             </div>
//           </div>

//           {/* Comparison Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50">
//                   <th className="p-3 text-sm font-semibold text-slate-700 rounded-tl-lg">Feature</th>
//                   {(comparisonView === 'all' || comparisonView === 'free') && (
//                     <th className="p-3 text-sm font-semibold text-slate-700">Free</th>
//                   )}
//                   {(comparisonView === 'all' || comparisonView === 'monthly') && (
//                     <th className="p-3 text-sm font-semibold text-slate-700">For Prelims (Monthly)</th>
//                   )}
//                   {(comparisonView === 'all' || comparisonView === 'yearly') && (
//                     <th className="p-3 text-sm font-semibold text-slate-700 rounded-tr-lg">For Prelims & Mains (Yearly)</th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {featuresComparison.map((feature, index) => (
//                   <tr key={index} className="border-t border-slate-200 hover:bg-slate-50">
//                     <td className="p-3 text-sm text-slate-800 font-medium">{feature.name}</td>
//                     {(comparisonView === 'all' || comparisonView === 'free') && (
//                       <td className="p-3 text-center">
//                         {feature.free === 'Yes' ? (
//                           <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
//                         ) : feature.free === 'No' ? (
//                           <X className="w-5 h-5 text-red-500 mx-auto" />
//                         ) : (
//                           <span className="text-sm text-slate-600">{feature.free}</span>
//                         )}
//                       </td>
//                     )}
//                     {(comparisonView === 'all' || comparisonView === 'monthly') && (
//                       <td className="p-3 text-center">
//                         {feature.monthly === 'Yes' ? (
//                           <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
//                         ) : feature.monthly === 'No' ? (
//                           <X className="w-5 h-5 text-red-500 mx-auto" />
//                         ) : (
//                           <span className="text-sm text-slate-600">{feature.monthly}</span>
//                         )}
//                       </td>
//                     )}
//                     {(comparisonView === 'all' || comparisonView === 'yearly') && (
//                       <td className="p-3 text-center">
//                         {feature.yearly === 'Yes' ? (
//                           <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
//                         ) : feature.yearly === 'No' ? (
//                           <X className="w-5 h-5 text-red-500 mx-auto" />
//                         ) : (
//                           <span className="text-sm text-slate-600">{feature.yearly}</span>
//                         )}
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Billing Cycle Selector (Free/Monthly/Yearly) */}
//         <div className="flex justify-center mb-8">
//           <div className="bg-white rounded-full p-1 shadow-md border border-slate-200">
//             <div className="flex space-x-1">
//               {/* NEW: Free button */}
//               <button
//                 onClick={() => {
//                   setBillingCycle('free');
//                   setSelectedSubscription('free'); // Select the free plan when 'Free' is clicked
//                 }}
//                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                   billingCycle === 'free'
//                     ? 'bg-blue-600 text-white shadow-lg'
//                     : 'text-slate-700 hover:bg-slate-100'
//                   }`}
//               >
//                 Free
//               </button>
//               <button
//                 onClick={() => setBillingCycle('monthly')}
//                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                   billingCycle === 'monthly'
//                     ? 'bg-blue-600 text-white shadow-lg'
//                     : 'text-slate-700 hover:bg-slate-100'
//                   }`}
//               >
//                 Monthly
//               </button>
//               <button
//                 onClick={() => setBillingCycle('yearly')}
//                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
//                   billingCycle === 'yearly'
//                     ? 'bg-blue-600 text-white shadow-lg'
//                     : 'text-slate-700 hover:bg-slate-100'
//                   }`}
//               >
//                 Yearly
//                 {/* Display save percentage only for yearly plan if it offers savings */}
//                 {currentPlan && currentPlan.yearly.discountedPrice < (currentPlan.monthly.discountedPrice * 12) && (
//                   <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
//                     Save {Math.round(((currentPlan.monthly.discountedPrice * 12 - currentPlan.yearly.discountedPrice) / (currentPlan.monthly.discountedPrice * 12)) * 100)}%
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Subscription Options */}
//         <div className="space-y-6 mb-12">
//           {subscriptionPlans.map(plan => {
//             // Only render the free plan if billingCycle is 'free'
//             if (plan.id === 'free' && billingCycle !== 'free') {
//               return null;
//             }
//             // Only render paid plans if billingCycle is 'monthly' or 'yearly'
//             if (plan.id !== 'free' && billingCycle === 'free') {
//               return null;
//             }

//             const planDetails = billingCycle === 'monthly' ? plan.monthly : plan.yearly;
//             // For the free plan, always use its 'monthly' details as the source of truth
//             const effectivePlanDetails = plan.id === 'free' ? plan.monthly : planDetails;

//             const isPopular = plan.popular && billingCycle === 'yearly'; // Only show popular for yearly
//             const savePercentage = plan.id !== 'free' && plan.yearly.discountedPrice < (plan.monthly.discountedPrice * 12)
//               ? Math.round(((plan.monthly.discountedPrice * 12 - plan.yearly.discountedPrice) / (plan.monthly.discountedPrice * 12)) * 100)
//               : 0;

//             return (
//               <label
//                 key={plan.id}
//                 htmlFor={plan.id}
//                 className={`relative block bg-white rounded-2xl shadow-lg border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
//                   selectedSubscription === plan.id ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   id={plan.id}
//                   name="subscription"
//                   value={plan.id}
//                   checked={selectedSubscription === plan.id}
//                   onChange={() => setSelectedSubscription(plan.id)}
//                   className="sr-only" // Hide default radio button
//                 />
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center">
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
//                       selectedSubscription === plan.id ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
//                     }`}>
//                       {selectedSubscription === plan.id && <Check className="w-3 h-3 text-white" />}
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
//                       <p className="text-slate-500 text-sm mt-1">{effectivePlanDetails.accessDetails}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     {effectivePlanDetails.originalPrice > 0 && (
//                       <p className="text-slate-500 line-through">₹{effectivePlanDetails.originalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
//                     )}
//                     <p className="text-2xl font-bold text-slate-800">
//                       {effectivePlanDetails.discountedPrice === 0 ? 'Free' : `₹${effectivePlanDetails.discountedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex items-center justify-between">
//                   <div className="text-sm text-slate-600">
//                     <span className="font-bold">BONUS:</span> {effectivePlanDetails.bonus.join(', ')}
//                   </div>
//                   {isPopular && (
//                     <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
//                       MOST POPULAR
//                     </span>
//                   )}
//                   {plan.id !== 'free' && billingCycle === 'yearly' && savePercentage > 0 && (
//                     <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
//                       Save {savePercentage}%
//                     </span>
//                   )}
//                 </div>
//               </label>
//             );
//           })}
//         </div>

//         {/* Enrol Now Button */}
//         <div className="text-center mb-12">
//           {selectedSubscription === 'free' ? (
//             <Link
//               to="/get-started" // Redirect to get-started for free plan
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-2xl hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
//             >
//               Get Started Free
//             </Link>
//           ) : (
//             <button
//               onClick={displayRazorpay}
//               disabled={!currentPlanDetails || !razorpayLoaded}
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-2xl hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Enrol Now
//             </button>
//           )}
//           <p className="text-slate-500 text-sm mt-4">
//             By proceeding, you agree to Razorpay's <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Notice</Link> and our <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>.
//           </p>
//         </div>

//         {/* FAQ Section (Existing content, kept for completeness) */}
//         <div className="mb-16">
//           <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Frequently Asked Questions</h2>
//           <div className="max-w-4xl mx-auto space-y-6">
//             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//               <h3 className="text-lg font-bold text-slate-800 mb-3">Can I switch plans anytime?</h3>
//               <p className="text-slate-600 leading-relaxed">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.</p>
//             </div>
//             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//               <h3 className="text-lg font-bold text-slate-800 mb-3">Is there a money-back guarantee?</h3>
//               <p className="text-slate-600 leading-relaxed">We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.</p>
//             </div>
//             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//               <h3 className="text-lg font-bold text-slate-800 mb-3">What payment methods do you accept?</h3>
//               <p className="text-slate-600 leading-relaxed">We accept all major credit/debit cards, UPI, net banking, and digital wallets. International payments via PayPal are also supported.</p>
//             </div>
//           </div>
//         </div>

//         {/* Final CTA (Existing content, kept for completeness) */}
//         <div className="text-center">
//           <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white">
//             <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Exam Preparation?</h2>
//             <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
//               Join 500,000+ students who have revolutionized their study approach with EduAI.
//               Start your journey to exam success today.
//             </p>

//             <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
//               <Link
//                 to="/get-started"
//                 className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
//               >
//                 <Rocket className="w-5 h-5" />
//                 <span>Start Free Trial</span>
//               </Link>
//               <Link
//                 to="/contact"
//                 className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-slate-800 transition-all duration-300 transform hover:scale-105"
//               >
//                 <MessageSquare className="w-5 h-5" />
//                 <span>Talk to Expert</span>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPage;

















// // src/components/Pages/PricingPage.tsx
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { CheckCircle, DollarSign, Star, Award, Zap, Users, TrendingUp, Shield, XCircle, ChevronDown } from 'lucide-react';
// import SEOHead from '../SEO/SEOHead';

// const PricingPage: React.FC = () => {
//   const [isAnnualBilling, setIsAnnualBilling] = useState(false);

//   const pricingPlans = [
//     {
//       name: 'Free Plan',
//       monthlyPrice: '₹0',
//       annualPrice: '₹0',
//       duration: 'forever',
//       features: [
//         'Basic AI Study Mentor access',
//         'Limited study plan generation',
//         'Basic progress tracking',
//         'Access to core course materials',
//         'Community support'
//       ],
//       buttonText: 'Get Started Free',
//       buttonLink: '/get-started',
//       highlight: false,
//       icon: Users,
//       color: 'text-slate-600'
//     },
//     {
//       name: 'Student Pro',
//       monthlyPrice: '₹499',
//       annualPrice: '₹4999', // Approx ₹416/month, saving ~16%
//       savePercentage: 16,
//       duration: 'per month',
//       features: [
//         'Unlimited AI Study Mentor',
//         'Advanced personalized study plans',
//         'Real-time analytics & insights',
//         'Full course library access',
//         'Priority email support',
//         'Weekly performance reports',
//         'Ad-free experience'
//       ],
//       buttonText: 'Start 7-Day Free Trial',
//       buttonLink: '/payment',
//       highlight: true,
//       icon: Star,
//       color: 'text-blue-600'
//     },
//     {
//       name: 'Premium Plus',
//       monthlyPrice: '₹999',
//       annualPrice: '₹9999', // Approx ₹833/month, saving ~16%
//       savePercentage: 16,
//       duration: 'per month',
//       features: [
//         'All Student Pro features',
//         'Dedicated academic advisor (1-on-1 sessions)',
//         'Exclusive masterclasses & workshops',
//         'Early access to new AI features',
//         'Personalized exam strategy sessions',
//         '24/7 chat support',
//         'Offline content access'
//       ],
//       buttonText: 'Upgrade to Premium',
//       buttonLink: '/payment',
//       highlight: false,
//       icon: Award,
//       color: 'text-purple-600'
//     }
//   ];

//   const featureComparison = [
//     { feature: 'AI Study Mentor Access', free: true, studentPro: true, premiumPlus: true, description: 'Get guidance from your AI mentor.' },
//     { feature: 'Unlimited AI Mentor Interactions', free: false, studentPro: true, premiumPlus: true, description: 'Unlimited questions and guidance from AI mentor.' },
//     { feature: 'Personalized Study Plans', free: 'Limited', studentPro: true, premiumPlus: true, description: 'AI-generated study schedules tailored to your needs.' },
//     { feature: 'Real-time Analytics & Insights', free: 'Basic', studentPro: true, premiumPlus: true, description: 'Track your progress and performance with detailed analytics.' },
//     { feature: 'Full Course Library Access', free: 'Basic', studentPro: true, premiumPlus: true, description: 'Access to all subjects and topics in our library.' },
//     { feature: 'Priority Email Support', free: false, studentPro: true, premiumPlus: true, description: 'Faster response times for your support queries.' },
//     { feature: 'Weekly Performance Reports', free: false, studentPro: true, premiumPlus: true, description: 'Detailed reports on your weekly study progress.' },
//     { feature: 'Ad-free Experience', free: false, studentPro: true, premiumPlus: true, description: 'Enjoy uninterrupted study sessions.' },
//     { feature: 'Dedicated Academic Advisor', free: false, studentPro: false, premiumPlus: '1-on-1', description: 'Personalized guidance from a human academic expert.' },
//     { feature: 'Exclusive Masterclasses', free: false, studentPro: false, premiumPlus: true, description: 'Access to special workshops and masterclasses.' },
//     { feature: 'Early Access to New AI Features', free: false, studentPro: false, premiumPlus: true, description: 'Be the first to try out new AI functionalities.' },
//     { feature: 'Personalized Exam Strategy Sessions', free: false, studentPro: false, premiumPlus: true, description: 'Tailored strategies for your specific exam.' },
//     { feature: '24/7 Chat Support', free: false, studentPro: false, premiumPlus: true, description: 'Instant support anytime, day or night.' },
//     { feature: 'Offline Content Access', free: false, studentPro: false, premiumPlus: true, description: 'Download materials and study without internet.' },
//   ];


//   const testimonials = [
//     {
//       quote: "EduAI's Student Pro plan transformed my JEE preparation. The personalized plans and AI mentor were game-changers!",
//       author: "Arjun S.",
//       plan: "Student Pro"
//     },
//     {
//       quote: "The free plan gave me a taste, but Premium Plus is where the real magic happens. The dedicated advisor is invaluable.",
//       author: "Priya K.",
//       plan: "Premium Plus"
//     },
//     {
//       quote: "I never thought I could afford such advanced tools, but EduAI's pricing makes it accessible. Highly recommend!",
//       author: "Sneha R.",
//       plan: "Student Pro"
//     }
//   ];

//   const faqs = [
//     {
//       question: "Is there a free trial for paid plans?",
//       answer: "Yes, the Student Pro plan comes with a 7-day free trial. You can cancel anytime before the trial ends to avoid charges."
//     },
//     {
//       question: "What payment methods do you accept?",
//       answer: "We accept all major credit/debit cards, UPI, Net Banking, and popular digital wallets through Razorpay."
//     },
//     {
//       question: "Can I change my plan later?",
//       answer: "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be prorated."
//     },
//     {
//       question: "What is your refund policy?",
//       answer: "We offer a 30-day money-back guarantee for all first-time paid subscriptions if you are not satisfied with our service."
//     }
//   ];

//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "OfferCatalog",
//     "name": "EduAI Pricing Plans",
//     "description": "Subscription plans for EduAI's AI-powered exam preparation platform.",
//     "itemListElement": pricingPlans.map((plan, index) => ({
//       "@type": "Offer",
//       "itemOffered": {
//         "@type": "Service",
//         "name": plan.name,
//         "description": plan.features.join(". ")
//       },
//       "price": (isAnnualBilling ? plan.annualPrice : plan.monthlyPrice).replace('₹', ''),
//       "priceCurrency": "INR",
//       "offers": {
//         "@type": "Offer",
//         "price": (isAnnualBilling ? plan.annualPrice : plan.monthlyPrice).replace('₹', ''),
//         "priceCurrency": "INR",
//         "availability": "https://schema.org/InStock",
//         "url": `https://eduai.com/pricing#${plan.name.toLowerCase().replace(/\s/g, '-')}`
//       }
//     }))
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <SEOHead
//         title="Pricing Plans - EduAI | Affordable AI-Powered Exam Preparation"
//         description="Choose the best EduAI pricing plan for your competitive exam preparation. Affordable Student Pro and Premium Plus plans with AI mentorship, study plans, and analytics."
//         keywords="EduAI pricing, subscription plans, AI study cost, exam preparation fees, affordable education, student plans"
//         structuredData={structuredData}
//       />

//       <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
//             <DollarSign className="w-4 h-4" />
//             <span>Flexible Pricing</span>
//           </div>
//           <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
//             Choose Your Perfect 
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Study Plan</span>
//           </h1>
//           <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
//             Unlock the full potential of AI-powered exam preparation with plans designed for every student's need and budget.
//           </p>
//         </div>

//         {/* Billing Cycle Toggle */}
//         <div className="flex justify-center mb-12">
//           <div className="relative p-1 bg-slate-200 rounded-full">
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setIsAnnualBilling(false)}
//                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
//                   !isAnnualBilling ? 'bg-white text-blue-700 shadow' : 'text-slate-600 hover:text-blue-700'
//                 }`}
//               >
//                 Monthly
//               </button>
//               <button
//                 onClick={() => setIsAnnualBilling(true)}
//                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
//                   isAnnualBilling ? 'bg-white text-blue-700 shadow' : 'text-slate-600 hover:text-blue-700'
//                 }`}
//               >
//                 Annually
//               </button>
//             </div>
//             {isAnnualBilling && (
//               <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce">
//                 Save up to 16%!
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
//           {pricingPlans.map((plan, index) => (
//             <div
//               key={index}
//               className={`bg-white rounded-3xl shadow-xl border-2 p-8 flex flex-col ${
//                 plan.highlight ? 'border-blue-500 scale-105' : 'border-slate-200'
//               } hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
//             >
//               <div className="text-center mb-6">
//                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
//                   plan.highlight ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-slate-100'
//                 }`}>
//                   <plan.icon className={`w-8 h-8 ${plan.highlight ? 'text-white' : plan.color}`} />
//                 </div>
//                 <h2 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h2>
//                 <p className="text-slate-600">
//                   <span className="text-4xl font-bold text-slate-900">
//                     {isAnnualBilling ? plan.annualPrice : plan.monthlyPrice}
//                   </span>
//                   <span className="text-lg font-medium">/{isAnnualBilling ? 'year' : 'month'}</span>
//                 </p>
//                 {isAnnualBilling && plan.savePercentage && (
//                   <p className="text-green-600 text-sm font-semibold mt-1">
//                     Save {plan.savePercentage}% with annual billing!
//                   </p>
//                 )}
//               </div>

//               <ul className="space-y-3 flex-grow mb-8">
//                 {plan.features.map((feature, featureIndex) => (
//                   <li key={featureIndex} className="flex items-center space-x-3 text-slate-700">
//                     <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//                     <span>{feature}</span>
//                   </li>
//                 ))}
//               </ul>

//               <Link
//                 to={plan.buttonLink}
//                 state={{ planName: plan.name, price: isAnnualBilling ? plan.annualPrice : plan.monthlyPrice, duration: isAnnualBilling ? 'annually' : 'monthly' }} // Pass state to payment page
//                 className={`block w-full text-center py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
//                   plan.highlight
//                     ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg'
//                     : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                 }`}
//               >
//                 {plan.buttonText}
//               </Link>
//             </div>
//           ))}
//         </div>

//         {/* Feature Comparison Table */}
//         <div className="mb-16">
//           <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Detailed Feature Comparison</h2>
//           <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-sm font-bold text-slate-800">Feature</th>
//                     <th className="px-4 py-3 text-center text-sm font-bold text-slate-800">Free Plan</th>
//                     <th className="px-4 py-3 text-center text-sm font-bold text-blue-700">Student Pro</th>
//                     <th className="px-4 py-3 text-center text-sm font-bold text-purple-700">Premium Plus</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-200">
//                   {featureComparison.map((item, index) => (
//                     <tr key={index} className="hover:bg-slate-50">
//                       <td className="px-4 py-3 text-sm font-medium text-slate-700">
//                         {item.feature}
//                         <p className="text-xs text-slate-500 mt-1">{item.description}</p>
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         {item.free === true ? (
//                           <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
//                         ) : item.free === false ? (
//                           <XCircle className="w-5 h-5 text-red-400 mx-auto" />
//                         ) : (
//                           <span className="text-xs text-slate-500">{item.free}</span>
//                         )}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         {item.studentPro === true ? (
//                           <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
//                         ) : item.studentPro === false ? (
//                           <XCircle className="w-5 h-5 text-red-400 mx-auto" />
//                         ) : (
//                           <span className="text-xs text-slate-500">{item.studentPro}</span>
//                         )}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         {item.premiumPlus === true ? (
//                           <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
//                         ) : item.premiumPlus === false ? (
//                           <XCircle className="w-5 h-5 text-red-400 mx-auto" />
//                         ) : (
//                           <span className="text-xs text-slate-500">{item.premiumPlus}</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Testimonials */}
//         <div className="mb-16">
//           <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">What Our Students Say</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {testimonials.map((testimonial, index) => (
//               <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
//                 <Star className="w-6 h-6 text-yellow-400 mx-auto mb-3 fill-current" />
//                 <blockquote className="text-slate-700 italic mb-4">"{testimonial.quote}"</blockquote>
//                 <p className="font-bold text-slate-800">{testimonial.author}</p>
//                 <p className="text-sm text-blue-600">{testimonial.plan} User</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* FAQs */}
//         <div className="mb-16">
//           <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Frequently Asked Questions</h2>
//           <div className="max-w-3xl mx-auto space-y-6">
//             {faqs.map((faq, index) => (
//               <details key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//                 <summary className="flex justify-between items-center font-bold text-slate-800 cursor-pointer">
//                   {faq.question}
//                   <ChevronDown className="w-5 h-5 text-slate-500 transform transition-transform duration-200" />
//                 </summary>
//                 <p className="text-slate-600 mt-4 leading-relaxed">{faq.answer}</p>
//               </details>
//             ))}
//           </div>
//         </div>

//         {/* Call to Action */}
//         <div className="text-center">
//           <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white">
//             <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Preparation?</h2>
//             <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
//               Choose a plan that fits your goals and start your journey to exam success with EduAI.
//             </p>
//             <Link
//               to="/get-started"
//               className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
//             >
//               <Zap className="w-5 h-5" />
//               <span>Get Started Today</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPage;




















// src/components/Pages/PricingPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, DollarSign, Star, Award, Zap, Users, TrendingUp, Shield, XCircle, ChevronDown } from 'lucide-react';
import SEOHead from '../SEO/SEOHead';

const PricingPage: React.FC = () => {
  const [isAnnualBilling, setIsAnnualBilling] = useState(false);

  const pricingPlans = [
    {
      name: 'Free Plan',
      monthlyPrice: '₹0',
      annualPrice: '₹0',
      duration: 'forever',
      features: [
        'Basic AI Study Mentor access',
        'Limited study plan generation',
        'Basic progress tracking',
        'Access to core course materials',
        'Community support'
      ],
      buttonText: 'Get Started Free',
      buttonLink: '/get-started',
      highlight: false,
      icon: Users,
      color: 'text-slate-600'
    },
    {
      name: 'Student Pro',
      monthlyPrice: '₹499',
      annualPrice: '₹4999', // Approx ₹416/month, saving ~16%
      savePercentage: 16,
      duration: 'per month',
      features: [
        'Unlimited AI Study Mentor',
        'Advanced personalized study plans',
        'Real-time analytics & insights',
        'Full course library access',
        'Priority email support',
        'Weekly performance reports',
        'Ad-free experience'
      ],
      buttonText: 'Start 7-Day Free Trial',
      buttonLink: '/payment',
      highlight: true,
      icon: Star,
      color: 'text-blue-600'
    },
    {
      name: 'Premium Plus',
      monthlyPrice: '₹999',
      annualPrice: '₹9999', // Approx ₹833/month, saving ~16%
      savePercentage: 16,
      duration: 'per month',
      features: [
        'All Student Pro features',
        'Dedicated academic advisor (1-on-1 sessions)',
        'Exclusive masterclasses & workshops',
        'Early access to new AI features',
        'Personalized exam strategy sessions',
        '24/7 chat support',
        'Offline content access'
      ],
      buttonText: 'Upgrade to Premium',
      buttonLink: '/payment',
      highlight: false,
      icon: Award,
      color: 'text-purple-600'
    }
  ];

  const featureComparison = [
    { feature: 'AI Study Mentor Access', free: true, studentPro: true, premiumPlus: true, description: 'Get guidance from your AI mentor.' },
    { feature: 'Unlimited AI Mentor Interactions', free: false, studentPro: true, premiumPlus: true, description: 'Unlimited questions and guidance from AI mentor.' },
    { feature: 'Personalized Study Plans', free: 'Limited', studentPro: true, premiumPlus: true, description: 'AI-generated study schedules tailored to your needs.' },
    { feature: 'Real-time Analytics & Insights', free: 'Basic', studentPro: true, premiumPlus: true, description: 'Track your progress and performance with detailed analytics.' },
    { feature: 'Full Course Library Access', free: 'Basic', studentPro: true, premiumPlus: true, description: 'Access to all subjects and topics in our library.' },
    { feature: 'Priority Email Support', free: false, studentPro: true, premiumPlus: true, description: 'Faster response times for your support queries.' },
    { feature: 'Weekly Performance Reports', free: false, studentPro: true, premiumPlus: true, description: 'Detailed reports on your weekly study progress.' },
    { feature: 'Ad-free Experience', free: false, studentPro: true, premiumPlus: true, description: 'Enjoy uninterrupted study sessions.' },
    { feature: 'Dedicated Academic Advisor', free: false, studentPro: false, premiumPlus: '1-on-1', description: 'Personalized guidance from a human academic expert.' },
    { feature: 'Exclusive Masterclasses', free: false, studentPro: false, premiumPlus: true, description: 'Access to special workshops and masterclasses.' },
    { feature: 'Early Access to New AI Features', free: false, studentPro: false, premiumPlus: true, description: 'Be the first to try out new AI functionalities.' },
    { feature: 'Personalized Exam Strategy Sessions', free: false, studentPro: false, premiumPlus: true, description: 'Tailored strategies for your specific exam.' },
    { feature: '24/7 Chat Support', free: false, studentPro: false, premiumPlus: true, description: 'Instant support anytime, day or night.' },
    { feature: 'Offline Content Access', free: false, studentPro: false, premiumPlus: true, description: 'Download materials and study without internet.' },
  ];


  const testimonials = [
    {
      quote: "EduAI's Student Pro plan transformed my JEE preparation. The personalized plans and AI mentor were game-changers!",
      author: "Arjun S.",
      plan: "Student Pro"
    },
    {
      quote: "The free plan gave me a taste, but Premium Plus is where the real magic happens. The dedicated advisor is invaluable.",
      author: "Priya K.",
      plan: "Premium Plus"
    },
    {
      quote: "I never thought I could afford such advanced tools, but EduAI's pricing makes it accessible. Highly recommend!",
      author: "Sneha R.",
      plan: "Student Pro"
    }
  ];

  const faqs = [
    {
      question: "Is there a free trial for paid plans?",
      answer: "Yes, the Student Pro plan comes with a 7-day free trial. You can cancel anytime before the trial ends to avoid charges."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, Net Banking, and popular digital wallets through Razorpay."
    },
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be prorated."
    },
    {
      question: "What is your refund policy?",
      answer: "We offer a 30-day money-back guarantee for all first-time paid subscriptions if you are not satisfied with our service."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "EduAI Pricing Plans",
    "description": "Subscription plans for EduAI's AI-powered exam preparation platform.",
    "itemListElement": pricingPlans.map((plan, index) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": plan.name,
        "description": plan.features.join(". ")
      },
      "price": (isAnnualBilling ? plan.annualPrice : plan.monthlyPrice).replace('₹', ''),
      "priceCurrency": "INR",
      "offers": {
        "@type": "Offer",
        "price": (isAnnualBilling ? plan.annualPrice : plan.monthlyPrice).replace('₹', ''),
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `https://eduai.com/pricing#${plan.name.toLowerCase().replace(/\s/g, '-')}`
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEOHead
        title="Pricing Plans - EduAI | Affordable AI-Powered Exam Preparation"
        description="Choose the best EduAI pricing plan for your competitive exam preparation. Affordable Student Pro and Premium Plus plans with AI mentorship, study plans, and analytics."
        keywords="EduAI pricing, subscription plans, AI study cost, exam preparation fees, affordable education, student plans"
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <DollarSign className="w-4 h-4" />
            <span>Flexible Pricing</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
            Choose Your Perfect 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Study Plan</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Unlock the full potential of AI-powered exam preparation with plans designed for every student's need and budget.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-12">
          <div className="relative p-1 bg-slate-200 rounded-full">
            <div className="flex space-x-2">
              <button
                onClick={() => setIsAnnualBilling(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  !isAnnualBilling ? 'bg-white text-blue-700 shadow' : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnualBilling(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  isAnnualBilling ? 'bg-white text-blue-700 shadow' : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                Annually
              </button>
            </div>
            {isAnnualBilling && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce">
                Save up to 16%!
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards - Horizontal Layout */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch lg:space-x-8 space-y-8 lg:space-y-0 mb-16">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`w-full lg:w-1/3 bg-white rounded-3xl shadow-xl border-2 p-8 flex flex-col ${
                plan.highlight ? 'border-blue-500 scale-105' : 'border-slate-200'
              } hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
            >
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  plan.highlight ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-slate-100'
                }`}>
                  <plan.icon className={`w-8 h-8 ${plan.highlight ? 'text-white' : plan.color}`} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h2>
                <p className="text-slate-600">
                  <span className="text-4xl font-bold text-slate-900">
                    {isAnnualBilling ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-lg font-medium">/{isAnnualBilling ? 'year' : 'month'}</span>
                </p>
                {isAnnualBilling && plan.savePercentage && (
                  <p className="text-green-600 text-sm font-semibold mt-1">
                    Save {plan.savePercentage}% with annual billing!
                  </p>
                )}
              </div>

              <ul className="space-y-3 flex-grow mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.buttonLink}
                state={{ planName: plan.name, price: isAnnualBilling ? plan.annualPrice : plan.monthlyPrice, duration: isAnnualBilling ? 'annually' : 'monthly' }} // Pass state to payment page
                className={`block w-full text-center py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Detailed Feature Comparison</h2>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-800">Feature</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-slate-800">Free Plan</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-blue-700">Student Pro</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-purple-700">Premium Plus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {featureComparison.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">
                        {item.feature}
                        <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.free === true ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        ) : item.free === false ? (
                          <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-xs text-slate-500">{item.free}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.studentPro === true ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        ) : item.studentPro === false ? (
                          <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-xs text-slate-500">{item.studentPro}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.premiumPlus === true ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        ) : item.premiumPlus === false ? (
                          <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-xs text-slate-500">{item.premiumPlus}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-3 fill-current" />
                <blockquote className="text-slate-700 italic mb-4">"{testimonial.quote}"</blockquote>
                <p className="font-bold text-slate-800">{testimonial.author}</p>
                <p className="text-sm text-blue-600">{testimonial.plan} User</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <summary className="flex justify-between items-center font-bold text-slate-800 cursor-pointer">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-slate-500 transform transition-transform duration-200" />
                </summary>
                <p className="text-slate-600 mt-4 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Preparation?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Choose a plan that fits your goals and start your journey to exam success with EduAI.
            </p>
            <Link
              to="/get-started"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Zap className="w-5 h-5" />
              <span>Get Started Today</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

