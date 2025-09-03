import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, BookOpen, Target, CheckCircle } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import { useAuth } from '../../hooks/useAuth';
import { useDetailedSchedule } from '../../hooks/useDetailedSchedule';


const StudySessionTracker: React.FC = () => {
  const { user } = useAuth();
  // const { addStudySession, studySessions, getWeeklyStudyHours } = useProgress(user?.id);
  const { detailedSchedule, loading: detailedScheduleLoading } = useDetailedSchedule(user?.id); 
  const { addStudySession, studySessions, getWeeklyStudyHours } = useProgress(user?.id, detailedSchedule, detailedScheduleLoading);
  
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topicsCovered, setTopicsCovered] = useState('');
  const [performanceScore, setPerformanceScore] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'History', 'Geography', 'Economics', 'Political Science',
    'English', 'Current Affairs', 'Reasoning', 'General Knowledge'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedSubject) {
      alert('Please select a subject before starting the timer.');
      return;
    }
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleStop = async () => {
    if (!user || !selectedSubject || time === 0) {
      alert('Please ensure you have selected a subject and studied for some time.');
      return;
    }

    setIsLoading(true);
    
    try {
      const topics = topicsCovered.split(',').map(t => t.trim()).filter(t => t);
      const durationMinutes = Math.max(1, Math.floor(time / 60)); // Ensure at least 1 minute
      
      await addStudySession({
        user_id: user.id,
        subject: selectedSubject,
        duration_minutes: durationMinutes,
        topics_covered: topics,
        performance_score: performanceScore,
      });

      // Reset timer and show success
      setIsActive(false);
      setTime(0);
      setTopicsCovered('');
      setPerformanceScore(7);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error saving study session:', error);
      alert('Error saving study session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  const weeklyHours = getWeeklyStudyHours();
  const todaysSessions = studySessions.filter(session => {
    const today = new Date().toDateString();
    const sessionDate = new Date(session.created_at).toDateString();
    return today === sessionDate;
  });

  return (
    <div className="max-w-4xl max-p-2 mx-auto space-y-4 lg:space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 lg:p-4 flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-green-800 font-medium">Study session saved successfully!</p>
            <p className="text-green-600 text-xs lg:text-sm">Your progress has been updated and analyzed.</p>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 lg:p-8 rounded-2xl text-white text-center">
        <div className="mb-4">
          <Clock className="w-10 lg:w-12 h-10 lg:h-12 mx-auto mb-2" />
          <h2 className="text-xl lg:text-2xl font-bold">Study Session Timer</h2>
          <p className="text-indigo-100 mt-2 text-sm lg:text-base">
            {selectedSubject ? `Studying: ${selectedSubject}` : 'Select a subject to begin'}
          </p>
        </div>
        
        <div className="text-4xl lg:text-6xl font-mono font-bold mb-6">
          {formatTime(time)}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          {!isActive ? (
            <button
              onClick={handleStart}
              disabled={!selectedSubject}
              className="bg-white text-indigo-600 px-4 lg:px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="bg-white text-indigo-600 px-4 lg:px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </button>
          )}
          
          <button
            onClick={handleStop}
            disabled={time === 0 || !selectedSubject || isLoading}
            className="bg-red-500 text-white px-4 lg:px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Square className="w-5 h-5" />
            <span>{isLoading ? 'Saving...' : 'Stop & Save'}</span>
          </button>
          
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 lg:px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Session Details */}
      <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Session Details</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subject *
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isActive}
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Topics Covered (comma-separated)
            </label>
            <textarea
              value={topicsCovered}
              onChange={(e) => setTopicsCovered(e.target.value)}
              placeholder="e.g., Algebra, Quadratic Equations, Functions"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Performance Score: {performanceScore}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={performanceScore}
              onChange={(e) => setPerformanceScore(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
              <span>Poor (1)</span>
              <span>Average (5)</span>
              <span>Excellent (10)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
          <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-xs lg:text-sm text-slate-600">Current Session</p>
          <p className="text-lg lg:text-xl font-bold text-slate-800">{Math.floor(time / 60)}m</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
          <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-xs lg:text-sm text-slate-600">Subject</p>
          <p className="text-sm lg:text-lg font-semibold text-slate-800 truncate">
            {selectedSubject || 'Not selected'}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-purple-600 font-bold">{performanceScore}</span>
          </div>
          <p className="text-xs lg:text-sm text-slate-600">Performance</p>
          <p className="text-lg lg:text-lg font-semibold text-slate-800">{performanceScore}/10</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
          <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-xs lg:text-sm text-slate-600">Weekly Hours</p>
          <p className="text-lg lg:text-xl font-bold text-slate-800">{weeklyHours}h</p>
        </div>
      </div>

      {/* Today's Sessions */}
      {todaysSessions.length > 0 && (
        <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4">Today's Study Sessions</h3>
          <div className="space-y-3">
            {todaysSessions.map((session, index) => (
              <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-lg space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{session.subject}</p>
                    <p className="text-xs lg:text-sm text-slate-600">
                      {session.topics_covered.length > 0 ? session.topics_covered.join(', ') : 'No topics specified'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">{session.duration_minutes}m</p>
                  <p className="text-xs lg:text-sm text-slate-600">Score: {session.performance_score}/10</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySessionTracker;