import React from 'react';

interface SuccessTrackerProps {
  progressReports: any[];
}

const SuccessTracker: React.FC<SuccessTrackerProps> = ({ progressReports }) => {
  // Sort progress reports by completion percentage (highest first)
  const sortedReports = [...progressReports]
    .filter(report => report.completion_percentage !== undefined && report.completion_percentage !== null)
    .sort((a, b) => (b.completion_percentage || 0) - (a.completion_percentage || 0));

  const progressColors = [
    'bg-green-100 text-green-800',
    'bg-blue-100 text-blue-800', 
    'bg-purple-100 text-purple-800',
    'bg-orange-100 text-orange-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800'
  ];

  if (sortedReports.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Subject Progress</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-slate-600 font-medium">No progress data yet</p>
          <p className="text-slate-500 text-sm">Complete study sessions to track progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Subject Progress</h3>
      
      <div className="space-y-4">
        {sortedReports.slice(0, 6).map((report, index) => (
          <div key={report.id} className="flex items-center space-x-4">
            <div className={`px-3 py-2 rounded-full text-sm font-medium flex-1 ${progressColors[index % progressColors.length]}`}>
              {report.subject}
            </div>
            
            <div className="flex-1 flex items-center justify-end">
              <div className="text-xs text-slate-500 mr-4 min-w-[80px]">
                {report.completion_percentage || 0}% complete
              </div>
              
              <div className="w-16 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(report.completion_percentage || 0, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedReports.length > 6 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Showing top 6 subjects • {sortedReports.length - 6} more
          </p>
        </div>
      )}

      {/* Overall stats */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-slate-800">
              {sortedReports.length > 0 
                ? Math.round(sortedReports.reduce((sum, r) => sum + (r.completion_percentage || 0), 0) / sortedReports.length)
                : 0}%
            </div>
            <div className="text-xs text-slate-500">Average Progress</div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-800">
              {sortedReports.filter(r => (r.completion_percentage || 0) >= 80).length}
            </div>
            <div className="text-xs text-slate-500">Nearly Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessTracker;