import React, { useState, useRef } from 'react';
import { Brain, BookOpen, Loader2, AlertCircle, Download } from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';
import { AIService } from '../../lib/mistralAI';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import TheoryContentDisplay from './TheoryContentDisplay';
import html2pdf from 'html2pdf.js';
import { useUsage, USAGE_LIMITS, FEATURE_NAMES } from '../../hooks/useUsage'; // NEW
import UpgradePromptModal from '../Common/UpgradePromptModal'; // NEW



const TheoryGeneratorPage: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { getUsage, incrementUsage, hasExceededLimit, isPremium } = useUsage(); // NEW

  const [subjectInput, setSubjectInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [selectedExamLevel, setSelectedExamLevel] = useState('General');
  const [generatedTheory, setGeneratedTheory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRetryPopup, setShowRetryPopup] = useState(false); // New state for popup
  const theoryContentRef = useRef<HTMLDivElement>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false); // NEW

  // const subjects = [
  //   'Mathematics', 'Physics', 'Chemistry', 'Biology',
  //   'History', 'Geography', 'Economics', 'Political Science',
  //   'English', 'Current Affairs', 'Reasoning', 'General Knowledge'
  // ];


   const examLevels = [ // Options for exam level
    'Board Exams (Class 12)',
    'University Exams (B.Arch)',
    'University Exams (B.Tech)',
    'University Exams (BAMS)',
    'University Exams (MBBS)',
    'University Exams (BHMS)',
    'University Exams (B.Sc Agriculture)',
    'University Exams (B.Sc Veterinary)',
    'General',
    'UPSC Civil Services',
    'Banking (SBI PO/Clerk)',
    'JEE Main/Advanced',
    'SSC CGL',
    'NEET UG',
    'CAT',
    'GATE',
  ];

  const handleGenerateTheory = async () => {
    if (!subjectInput || !topicInput || !selectedExamLevel) {
      setError('Please enter a subject, topic and select an exam type.');
      return;
    }
    if (!user?.id) {
      setError('User not authenticated. Please log in.');
      return;
    }

    // NEW: Check usage limit
    if (!isPremium && hasExceededLimit(FEATURE_NAMES.THEORY_GENERATION)) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);
    setGeneratedTheory(null);
    setError(null);
     setShowRetryPopup(false);

    try {
      // NEW: Increment usage after passing the check
      await incrementUsage(FEATURE_NAMES.THEORY_GENERATION);

      const theory = await AIService.generateTheoryV2(subjectInput, topicInput, user.id, selectedExamLevel);
      setGeneratedTheory(theory);
      showSuccess('Theory Generated!', `Theoretical content for "${topicInput}" in ${subjectInput} (${selectedExamLevel} level) has been successfully generated.`);
    } catch (err: any) {
      console.error('Error generating theory:', err);


      const msg = err?.message ?? String(err);
    const isCapacity =
      msg.toLowerCase().includes('service tier capacity') ||
      msg.toLowerCase().includes('status 429') ||
      err?.code === 'SERVICE_TIER_CAPACITY_EXCEEDED' ||
      err?.code === '3505' ||
      err?.status === 429;

    if (isCapacity) {
      setError('Our servers are currently busy (service capacity exceeded). Please retry in a moment.');
    } else {
      setError('Failed to load theory content. Please try again.');
    }
      setShowRetryPopup(true);
      // setError('Failed to generate theory. Please try again later.');
      // showError('Generation Failed', 'Could not generate theory. Please check your input and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!theoryContentRef.current || !generatedTheory) {
      showError('Download Failed', 'No theory content to download. Please generate theory first.');
      return;
    }

    setIsLoading(true);
    const element = theoryContentRef.current;
    const opt = {
      margin: 0.5,
      filename: `${subjectInput.replace(/[^a-zA-Z0-9]/g, '_')}_${topicInput.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedExamLevel.replace(/[^a-zA-Z0-9]/g, '_')}_theory.pdf`, // Updated filename
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: false, dpi: 192, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsLoading(false);
      showSuccess('PDF Downloaded!', 'The theory content has been successfully downloaded as a PDF.');
    }).catch(error => {
      setIsLoading(false);
      showError('Download Failed', 'There was an error downloading the PDF. Please try again.');
      console.error('PDF generation error:', error);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 max-p-0 p-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-2xl text-white">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Theory Generator</h2>
        </div>
        <p className="text-blue-100">
          Generate theoretical content for any subject and topic using AI.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Generate New Theory</h3>
        
        <div className="space-y-4">
          {/* <div>
            <label htmlFor="subject-select" className="block text-sm font-medium text-slate-700 mb-2">
              Select Subject *
            </label>
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="">Choose a subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div> */}

          <div>
            <label htmlFor="subject-input" className="block text-sm font-medium text-slate-700 mb-2">
              Enter Subject *
            </label>
            <input // Changed from select to input
              id="subject-input"
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="e.g., Quantum Physics, Indian History"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 mb-2">
              Enter Topic *
            </label>
            <input
              id="topic-input"
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g., Quantum Physics, Indian History, Organic Chemistry"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="exam-level-select" className="block text-sm font-medium text-slate-700 mb-2">
              Select Exam Level *
            </label>
            <select // New select for exam level
              id="exam-level-select"
              value={selectedExamLevel}
              onChange={(e) => setSelectedExamLevel(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              {examLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerateTheory}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            disabled={isLoading || !subjectInput || !topicInput || !selectedExamLevel}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Generate Theory</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Theory Display */}
      {/* {generatedTheory && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Generated Theory</h3>
          <div className="prose max-w-none text-slate-700 bg-slate-50 p-4 rounded-lg overflow-auto max-h-96">
            <p>{generatedTheory}</p>
          </div>
        </div>
      )} */}
      {generatedTheory && (
        <div ref={theoryContentRef} className="bg-white max-py-2 max-p-0 p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="max-p-2 flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-800">Generated Theory</h3>
            <button
              onClick={handleDownloadPdf}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
          <TheoryContentDisplay content={generatedTheory} />
        </div>
      )}

      {/* Loading State */}
      {isLoading && !generatedTheory && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
          <LoadingSpinner message="We are making your content Available... Please wait" variant="brain" />
        </div>
      )}

      <UpgradePromptModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName={FEATURE_NAMES.THEORY_GENERATION}
        limit={USAGE_LIMITS.THEORY_GENERATION}
        subscriptionPageUrl={import.meta.env.VITE_SUBSCRIPTION_PAGE_URL}
      />
    </div>
  );
};

export default TheoryGeneratorPage;
