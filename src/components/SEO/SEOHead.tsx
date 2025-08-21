import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
  noIndex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "EduAI - AI-Powered EdTech Platform for Exam Preparation",
  description = "Transform your exam preparation with EduAI's AI-powered study platform. Get personalized study plans, real-time analytics, AI mentorship, and comprehensive progress tracking for UPSC, JEE, NEET, SSC, Banking, and more competitive exams.",
  keywords = "AI study platform, exam preparation, UPSC preparation, JEE coaching, NEET study, SSC exam, banking exam, personalized study plan, AI mentor, study analytics, competitive exam preparation, online learning, EdTech platform",
  canonicalUrl,
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData,
  noIndex = false
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://eduai.com';
  const fullCanonicalUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : siteUrl);
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduAI",
    "description": description,
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "sameAs": [
      "https://twitter.com/eduai",
      "https://linkedin.com/company/eduai",
      "https://facebook.com/eduai"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9876543210",
      "contactType": "customer service",
      "email": "support@eduai.com"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Education Street",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110001",
      "addressCountry": "IN"
    },
    "founder": {
      "@type": "Person",
      "name": "Dr. Rajesh Kumar",
      "jobTitle": "Educational Technology Expert",
      "description": "15+ years of experience in competitive exam preparation and AI-powered education"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="EduAI" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:site" content="@eduai" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="EduAI Team" />
      <meta name="publisher" content="EduAI" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
      
      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.mistral.ai" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//supabase.co" />
      <link rel="dns-prefetch" href="//clerk.dev" />
    </Helmet>
  );
};

export default SEOHead;