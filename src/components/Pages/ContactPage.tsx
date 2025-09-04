
// import React, { useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Clock, 
//   Send, 
//   CheckCircle, 
//   MessageSquare,
//   Brain,
//   Users,
//   Award,
//   Shield,
//   Zap,
//   Globe,
//   Heart,
//   Star,
//   Target,
//   Lightbulb
// } from 'lucide-react';
// import SEOHead from '../SEO/SEOHead';


// const MyMap = () => {
//   const position: [number, number] = [28.6139, 77.2090]; // New Delhi coords

//   return (
//     <MapContainer center={position} zoom={13} className="h-full w-full">
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; OpenStreetMap contributors'
//       />
//       <Marker position={position}>
//         <Popup>123 Education Street, New Delhi</Popup>
//       </Marker>
//     </MapContainer>
//   );
// };


// const ContactPage: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     examType: '',
//     message: '',
//     priority: 'medium'
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     // Simulate form submission
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     setIsSubmitting(false);
//     setIsSubmitted(true);
    
//     // Reset form after 3 seconds
//     setTimeout(() => {
//       setIsSubmitted(false);
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         subject: '',
//         examType: '',
//         message: '',
//         priority: 'medium'
//       });
//     }, 3000);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const contactMethods = [
//     {
//       title: 'Email Support',
//       description: 'Get detailed responses to your queries',
//       icon: Mail,
//       contact: 'support@eduai.com',
//       responseTime: '24 hours',
//       color: 'from-blue-500 to-blue-600',
//       href: 'mailto:support@eduai.com'
//     },
//     {
//       title: 'Phone Support',
//       description: 'Speak directly with our experts',
//       icon: Phone,
//       contact: '+91 98765 43210',
//       responseTime: 'Immediate',
//       color: 'from-green-500 to-green-600',
//       href: 'tel:+919876543210'
//     },
//     {
//       title: 'Live Chat',
//       description: '24/7 AI-powered instant support',
//       icon: MessageSquare,
//       contact: 'Available on platform',
//       responseTime: 'Instant',
//       color: 'from-purple-500 to-purple-600',
//       href: '/ai-mentor'
//     },
//     {
//       title: 'Office Visit',
//       description: 'Meet our team in person',
//       icon: MapPin,
//       contact: 'New Delhi, India',
//       responseTime: 'By appointment',
//       color: 'from-orange-500 to-orange-600',
//       href: '#office-location'
//     }
//   ];

//   const supportCategories = [
//     {
//       title: 'Technical Support',
//       description: 'Platform issues, login problems, feature questions',
//       icon: Zap,
//       examples: ['Login issues', 'Feature not working', 'Data sync problems', 'Performance issues']
//     },
//     {
//       title: 'Academic Guidance',
//       description: 'Study strategies, exam preparation, learning optimization',
//       icon: Brain,
//       examples: ['Study plan optimization', 'Exam strategy', 'Subject-specific guidance', 'Performance improvement']
//     },
//     {
//       title: 'Account & Billing',
//       description: 'Subscription, payments, account management',
//       icon: Shield,
//       examples: ['Subscription queries', 'Payment issues', 'Account settings', 'Data export']
//     },
//     {
//       title: 'Partnership & Business',
//       description: 'Institutional partnerships, bulk licensing, collaborations',
//       icon: Users,
//       examples: ['School partnerships', 'Bulk licensing', 'API access', 'Custom solutions']
//     }
//   ];

//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "ContactPage",
//     "name": "Contact EduAI",
//     "description": "Get in touch with EduAI's expert team for support, guidance, and partnership opportunities",
//     "url": "https://eduai.com/contact",
//     "mainEntity": {
//       "@type": "Organization",
//       "name": "EduAI",
//       "contactPoint": [
//         {
//           "@type": "ContactPoint",
//           "telephone": "+91-9876543210",
//           "contactType": "customer service",
//           "email": "support@eduai.com",
//           "availableLanguage": ["English", "Hindi"],
//           "hoursAvailable": "Mo-Fr 09:00-21:00, Sa 10:00-18:00, Su 11:00-17:00"
//         }
//       ]
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <SEOHead
//         title="Contact EduAI - Get Expert Support & Guidance | AI-Powered Education Platform"
//         description="Contact EduAI's expert team for technical support, academic guidance, and partnership opportunities. Get 24/7 AI support or speak directly with our education specialists."
//         keywords="contact EduAI, education support, AI tutoring help, exam preparation support, technical support, academic guidance, EdTech contact"
//         structuredData={structuredData}
//       />

//       <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
//             <MessageSquare className="w-4 h-4" />
//             <span>Contact & Support</span>
//           </div>
//           <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
//             Get in Touch with Our 
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Expert Team</span>
//           </h1>
//           <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
//             Whether you need technical support, academic guidance, or want to explore partnership opportunities, 
//             our expert team is here to help you succeed. Get personalized assistance from education specialists.
//           </p>
//         </div>

//         {/* Contact Methods */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
//           {contactMethods.map((method, index) => (
//             <a
//               key={index}
//               href={method.href}
//               className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
//             >
//               <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
//                 <method.icon className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-lg font-bold text-slate-800 mb-2">{method.title}</h3>
//               <p className="text-slate-600 text-sm mb-3">{method.description}</p>
//               <div className="space-y-2">
//                 <div className="font-medium text-slate-800">{method.contact}</div>
//                 <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
//                   Response: {method.responseTime}
//                 </div>
//               </div>
//             </a>
//           ))}
//         </div>

//         {/* Main Contact Form */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
//           {/* Contact Form */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
//               <div className="flex items-center space-x-3 mb-8">
//                 <Send className="w-6 h-6 text-blue-600" />
//                 <h2 className="text-2xl font-bold text-slate-800">Send us a Message</h2>
//               </div>

//               {isSubmitted ? (
//                 <div className="text-center py-12">
//                   <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
//                   <h3 className="text-2xl font-bold text-slate-800 mb-4">Message Sent Successfully!</h3>
//                   <p className="text-slate-600 mb-6">
//                     Thank you for contacting us. Our expert team will review your message and respond within 24 hours.
//                   </p>
//                   <div className="bg-green-50 border border-green-200 rounded-xl p-4">
//                     <p className="text-green-800 font-medium">
//                       📧 Confirmation sent to {formData.email}
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         Full Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
//                         placeholder="Enter your full name"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         Email Address *
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
//                         placeholder="your.email@example.com"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         Phone Number
//                       </label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
//                         placeholder="+91 98765 43210"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         Target Exam
//                       </label>
//                       <select
//                         name="examType"
//                         value={formData.examType}
//                         onChange={handleInputChange}
//                         className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
//                       >
//                         <option value="">Select your exam</option>
//                         <option value="UPSC">UPSC Civil Services</option>
//                         <option value="JEE">JEE Main/Advanced</option>
//                         <option value="NEET">NEET Medical</option>
//                         <option value="SSC">SSC CGL/CHSL</option>
//                         <option value="Banking">Banking Exams</option>
//                         <option value="CAT">CAT MBA</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         Subject *
//                       </label>
//                       <select
//                         name="subject"
//                         value={formData.subject}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
//                       >
//                         <option value="">Select inquiry type</option>
//                         <option value="technical">Technical Support</option>
//                         <option value="academic">Academic Guidance</option>
//                         <option value="billing">Account & Billing</option>
//                         <option value="partnership">Partnership Inquiry</option>
//                         <option value="feedback">Feedback & Suggestions</option>
//                         <option value="other">Other</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         Priority Level
//                       </label>
//                       <select
//                         name="priority"
//                         value={formData.priority}
//                         onChange={handleInputChange}
//                         className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
//                       >
//                         <option value="low">Low - General inquiry</option>
//                         <option value="medium">Medium - Standard support</option>
//                         <option value="high">High - Urgent assistance</option>
//                         <option value="critical">Critical - Platform issue</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Message *
//                     </label>
//                     <textarea
//                       name="message"
//                       value={formData.message}
//                       onChange={handleInputChange}
//                       required
//                       rows={6}
//                       className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none"
//                       placeholder="Please describe your inquiry in detail. Include any relevant information such as error messages, specific features you're asking about, or your current study situation."
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                         <span>Sending Message...</span>
//                       </>
//                     ) : (
//                       <>
//                         <Send className="w-5 h-5" />
//                         <span>Send Message</span>
//                       </>
//                     )}
//                   </button>
//                 </form>
//               )}
//             </div>
//           </div>

//           {/* Contact Information & Support Categories */}
//           <div className="lg:col-span-1 space-y-8">
//             {/* Office Information */}
//             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//               <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
//                 <MapPin className="w-5 h-5 text-blue-600" />
//                 <span>Office Information</span>
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex items-start space-x-3">
//                   <MapPin className="w-5 h-5 text-slate-400 mt-1" />
//                   <div>
//                     <div className="font-medium text-slate-800">Headquarters</div>
//                     <div className="text-slate-600 text-sm">
//                       123 Education Street<br />
//                       Connaught Place<br />
//                       New Delhi - 110001<br />
//                       India
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <Clock className="w-5 h-5 text-slate-400 mt-1" />
//                   <div>
//                     <div className="font-medium text-slate-800">Office Hours</div>
//                     <div className="text-slate-600 text-sm">
//                       Monday - Friday: 9:00 AM - 9:00 PM<br />
//                       Saturday: 10:00 AM - 6:00 PM<br />
//                       Sunday: 11:00 AM - 5:00 PM<br />
//                       <span className="text-blue-600 font-medium">24/7 AI Support Available</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Support Categories */}
//             <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//               <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
//                 <Lightbulb className="w-5 h-5 text-purple-600" />
//                 <span>Support Categories</span>
//               </h3>
//               <div className="space-y-4">
//                 {supportCategories.map((category, index) => (
//                   <div key={index} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
//                     <div className="flex items-center space-x-3 mb-2">
//                       <category.icon className="w-5 h-5 text-blue-600" />
//                       <h4 className="font-semibold text-slate-800">{category.title}</h4>
//                     </div>
//                     <p className="text-slate-600 text-sm mb-3">{category.description}</p>
//                     <div className="flex flex-wrap gap-1">
//                       {category.examples.map((example, exampleIndex) => (
//                         <span key={exampleIndex} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
//                           {example}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
//               <h3 className="text-lg font-bold mb-6">Our Support Excellence</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-blue-100">Average Response Time</span>
//                   <span className="font-bold">2 hours</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-blue-100">Customer Satisfaction</span>
//                   <span className="font-bold">98.5%</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-blue-100">Issues Resolved</span>
//                   <span className="font-bold">99.2%</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-blue-100">24/7 AI Support</span>
//                   <span className="font-bold">Available</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Expert Team Availability */}
//         <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-16">
//           <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Meet Our Expert Support Team</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 name: 'Dr. Rajesh Kumar',
//                 role: 'Chief Academic Advisor',
//                 specialization: 'UPSC, SSC, Banking Exams',
//                 availability: 'Mon-Fri, 2-6 PM IST',
//                 image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=300'
//               },
//               {
//                 name: 'Prof. Anita Sharma',
//                 role: 'Curriculum Specialist',
//                 specialization: 'JEE, NEET, Engineering',
//                 availability: 'Tue-Sat, 10 AM-2 PM IST',
//                 image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=300'
//               },
//               {
//                 name: 'Mr. Arjun Patel',
//                 role: 'Technical Support Lead',
//                 specialization: 'Platform Issues, AI Features',
//                 availability: 'Mon-Sun, 9 AM-9 PM IST',
//                 image: 'https://images.pexels.com/photos/5428010/pexels-photo-5428010.jpeg?auto=compress&cs=tinysrgb&w=300'
//               }
//             ].map((expert, index) => (
//               <div key={index} className="text-center">
//                 <div className="relative mb-4">
//                   <img src={expert.image} alt={expert.name} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-200" />
//                   <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
//                 </div>
//                 <h3 className="font-bold text-slate-800 mb-1">{expert.name}</h3>
//                 <p className="text-blue-600 font-medium text-sm mb-2">{expert.role}</p>
//                 <p className="text-slate-600 text-sm mb-2">{expert.specialization}</p>
//                 <div className="bg-slate-50 rounded-lg p-2">
//                   <p className="text-slate-500 text-xs">{expert.availability}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Emergency Support */}
//         <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-8 text-white text-center mb-16">
//           <h2 className="text-2xl font-bold mb-4">Emergency Support</h2>
//           <p className="text-red-100 mb-6">
//             Experiencing critical issues during exam preparation? Our emergency support team is available for urgent assistance.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
//             <a
//               href="tel:+919876543210"
//               className="inline-flex items-center space-x-2 bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
//             >
//               <Phone className="w-5 h-5" />
//               <span>Emergency Hotline</span>
//             </a>
//             <a
//               href="/ai-mentor"
//               className="inline-flex items-center space-x-2 border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105"
//             >
//               <Brain className="w-5 h-5" />
//               <span>Instant AI Help</span>
//             </a>
//           </div>
//         </div>

//         {/* Office Location Map */}
//         <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//           <div className="p-8">
//             <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Visit Our Office</h2>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               <div>
//                 {/* <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center mb-6">
//                   <div className="text-center">
//                     <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//                     <p className="text-slate-600">Interactive Map</p>
//                     <p className="text-slate-500 text-sm">123 Education Street, New Delhi</p>
//                   </div>
//                 </div> */}
//                <div className="bg-slate-100 rounded-2xl h-64 mb-6 overflow-hidden">
//       <MyMap/>
//     </div>
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-3">
//                     <MapPin className="w-5 h-5 text-blue-600" />
//                     <span className="text-slate-700">5 minutes from Connaught Place Metro</span>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <Clock className="w-5 h-5 text-green-600" />
//                     <span className="text-slate-700">Visitor hours: 10 AM - 6 PM (Mon-Fri)</span>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <Shield className="w-5 h-5 text-purple-600" />
//                     <span className="text-slate-700">Prior appointment recommended</span>
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-slate-800 mb-4">What to Expect</h3>
//                 <ul className="space-y-3">
//                   {[
//                     'Personal consultation with education experts',
//                     'Live demonstration of AI features',
//                     'Customized study plan creation',
//                     'One-on-one strategy session',
//                     'Platform training and onboarding',
//                     'Academic guidance and career counseling'
//                   ].map((item, index) => (
//                     <li key={index} className="flex items-center space-x-3">
//                       <CheckCircle className="w-5 h-5 text-green-600" />
//                       <span className="text-slate-700">{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//                   <p className="text-blue-800 font-medium text-sm">
//                     💡 Pro Tip: Bring your study materials and exam timeline for a more personalized consultation!
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactPage;





import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  MessageSquare,
  Brain,
  Users,
  Award,
  Shield,
  Zap,
  Globe,
  Heart,
  Star,
  Target,
  Lightbulb
} from 'lucide-react';
import SEOHead from '../SEO/SEOHead';


const MyMap = () => {
  const position: [number, number] = [28.6139, 77.2090]; // New Delhi coords

  return (
    <MapContainer center={position} zoom={13} className="h-full w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={position}>
        <Popup>123 Education Street, New Delhi</Popup>
      </Marker>
    </MapContainer>
  );
};


const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    examType: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        examType: '',
        message: '',
        priority: 'medium'
      });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      title: 'Email Support',
      description: 'Get detailed responses to your queries',
      icon: Mail,
      contact: 'support@eduai.com',
      responseTime: '24 hours',
      color: 'from-blue-500 to-blue-600',
      href: 'mailto:support@eduai.com'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      icon: Phone,
      contact: '+91 98765 43210',
      responseTime: 'Immediate',
      color: 'from-green-500 to-green-600',
      href: 'tel:+919876543210'
    },
    {
      title: 'Live Chat',
      description: '24/7 AI-powered instant support',
      icon: MessageSquare,
      contact: 'Available on platform',
      responseTime: 'Instant',
      color: 'from-purple-500 to-purple-600',
      href: '/ai-mentor'
    },
    {
      title: 'Office Visit',
      description: 'Meet our team in person',
      icon: MapPin,
      contact: 'New Delhi, India',
      responseTime: 'By appointment',
      color: 'from-orange-500 to-orange-600',
      href: '#office-location' // Link to the office location section
    }
  ];

  const supportCategories = [
    {
      title: 'Technical Support',
      description: 'Platform issues, login problems, feature questions',
      icon: Zap,
      examples: ['Login issues', 'Feature not working', 'Data sync problems', 'Performance issues']
    },
    {
      title: 'Academic Guidance',
      description: 'Study strategies, exam preparation, learning optimization',
      icon: Brain,
      examples: ['Study plan optimization', 'Exam strategy', 'Subject-specific guidance', 'Performance improvement']
    },
    {
      title: 'Account & Billing',
      description: 'Subscription, payments, account management',
      icon: Shield,
      examples: ['Subscription queries', 'Payment issues', 'Account settings', 'Data export']
    },
    {
      title: 'Partnership & Business',
      description: 'Institutional partnerships, bulk licensing, collaborations',
      icon: Users,
      examples: ['School partnerships', 'Bulk licensing', 'API access', 'Custom solutions']
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact EduAI",
    "description": "Get in touch with EduAI's expert team for support, guidance, and partnership opportunities",
    "url": "https://eduai.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "EduAI",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91-9876543210",
          "contactType": "customer service",
          "email": "support@eduai.com",
          "availableLanguage": ["English", "Hindi"],
          "hoursAvailable": "Mo-Fr 09:00-21:00, Sa 10:00-18:00, Su 11:00-17:00"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEOHead
        title="Contact EduAI - Get Expert Support & Guidance | AI-Powered Education Platform"
        description="Contact EduAI's expert team for technical support, academic guidance, and partnership opportunities. Get 24/7 AI support or speak directly with our education specialists."
        keywords="contact EduAI, education support, AI tutoring help, exam preparation support, technical support, academic guidance, EdTech contact"
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            <span>Contact & Support</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
            Get in Touch with Our 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Expert Team</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Whether you need technical support, academic guidance, or want to explore partnership opportunities, 
            our expert team is here to help you succeed. Get personalized assistance from education specialists.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.href}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{method.title}</h3>
              <p className="text-slate-600 text-sm mb-3">{method.description}</p>
              <div className="space-y-2">
                <div className="font-medium text-slate-800">{method.contact}</div>
                <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
                  Response: {method.responseTime}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Main Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Form */}
          <div id="form" className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex items-center space-x-3 mb-8">
                <Send className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-800">Send us a Message</h2>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Message Sent Successfully!</h3>
                  <p className="text-slate-600 mb-6">
                    Thank you for contacting us. Our expert team will review your message and respond within 24 hours.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-800 font-medium">
                      📧 Confirmation sent to {formData.email}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Target Exam
                      </label>
                      <select
                        name="examType"
                        value={formData.examType}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      >
                        <option value="">Select your exam</option>
                        <option value="UPSC">UPSC Civil Services</option>
                        <option value="JEE">JEE Main/Advanced</option>
                        <option value="NEET">NEET Medical</option>
                        <option value="SSC">SSC CGL/CHSL</option>
                        <option value="Banking">Banking Exams</option>
                        <option value="CAT">CAT MBA</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      >
                        <option value="">Select inquiry type</option>
                        <option value="technical">Technical Support</option>
                        <option value="academic">Academic Guidance</option>
                        <option value="billing">Account & Billing</option>
                        <option value="partnership">Partnership Inquiry</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Priority Level
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      >
                        <option value="low">Low - General inquiry</option>
                        <option value="medium">Medium - Standard support</option>
                        <option value="high">High - Urgent assistance</option>
                        <option value="critical">Critical - Platform issue</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none"
                      placeholder="Please describe your inquiry in detail. Include any relevant information such as error messages, specific features you're asking about, or your current study situation."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Information & Support Categories */}
          <div className="lg:col-span-1 space-y-8">
            {/* Office Information */}
            <div id="office-information" className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>Office Information</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <div className="font-medium text-slate-800">Headquarters</div>
                    <div className="text-slate-600 text-sm">
                      123 Education Street<br />
                      Connaught Place<br />
                      New Delhi - 110001<br />
                      India
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <div className="font-medium text-slate-800">Office Hours</div>
                    <div className="text-slate-600 text-sm">
                      Monday - Friday: 9:00 AM - 9:00 PM<br />
                      Saturday: 10:00 AM - 6:00 PM<br />
                      Sunday: 11:00 AM - 5:00 PM<br />
                      <span className="text-blue-600 font-medium">24/7 AI Support Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Categories */}
            <div id="support-categories" className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                <span>Support Categories</span>
              </h3>
              <div className="space-y-4">
                {supportCategories.map((category, index) => (
                  <div key={index} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3 mb-2">
                      <category.icon className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-slate-800">{category.title}</h4>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{category.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {category.examples.map((example, exampleIndex) => (
                        <span key={exampleIndex} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-6">Our Support Excellence</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Average Response Time</span>
                  <span className="font-bold">2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Customer Satisfaction</span>
                  <span className="font-bold">98.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Issues Resolved</span>
                  <span className="font-bold">99.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">24/7 AI Support</span>
                  <span className="font-bold">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Support */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">Emergency Support</h2>
          <p className="text-red-100 mb-6">
            Experiencing critical issues during exam preparation? Our emergency support team is available for urgent assistance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center space-x-2 bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              <span>Emergency Hotline</span>
            </a>
            <a
              href="/ai-mentor"
              className="inline-flex items-center space-x-2 border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105"
            >
              <Brain className="w-5 h-5" />
              <span>Instant AI Help</span>
            </a>
          </div>
        </div>

        {/* Office Location Map */}
        <div id="office-location" className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="max-p-6 p-8">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Visit Our Office</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                {/* <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center mb-6">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">Interactive Map</p>
                    <p className="text-slate-500 text-sm">123 Education Street, New Delhi</p>
                  </div>
                </div> */}
               <div className="bg-slate-100 rounded-2xl h-64 mb-6 overflow-hidden">
      <MyMap/>
    </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-slate-700">5 minutes from Connaught Place Metro</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-slate-700">Visitor hours: 10 AM - 6 PM (Mon-Fri)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="text-slate-700">Prior appointment recommended</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">What to Expect</h3>
                <ul className="space-y-3">
                  {[
                    'Personal consultation with education experts',
                    'Live demonstration of AI features',
                    'Customized study plan creation',
                    'One-on-one strategy session',
                    'Platform training and onboarding',
                    'Academic guidance and career counseling'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-blue-800 font-medium text-sm">
                    💡 Pro Tip: Bring your study materials and exam timeline for a more personalized consultation!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
