import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import Footer from './Footer';
import ScrollToTop from '../Common/ScrollToTop';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <ScrollToTop />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;