import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Menu, X, ChevronDown } from 'lucide-react';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const PublicHeader: React.FC = () => {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExamsDropdownOpen, setIsExamsDropdownOpen] = useState(false);

  const examTypes = [
    { name: 'UPSC Civil Services', href: '/exams/upsc' },
    { name: 'JEE Main/Advanced', href: '/exams/jee' },
    { name: 'NEET Medical', href: '/exams/neet' },
    { name: 'SSC CGL/CHSL', href: '/exams/ssc' },
    { name: 'Banking Exams', href: '/exams/banking' },
    { name: 'CAT MBA', href: '/exams/cat' }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">EduAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              About
            </Link>
            
            {/* Exams Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsExamsDropdownOpen(!isExamsDropdownOpen)}
                className="flex items-center space-x-1 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                <span>Exams</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isExamsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  {examTypes.map((exam, index) => (
                    <a
                      key={index}
                      href={exam.href}
                      className="block px-4 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      {exam.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/how-to-use" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              How to Use
            </Link>
            <Link to="/faq" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              FAQ
            </Link>
            <Link to="/contact" className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <SignedOut>
              <Link
                to="/login"
                className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/get-started"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                to="/app/dashboard"
                className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "shadow-xl border border-slate-200",
                    userButtonPopoverActionButton: "hover:bg-slate-50"
                  }
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <nav className="space-y-4">
              <Link
                to="/"
                className="block text-slate-600 hover:text-slate-800 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/features"
                className="block text-slate-600 hover:text-slate-800 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="block text-slate-600 hover:text-slate-800 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="block text-slate-600 hover:text-slate-800 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile Exams Section */}
              <div>
                <div className="text-slate-800 font-medium mb-2">Exams</div>
                <div className="pl-4 space-y-2">
                  {examTypes.map((exam, index) => (
                    <a
                      key={index}
                      href={exam.href}
                      className="block text-slate-600 hover:text-slate-800 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {exam.name}
                    </a>
                  ))}
                </div>
              </div>
              
              <Link
                to="/how-to-use"
                className="block text-slate-600 hover:text-slate-800 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How to Use
              </Link>
              <Link
                to="/faq"
                className="block text-slate-600 hover:text-slate-800 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className="block text-slate-600 hover:text-slate-800 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <SignedOut>
                  <Link
                    to="/login"
                    className="block text-center bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/get-started"
                    className="block text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link
                    to="/app/dashboard"
                    className="block text-center bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="flex justify-center">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10",
                          userButtonPopoverCard: "shadow-xl border border-slate-200"
                        }
                      }}
                      afterSignOutUrl="/"
                    />
                  </div>
                </SignedIn>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;