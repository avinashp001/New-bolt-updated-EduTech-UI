import React from 'react';
import {
  Crown,
  Zap,
  TrendingUp,
  Brain,
  Rocket,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  BookOpen,
  Target,
  RotateCcw,
  CreditCard,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { useUsage, USAGE_LIMITS, FEATURE_NAMES } from '../../hooks/useUsage';
import { useNavigate } from 'react-router-dom';

const SubscriptionAndUsageManager: React.FC = () => {
  const { getUsage, hasExceededLimit, isPremium, USAGE_LIMITS, FEATURE_NAMES, fetchUsage } = useUsage();
  const navigate = useNavigate();

  const featuresToTrack = [
    { key: FEATURE_NAMES.AI_MENTOR_CHAT, label: 'AI Mentor Chat', icon: Brain, limit: USAGE_LIMITS.AI_MENTOR_CHAT },
    { key: FEATURE_NAMES.THEORY_GENERATION, label: 'Theory Generation', icon: BookOpen, limit: USAGE_LIMITS.THEORY_GENERATION },
    { key: FEATURE_NAMES.AI_TEST_SESSION, label: 'AI Test Session', icon: Zap, limit: USAGE_LIMITS.AI_TEST_SESSION },
    { key: FEATURE_NAMES.WEEKLY_ASSESSMENT, label: 'Weekly Assessment', icon: Calendar, limit: USAGE_LIMITS.WEEKLY_ASSESSMENT },
  ];

  const getProgressBarColor = (usage: number, limit: number) => {
    const percentage = (usage / limit) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const handleUpgradeClick = () => {
    // This would typically navigate to a pricing/subscription page
    // or trigger an external payment flow.
    navigate('/pricing'); // Assuming you have a /pricing route
  };

  const handleManageSubscription = () => {
    // This would typically link to a billing portal (e.g., Stripe customer portal)
    alert('This feature would link to your billing portal to manage your subscription.');
  };

  const handleCancelSubscription = () => {
    // This would typically trigger a cancellation process
    alert('This feature would initiate the cancellation process for your subscription.');
  };

  return (
    <div className="space-y-8">
      {/* Current Plan Status */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8" />
            <h3 className="text-2xl font-bold">Your Current Plan</h3>
          </div>
          <div className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">
            {isPremium ? 'Premium' : 'Free Tier'}
          </div>
        </div>
        <p className="text-blue-100">
          {isPremium
            ? 'You have unlimited access to all AI features and premium benefits!'
            : 'Enjoy our powerful AI features with daily limits. Upgrade to unlock more!'}
        </p>
        {!isPremium && (
          <button
            onClick={handleUpgradeClick}
            className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center space-x-2"
          >
            <Rocket className="w-5 h-5" />
            <span>Upgrade Now!</span>
          </button>
        )}
      </div>

      {/* Usage Overview */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          <span>Daily Usage Overview</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuresToTrack.map((feature) => {
            const usage = getUsage(feature.key);
            const limit = feature.limit;
            const percentage = limit > 0 ? (usage / limit) * 100 : 0;
            const exceeded = hasExceededLimit(feature.key);

            return (
              <div key={feature.key} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{feature.label}</h4>
                    <p className="text-sm text-slate-600">
                      {usage}/{limit} uses today
                    </p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarColor(usage, limit)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                {exceeded && !isPremium && (
                  <p className="text-red-600 text-xs mt-2 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Limit exceeded! Upgrade to continue.</span>
                  </p>
                )}
                {!exceeded && !isPremium && percentage >= 75 && (
                  <p className="text-orange-600 text-xs mt-2 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Approaching limit!</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
        {!isPremium && (
          <div className="mt-6 text-center">
            <button
              onClick={handleUpgradeClick}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 mx-auto"
            >
              <span>See Premium Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Subscription Management (Placeholder) */}
      {isPremium && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-green-600" />
            <span>Manage Your Subscription</span>
          </h3>
          <div className="space-y-4">
            <button
              onClick={handleManageSubscription}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <DollarSign className="w-5 h-5" />
              <span>View Billing & Plan Details</span>
            </button>
            <button
              onClick={handleCancelSubscription}
              className="w-full border border-red-500 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
            >
              <XCircle className="w-5 h-5" />
              <span>Cancel Subscription</span>
            </button>
          </div>
        </div>
      )}

      {/* Call to Action for Free Users */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl text-white text-center shadow-lg">
          <h3 className="text-xl font-bold mb-3">Ready for Unlimited Access?</h3>
          <p className="text-blue-100 mb-4">
            Upgrade today and remove all daily limits, unlock advanced features, and get priority support!
          </p>
          <button
            onClick={handleUpgradeClick}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Upgrade to Premium
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionAndUsageManager;

