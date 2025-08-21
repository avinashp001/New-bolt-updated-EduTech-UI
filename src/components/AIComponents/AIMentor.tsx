import React, { useState } from 'react';
import { Brain, MessageSquare, Upload, Target, TrendingUp } from 'lucide-react';

const AIMentor: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const examTypes = [
    'Government Exams (UPSC, SSC, Banking)',
    'Entrance Exams (JEE, NEET, CAT)',
    'Academic Exams (Board Exams, University)'
  ];

  const aiInsights = [
    {
      title: 'Study Pattern Analysis',
      description: 'Based on your progress, focus more on Mathematics and Physics',
      icon: TrendingUp,
      priority: 'high'
    },
    {
      title: 'Weak Area Detection',
      description: 'Organic Chemistry needs 40% more practice time',
      icon: Target,
      priority: 'medium'
    },
    {
      title: 'Performance Prediction',
      description: 'Current trajectory suggests 85% success probability',
      icon: Brain,
      priority: 'info'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Mentor Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-2xl text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <h2 className="text-2xl font-bold">AI Mentor</h2>
        </div>
        <p className="text-blue-100">
          Your personalized AI guide for exam preparation with intelligent insights and recommendations
        </p>
      </div>

      {/* Exam Selection */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Your Target Exam</h3>
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose your exam type...</option>
          {examTypes.map((exam) => (
            <option key={exam} value={exam}>{exam}</option>
          ))}
        </select>
      </div>

      {/* PDF Upload Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Upload Study Materials</h3>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">
            Upload PDFs, textbooks, or study materials for content extraction
          </p>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Choose Files
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-slate-700 mb-2">Uploaded Files:</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>{file}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <span>AI-Generated Insights</span>
        </h3>
        
        <div className="space-y-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
              <div className={`p-2 rounded-lg ${
                insight.priority === 'high' ? 'bg-red-100 text-red-600' :
                insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <insight.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800">{insight.title}</h4>
                <p className="text-slate-600 text-sm mt-1">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat Interface */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-green-600" />
          <span>Ask Your AI Mentor</span>
        </h3>
        
        <div className="border border-slate-200 rounded-lg p-4 mb-4 h-40 overflow-y-auto bg-slate-50">
          <div className="text-slate-500 text-sm">
            Start a conversation with your AI mentor. Ask about study strategies, exam tips, or get personalized recommendations.
          </div>
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Ask your AI mentor anything..."
            className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIMentor;