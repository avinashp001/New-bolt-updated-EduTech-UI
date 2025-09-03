// import React, { useState, useRef, useEffect } from 'react';
// import { Brain, MessageSquare, Upload, FileText, Loader, Send, User, Bot } from 'lucide-react';
// import { useDropzone } from 'react-dropzone';
// import { AIService } from '../../lib/mistralAI';
// import { PDFParser } from '../../lib/pdfParser';
// import { supabase } from '../../lib/supabase';
// import { useAuth } from '../../hooks/useAuth';
// import { useProgress } from '../../hooks/useProgress';
// import { useDetailedSchedule } from '../../hooks/useDetailedSchedule';


// interface ChatMessage {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
// }

// const EnhancedAIMentor: React.FC = () => {
//    const { user } = useAuth();
//   const { detailedSchedule, loading: detailedScheduleLoading } = useDetailedSchedule(user?.id);
//   const { progressReports, studySessions } = useProgress(user?.id, detailedSchedule, detailedScheduleLoading);
  
//   const [selectedExam, setSelectedExam] = useState('');
//   const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
//   const [currentMessage, setCurrentMessage] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const chatEndRef = useRef<HTMLDivElement>(null);

//   const examTypes = [
//     'UPSC Civil Services',
//     'SSC CGL',
//     'Banking (SBI PO/Clerk)',
//     'JEE Main/Advanced',
//     'NEET',
//     'CAT',
//     'GATE',
//     'Board Exams (Class 12)',
//     'University Exams',
//   ];

//   // Initialize with welcome message
//   useEffect(() => {
//     if (chatMessages.length === 0) {
//       const welcomeMessage: ChatMessage = {
//         id: 'welcome',
//         role: 'assistant',
//         content: `Hello! I'm your AI study mentor. I'm here to help you with your exam preparation. 

// I can assist you with:
// • Creating personalized study strategies
// • Analyzing your progress and performance
// • Answering subject-specific questions
// • Processing your study materials
// • Providing motivation and guidance

// What would you like to know about your studies today?`,
//         timestamp: new Date(),
//       };
//       setChatMessages([welcomeMessage]);
//     }
//   }, []);

//   const onDrop = async (acceptedFiles: File[]) => {
//     if (!user) {
//       alert('Please log in to upload files.');
//       return;
//     }
    
//     if (!selectedExam) {
//       alert('Please select your target exam first.');
//       return;
//     }
    
//     setIsUploading(true);
    
//     for (const file of acceptedFiles) {
//       try {
//         let fileContent: string;
        
//         // Handle different file types
//         if (file.type === 'application/pdf') {
//           try {
//             fileContent = await PDFParser.extractTextFromPDF(file);
//           } catch (pdfError) {
//             console.error('PDF extraction failed:', pdfError);
//             throw new Error(`Failed to extract text from PDF "${file.name}". The file may be corrupted, password-protected, or contain only images. Please try a different file or convert it to text format.`);
//           }
//         } else if (file.type.startsWith('text/') || 
//                    file.type === 'application/msword' || 
//                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//           try {
//             fileContent = await file.text();
//           } catch (textError) {
//             console.error('Text extraction failed:', textError);
//             throw new Error(`Failed to read text from "${file.name}". Please ensure the file is not corrupted.`);
//           }
//         } else {
//           throw new Error(`Unsupported file type for "${file.name}". Please upload PDF, TXT, DOC, or DOCX files.`);
//         }
        
//         // Validate extracted content
//         if (!PDFParser.validateFileContent(fileContent)) {
//           throw new Error(`The content from "${file.name}" appears to be empty or corrupted. Please ensure the file contains readable text and try again.`);
//         }
        
//         // Process with AI
//         const aiAnalysis = await AIService.extractPDFContent(fileContent, selectedExam);
        
//         let analysis;
//         try {
//           // Extract JSON from AI response
//           const firstBrace = aiAnalysis.indexOf('{');
//           const lastBrace = aiAnalysis.lastIndexOf('}');
          
//           if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
//             const jsonString = aiAnalysis.substring(firstBrace, lastBrace + 1);
//             analysis = JSON.parse(jsonString);
//           } else {
//             throw new Error('No valid JSON found in AI response');
//           }
//         } catch (parseError) {
//           console.error('Error parsing AI analysis:', parseError);
//           analysis = {
//             topics: ['General Content'],
//             relevanceScore: 7,
//             studyApproach: 'Review the content systematically'
//           };
//         }

//         // For demo purposes, we'll store in local state
//         // In production, you'd upload to Supabase Storage
//         const materialData = {
//           id: Date.now().toString(),
//           filename: file.name,
//           analysis,
//           uploadedAt: new Date().toISOString()
//         };

//         setUploadedFiles(prev => [...prev, materialData]);

//         // Add AI message about the uploaded file
//         const aiMessage: ChatMessage = {
//           id: Date.now().toString(),
//           role: 'assistant',
//           content: `I've analyzed "${file.name}" ${file.type === 'application/pdf' ? '(PDF content extracted)' : ''} for your ${selectedExam} preparation. Here are the key insights:

// 📊 **Relevance Score**: ${analysis.relevanceScore}/10
// 📚 **Key Topics**: ${analysis.topics?.join(', ') || 'Various topics covered'}
// 💡 **Study Approach**: ${analysis.studyApproach || 'Focus on understanding core concepts'}

// ${analysis.practiceQuestions?.length > 0 ? `\n🎯 **Practice Questions Found**: ${analysis.practiceQuestions.length} questions identified` : ''}

// Would you like me to create a study plan based on this ${file.type === 'application/pdf' ? 'extracted PDF' : ''} material or answer any specific questions about the content?`,
//           timestamp: new Date(),
//         };

//         setChatMessages(prev => [...prev, aiMessage]);

//       } catch (error) {
//         console.error('Error processing file:', error);
//         const errorMessage = error instanceof Error ? error.message : `Error processing "${file.name}". Please try again.`;
//         const errorChatMessage: ChatMessage = {
//           id: Date.now().toString(),
//           role: 'assistant',
//           content: errorMessage,
//           timestamp: new Date(),
//         };
//         setChatMessages(prev => [...prev, errorChatMessage]);
//       }
//     }
    
//     setIsUploading(false);
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'application/pdf': ['.pdf'],
//       'text/plain': ['.txt'],
//       'application/msword': ['.doc'],
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
//     },
//     multiple: true,
//     maxSize: 10 * 1024 * 1024, // 10MB limit
//   });

//   const handleSendMessage = async () => {
//     if (!currentMessage.trim()) return;

//     const userMessage: ChatMessage = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: currentMessage,
//       timestamp: new Date(),
//     };

//     setChatMessages(prev => [...prev, userMessage]);
//     setCurrentMessage('');
//     setIsProcessing(true);

//     try {
//       // Prepare user progress context
//       const userProgress = {
//         overallProgress: progressReports.reduce((sum, r) => sum + (r.completion_percentage || 0), 0) / Math.max(progressReports.length, 1),
//         totalSessions: studySessions.length,
//         subjects: progressReports.map(r => ({
//           subject: r.subject,
//           progress: r.completion_percentage,
//           weakAreas: r.weak_areas,
//           strongAreas: r.strong_areas,
//         })),
//         recentSessions: studySessions.slice(0, 5),
//         uploadedMaterials: uploadedFiles.length,
//         targetExam: selectedExam,
//       };

//       const aiResponse = await AIService.provideMentorship(
//         currentMessage,
//         userProgress,
//         selectedExam || 'General Studies'
//       );

//       const aiMessage: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: aiResponse,
//         timestamp: new Date(),
//       };

//       setChatMessages(prev => [...prev, aiMessage]);
//     } catch (error) {
//       console.error('Error getting AI response:', error);
//       const errorMessage: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: 'I apologize, but I encountered an error processing your question. Please try again or rephrase your question. I\'m here to help with your studies!',
//         timestamp: new Date(),
//       };
//       setChatMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chatMessages]);

//   return (
//     <div className="space-y-4 lg:space-y-6 px-4 lg:px-0">
//       {/* AI Mentor Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-2xl text-white">
//         <div className="flex items-center space-x-3 mb-4">
//           <Brain className="w-8 h-8" />
//           <h2 className="text-xl lg:text-2xl font-bold">Enhanced AI Mentor</h2>
//         </div>
//         <p className="text-blue-100 text-sm lg:text-base">
//           Your intelligent study companion with real-time analysis, personalized guidance, and content extraction
//         </p>
//       </div>

//       {/* Exam Selection */}
//       <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
//         <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4">Select Your Target Exam</h3>
//         <select
//           value={selectedExam}
//           onChange={(e) => setSelectedExam(e.target.value)}
//           className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         >
//           <option value="">Choose your exam type...</option>
//           {examTypes.map((exam) => (
//             <option key={exam} value={exam}>{exam}</option>
//           ))}
//         </select>
//       </div>

//       {/* File Upload Section */}
//       <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-slate-200">
//         <h3 className="text-base lg:text-lg font-semibold text-slate-800 mb-4">Upload Study Materials</h3>
        
//         <div
//           {...getRootProps()}
//           className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
//             isDragActive 
//               ? 'border-blue-400 bg-blue-50' 
//               : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
//           }`}
//         >
//           <input {...getInputProps()} />
//           <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//           {isUploading ? (
//             <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
//               <Loader className="w-5 h-5 animate-spin text-blue-600" />
//               <p className="text-blue-600">Processing files with AI...</p>
//             </div>
//           ) : (
//             <>
//               <p className="text-slate-600 mb-2">
//                 {isDragActive 
//                   ? 'Drop your files here...' 
//                   : 'Drag & drop study materials here, or click to browse'
//                 }
//               </p>
//               <p className="text-xs lg:text-sm text-slate-500">
//                 Supports PDF, DOC, DOCX, TXT files (Max 10MB each) • PDF content will be extracted automatically
//               </p>
//             </>
//           )}
//         </div>

//         {uploadedFiles.length > 0 && (
//           <div className="mt-6">
//             <h4 className="font-medium text-slate-700 mb-3">Processed Materials ({uploadedFiles.length})</h4>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               {uploadedFiles.map((file, index) => (
//                 <div key={index} className="border border-slate-200 rounded-lg p-4">
//                   <div className="flex items-start space-x-3">
//                     <FileText className="w-5 h-5 text-blue-600 mt-1" />
//                     <div className="flex-1">
//                       <h5 className="font-medium text-slate-800">{file.filename}</h5>
//                       <p className="text-xs lg:text-sm text-slate-600 mt-1">
//                         Relevance: {file.analysis?.relevanceScore || 'N/A'}/10
//                       </p>
//                       {file.filename.toLowerCase().endsWith('.pdf') && (
//                         <p className="text-xs text-blue-600 mt-1">✓ PDF content extracted</p>
//                       )}
//                       <div className="mt-2">
//                         <p className="text-xs text-slate-500">Key Topics:</p>
//                         <div className="flex flex-wrap gap-1 mt-1">
//                           {(file.analysis?.topics || []).slice(0, 3).map((topic: string, i: number) => (
//                             <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
//                               {topic}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* AI Chat Interface */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//         <div className="p-4 lg:p-6 border-b border-slate-200">
//           <h3 className="text-base lg:text-lg font-semibold text-slate-800 flex items-center space-x-2">
//             <MessageSquare className="w-5 h-5 text-green-600" />
//             <span>Chat with Your AI Mentor</span>
//           </h3>
//         </div>
        
//         <div className="h-80 lg:h-96 overflow-y-auto p-4 lg:p-6 space-y-4">
//           {chatMessages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${
//                 message.role === 'user' ? 'ml-4 sm:ml-8' : 'mr-4 sm:mr-8'
//               }`}
//             >
//               <div className={`max-w-full sm:max-w-[80%] flex items-start space-x-2 lg:space-x-3 ${
//                 message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
//               }`}>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                   message.role === 'user' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-green-100 text-green-600'
//                 }`}>
//                   {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
//                 </div>
//                 <div
//                   className={`p-3 lg:p-4 rounded-lg ${
//                     message.role === 'user'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-slate-100 text-slate-800'
//                   }`}
//                 >
//                   <div className="whitespace-pre-wrap text-sm lg:text-base">{message.content}</div>
//                   <div className={`text-xs mt-2 ${
//                     message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
//                   }`}>
//                     {message.timestamp.toLocaleTimeString()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {isProcessing && (
//             <div className="flex justify-start">
//               <div className="flex items-start space-x-2 lg:space-x-3 mr-4 sm:mr-8">
//                 <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
//                   <Bot className="w-4 h-4" />
//                 </div>
//                 <div className="bg-slate-100 p-3 lg:p-4 rounded-lg">
//                   <div className="flex items-center space-x-2">
//                     <Loader className="w-4 h-4 animate-spin text-slate-600" />
//                     <span className="text-slate-600 text-sm lg:text-base">AI is thinking...</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           <div ref={chatEndRef} />
//         </div>
        
//         <div className="p-4 lg:p-6 border-t border-slate-200">
//           <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
//             <textarea
//               value={currentMessage}
//               onChange={(e) => setCurrentMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask your AI mentor anything about your studies..."
//               className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm lg:text-base"
//               rows={2}
//               disabled={isProcessing}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={!currentMessage.trim() || isProcessing}
//               className="bg-green-600 text-white px-4 lg:px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 self-end"
//             >
//               <Send className="w-4 h-4" />
//               <span>Send</span>
//             </button>
//           </div>
          
//           {/* Quick Action Buttons */}
//           <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
//             <button
//               onClick={() => setCurrentMessage("How can I improve my study efficiency?")}
//               className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs lg:text-sm hover:bg-slate-200 transition-colors"
//             >
//               Study Tips
//             </button>
//             <button
//               onClick={() => setCurrentMessage("Analyze my recent progress and suggest improvements")}
//               className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs lg:text-sm hover:bg-slate-200 transition-colors"
//             >
//               Progress Analysis
//             </button>
//             <button
//               onClick={() => setCurrentMessage("Create a revision schedule for next week")}
//               className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs lg:text-sm hover:bg-slate-200 transition-colors"
//             >
//               Revision Plan
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnhancedAIMentor;


import React, { useState, useRef, useEffect } from 'react';
import {
  Brain,
  MessageSquare,
  Upload,
  FileText,
  Loader,
  Send,
  User,
  Bot,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Star,
  Mic,
  Image,
  Calendar,
  Paperclip,
  MoreHorizontal,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Rocket,
  Heart,
  ThumbsUp,
  ArrowRight,
  PersonStandingIcon,
  UserCircle
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { AIService } from '../../lib/mistralAI';
import { EnhancedMentor } from '../../lib/mistralAI/enhancedMentor';
import { RAGEnhancer } from '../../lib/mistralAI/ragEnhancer';
import { PDFParser } from '../../lib/pdfParser';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { useDetailedSchedule } from '../../hooks/useDetailedSchedule';
import { ChatService } from '../../services/chatService'; // NEW: Import ChatService
import { ChatMessage } from '../../lib/supabase'; // NEW: Import ChatMessage interface

// Import ReactMarkdown and remarkGfm
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';

// Define a UI-specific ChatMessage type that extends the DB ChatMessage
interface UIChatMessage extends ChatMessage {
  type?: 'text' | 'file' | 'insight'; // Custom UI type
  metadata?: { // Custom UI metadata
    fileName?: string;
    fileType?: string;
    processingTime?: number;
    confidence?: number;
  };
}


// Define custom components for ReactMarkdown rendering
const MarkdownComponents = {
  h1: ({node, ...props}: any) => <h1 className="markdown-body" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="markdown-body" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="markdown-body" {...props} />,
  h4: ({node, ...props}: any) => <h4 className="markdown-body" {...props} />,
  // MODIFIED: Custom 'p' component to handle block-level element nesting
  p: ({ node, ...props }: any) => {
    // Check if any child of the <p> node is a block-level element
    const hasBlockElement = node.children.some(
      (child: any) => child.type === 'element' && [
        'pre', 'table', 'ul', 'ol', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'
      ].includes(child.tagName)
    );
    if (hasBlockElement) {
      // If a block-level element is found, render the children directly without a <p> wrapper
      return <>{props.children}</>;
    }
    // Otherwise, render a normal <p> tag
    return <p className="markdown-body" {...props} />;
  },
  ul: ({node, ...props}: any) => <ul className="markdown-body" {...props} />,
  ol: ({node, ...props}: any) => <ol className="markdown-body" {...props} />,
  li: ({node, ...props}: any) => <li className="markdown-body" {...props} />,
  strong: ({node, ...props}: any) => <strong className="markdown-body" {...props} />,
  em: ({node, ...props}: any) => <em className="markdown-body" {...props} />,
  blockquote: ({node, ...props}: any) => <blockquote className="markdown-body" {...props} />,
  code: ({node, inline, ...props}: any) => {
    if (inline) {
      return <code className="markdown-body" {...props} />;
    }
    return <pre className="markdown-body"><code {...props} /></pre>;
  },
  a: ({node, ...props}: any) => <a className="markdown-body" {...props} />,
  table: ({node, ...props}: any) => <table className="markdown-body" {...props} />,
  thead: ({node, ...props}: any) => <thead className="markdown-body" {...props} />,
  tbody: ({node, ...props}: any) => <tbody className="markdown-body" {...props} />,
  tr: ({node, ...props}: any) => <tr className="markdown-body" {...props} />,
  th: ({node, ...props}: any) => <th className="markdown-body" {...props} />,
  td: ({node, ...props}: any) => <td className="markdown-body" {...props} />,
  br: ({node, ...props}: any) => <br className="markdown-body" {...props} />,
  // Add other HTML elements as needed for custom styling
};



const EnhancedAIMentor: React.FC = () => {
  const { user } = useAuth();
  const { detailedSchedule, loading: detailedScheduleLoading } = useDetailedSchedule(user?.id);
  const { progressReports, studySessions } = useProgress(user?.id, detailedSchedule, detailedScheduleLoading);

  const [selectedExam, setSelectedExam] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<UIChatMessage[]>([]); // Use UIChatMessage
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // Used for initial history load
  const [isUploading, setIsUploading] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false); // Used for message sending
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [mentorMode, setMentorMode] = useState<'chat' | 'analysis' | 'strategy'>('chat');
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Used for analysis/strategy generation
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const examTypes = [
    'UPSC Civil Services',
    'SSC CGL',
    'Banking (SBI PO/Clerk)',
    'JEE Main/Advanced',
    'NEET',
    'CAT',
    'GATE',
    'Board Exams (Class 12)',
    'University Exams',
  ];

  // NEW: Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user?.id) {
        setIsProcessing(true); // Indicate loading history
        try {
          const history = await ChatService.getChatHistory(user.id, 20);
          if (history.length > 0) {
            setChatMessages(history as UIChatMessage[]); // Cast to UIChatMessage[]
          } else {
            // If no history, add the welcome message
            const welcomeMessage: UIChatMessage = {
              id: 'welcome',
              user_id: user.id, // Ensure user_id is set
              role: 'assistant',
              content: `🎯 **Welcome to Dr. Rajesh Kumar - Your Expert Study Mentor!**

I'm Dr. Rajesh Kumar, your personal mentor having 15+ years of experience guiding 10,000+ students to top 100 ranks in competitive exams. I have comprehensive access to your entire study journey and will provide authentic, data-driven guidance.

**🚀 My Expertise & Your Benefits:**
• **Comprehensive Analysis** - I analyze your ${progressReports.length} subjects, ${studySessions.length} study sessions, quiz performance, and learning patterns
• **Personalized Strategies** - Based on your actual study data, not generic advice
• **Real-Time Guidance** - Immediate insights from your ${Math.round(studySessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60)}+ hours of study data
• **Weakness Resolution** - Targeted help for your specific weak areas and mistake patterns
• **Success Roadmap** - Clear path to exam success based on proven topper strategies

**💡 How I Help You:**
1. **Deep Analysis** - I know your study consistency (${Math.round((studySessions.filter(s => {
  const today = new Date().toDateString();
  const sessionDate = new Date(s.created_at).toDateString();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toDateString();
  });
  return last30Days.includes(sessionDate);
}).length / 30) * 100)}%), performance trends, and learning velocity
2. **Smart Recommendations** - Specific advice based on your ${progressReports.reduce((sum, r) => sum + (r.completion_percentage || 0), 0) / Math.max(progressReports.length, 1)}% overall progress
3. **Authentic Guidance** - Real insights from analyzing your actual study behavior and results

Ready for expert guidance based on your real study data? Let's achieve your exam goals together! ✨`,
              created_at: new Date().toISOString(), // Ensure created_at is set
              type: 'insight'
            };
            setChatMessages([welcomeMessage]);
          }
        } catch (error) {
          console.error("Failed to load chat history:", error);
          addSystemMessage("Failed to load chat history. Please refresh the page.", "error");
        } finally {
          setIsProcessing(false); // Stop loading indicator
        }
      }
    };

    loadChatHistory();
  }, [user?.id, progressReports.length, studySessions.length, studySessions]); // Dependencies for welcome message data

  const onDrop = async (acceptedFiles: File[]) => {
    if (!user?.id) { // Ensure user is logged in
      addSystemMessage('Please log in to upload files.', 'error');
      return;
    }

    if (!selectedExam) {
      addSystemMessage('Please select your target exam first.', 'warning');
      return;
    }

    setIsUploading(true);

    for (const file of acceptedFiles) {
      const startTime = Date.now();

      try {
        let fileContent: string;

        if (file.type === 'application/pdf') {
          try {
            fileContent = await PDFParser.extractTextFromPDF(file);
          } catch (pdfError) {
            console.error('PDF extraction failed:', pdfError);
            throw new Error(`Failed to extract text from PDF "${file.name}". The file may be corrupted, password-protected, or contain only images.`);
          }
        } else if (file.type.startsWith('text/') ||
          file.type === 'application/msword' ||
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          try {
            fileContent = await file.text();
          } catch (textError) {
            console.error('Text extraction failed:', textError);
            throw new Error(`Failed to read text from "${file.name}".`);
          }
        } else {
          throw new Error(`Unsupported file type for "${file.name}". Please upload PDF, TXT, DOC, or DOCX files.`);
        }

        if (!PDFParser.validateFileContent(fileContent)) {
          throw new Error(`The content from "${file.name}" appears to be empty or corrupted.`);
        }

        const aiAnalysis = await AIService.extractPDFContent(fileContent, selectedExam);
        const processingTime = Date.now() - startTime;

        let analysis;
        try {
          const firstBrace = aiAnalysis.indexOf('{');
          const lastBrace = aiAnalysis.lastIndexOf('}');

          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const jsonString = aiAnalysis.substring(firstBrace, lastBrace + 1);
            analysis = JSON.parse(jsonString);
          } else {
            throw new Error('No valid JSON found in AI response');
          }
        } catch (parseError) {
          console.error('Error parsing AI analysis:', parseError);
          analysis = {
            topics: ['General Content'],
            relevanceScore: 7,
            studyApproach: 'Review the content systematically'
          };
        }

        const materialData = {
          id: Date.now().toString(),
          filename: file.name,
          analysis,
          uploadedAt: new Date().toISOString(),
          processingTime,
          fileType: file.type
        };

        setUploadedFiles(prev => [...prev, materialData]);

        const aiMessage: UIChatMessage = { // Use UIChatMessage
          id: Date.now().toString(),
          user_id: user.id, // Ensure user_id is set
          role: 'assistant',
          content: `🎉 **Successfully analyzed "${file.name}"!**

📊 **Analysis Results:**
• **Relevance Score:** ${analysis.relevanceScore}/10 ⭐
• **Key Topics:** ${analysis.topics?.join(', ') || 'Various topics covered'}
• **Study Approach:** ${analysis.studyApproach || 'Focus on understanding core concepts'}
• **Processing Time:** ${Math.round(processingTime / 1000)}s ⚡

${analysis.practiceQuestions?.length > 0 ? `\n🎯 **Practice Questions Found:** ${analysis.practiceQuestions.length} questions identified` : ''}

**🚀 Next Steps:**
Would you like me to create a personalized study plan based on this material or answer specific questions about the content?`,
          created_at: new Date().toISOString(), // Ensure created_at is set
          type: 'file',
          metadata: {
            fileName: file.name,
            fileType: file.type,
            processingTime: Math.round(processingTime / 1000),
            confidence: analysis.relevanceScore * 10
          }
        };

        setChatMessages(prev => [...prev, aiMessage]);

      } catch (error) {
        console.error('Error processing file:', error);
        const errorMessage = error instanceof Error ? error.message : `Error processing "${file.name}". Please try again.`;
        addSystemMessage(errorMessage, 'error');
      }
    }

    setIsUploading(false);
  };

  const addSystemMessage = (content: string, type: 'error' | 'warning' | 'success' = 'error') => {
    if (!user?.id) return; // Ensure user is available

    const systemMessage: UIChatMessage = { // Use UIChatMessage
      id: Date.now().toString(),
      user_id: user.id, // Ensure user_id is set
      role: 'assistant',
      content: `${type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅'} ${content}`,
      created_at: new Date().toISOString(), // Ensure created_at is set
      type: 'insight'
    };
    setChatMessages(prev => [...prev, systemMessage]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  });

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !user?.id) return; // Ensure user is logged in

    const userMessageContent = currentMessage;
    setCurrentMessage(''); // Clear input immediately

    // Optimistically add user message to UI with a temporary ID
    const tempId = 'temp-user-' + Date.now();
    const tempUserMessage: UIChatMessage = { // Use UIChatMessage
      id: tempId,
      user_id: user.id,
      role: 'user',
      content: userMessageContent,
      created_at: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, tempUserMessage]);

    setIsSendingMessage(true); // Indicate that a message is being sent
    setIsTyping(true); // Show AI thinking indicator
    setShowQuickActions(false);

    try {
      // 1. Save user message to Supabase
      const savedUserMessage = await ChatService.saveChatMessage(user.id, 'user', userMessageContent);
      if (!savedUserMessage) throw new Error("Failed to save user message.");

      // Replace the temporary user message with the actual saved one
      setChatMessages(prev => prev.map(msg => msg.id === tempId ? { ...msg, id: savedUserMessage.id, created_at: savedUserMessage.created_at } : msg));

      // 2. Fetch the latest chat history (including the just-saved user message)
      const chatHistory = await ChatService.getChatHistory(user.id, 20); // Fetch last 20 messages

      // 3. Call AI service with current question and history
      let aiResponseContent: string;

      aiResponseContent = await EnhancedMentor.provideExpertGuidance(
        userMessageContent, // The current question
        user.id,
        selectedExam || 'General Studies',
        'general', // Context type
        chatHistory // Pass the chat history
      );

      // 4. Save AI response to Supabase
      const savedAssistantMessage = await ChatService.saveChatMessage(user.id, 'assistant', aiResponseContent);
      if (!savedAssistantMessage) throw new Error("Failed to save assistant message.");

      // 5. Add the saved assistant message to the UI
      const uiAssistantMessage: UIChatMessage = { // Use UIChatMessage
        ...savedAssistantMessage, // Contains id, user_id, role, content, created_at
        type: 'text' // Default type for AI text responses
      };
      setChatMessages(prev => [...prev, uiAssistantMessage]);

    } catch (error) {
      console.error('Error sending message to AI mentor:', error);
      const errorMessage: UIChatMessage = { // Use UIChatMessage
        id: 'error-' + Date.now(),
        user_id: user.id,
        role: 'assistant',
        content: '❌ I apologize, but I encountered an error. Please try again or rephrase your question. I\'m here to help! 💪',
        created_at: new Date().toISOString(),
        type: 'insight' // Use insight type for error messages
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSendingMessage(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    setCurrentMessage(action);
    setShowQuickActions(false);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleMentorModeChange = async (mode: 'chat' | 'analysis' | 'strategy') => {
    setMentorMode(mode);

    if (user?.id) { // Ensure user is logged in
      setIsAnalyzing(true);
      try {
        let messageContent: string;
        if (mode === 'analysis') {
          messageContent = await EnhancedMentor.analyzeStudyEffectiveness(user.id);
        } else { // mode === 'strategy'
          messageContent = await EnhancedMentor.generatePersonalizedStudyStrategy(user.id);
        }

        const aiMessage: UIChatMessage = { // Use UIChatMessage
          id: Date.now().toString(),
          user_id: user.id, // Ensure user_id is set
          role: 'assistant',
          content: messageContent,
          created_at: new Date().toISOString(), // Ensure created_at is set
          type: 'insight'
        };

        // Save the AI-generated analysis/strategy to chat history
        await ChatService.saveChatMessage(user.id, 'assistant', messageContent);

        setChatMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error(`Error getting ${mode}:`, error);
        addSystemMessage(`Failed to generate ${mode}. Please try again.`, 'error');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping, isAnalyzing]); // Add isAnalyzing to dependencies

  const quickActions = [
    { text: "Analyze my comprehensive study effectiveness and learning patterns", icon: TrendingUp, color: "text-green-600" },
    { text: "Generate a personalized study strategy based on my data", icon: Target, color: "text-purple-600" },
    { text: "How can I optimize my study efficiency using my performance data?", icon: Zap, color: "text-blue-600" },
    { text: "What specific improvements should I make based on my mistake patterns?", icon: Brain, color: "text-orange-600" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 lg:px-0">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-br dark:from-slate-800 dark:via-gray-800 dark:to-slate-950 from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-3xl text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-24 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
              <PersonStandingIcon className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Dr. Rajesh Kumar - Expert Mentor</h2>
              <p className="text-indigo-100 text-sm">
                15+ Years Experience | 10,000+ Top Rankers Mentored | Comprehensive Data Analysis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <Brain className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
              <div className="text-sm text-indigo-100">Expert Mentorship</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-300 mx-auto mb-2" />
              <div className="text-sm text-indigo-100">Data-Driven Insights</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <Target className="w-6 h-6 text-blue-300 mx-auto mb-2" />
              <div className="text-sm text-indigo-100">Authentic Guidance</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <Sparkles className="w-6 h-6 text-purple-300 mx-auto mb-2" />
              <div className="text-sm text-indigo-100">Success Strategies</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Panel - Configuration */}
        <div className="xl:col-span-1 space-y-6">
          {/* File Upload */}
          <div className="bg-white dark:bg-slate-700/40 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-purple-600" />
                <span>Study Materials Analysis</span>
              </h3>
            </div>
            <div className="p-6">
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  isDragActive
                    ? 'border-purple-400 bg-purple-50 scale-105'
                    : 'border-slate-300 hover:border-purple-400 hover:bg-slate-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  {isUploading ? (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
                        <Brain className="w-6 h-6 text-purple-600 absolute top-3 left-3" />
                      </div>
                      <p className="text-purple-600 font-medium">AI is analyzing your content...</p>
                      <div className="flex items-center space-x-2 text-sm text-purple-500">
                        <Sparkles className="w-4 h-4" />
                        <span>Extracting knowledge and insights</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-slate-700 dark:text-white/80 font-medium mb-2">
                          {isDragActive
                            ? '✨ Drop your files here...'
                            : '📚 Upload study materials for AI analysis'
                          }
                        </p>
                        <p className="text-sm dark:text-white/80 text-slate-500">
                          PDF, DOC, DOCX, TXT • Max 10MB • Content will be extracted automatically
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-slate-700 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span>Processed Materials ({uploadedFiles.length})</span>
                  </h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-slate-800 truncate">{file.filename}</h5>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-slate-500">
                              Relevance: {file.analysis?.relevanceScore || 'N/A'}/10
                            </span>
                            <span className="text-xs text-green-600">
                              ✓ {file.processingTime}s processing
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Exam Selection */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>Target Exam</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="relative">
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none bg-white text-slate-800 font-medium"
                >
                  <option value="">Choose your exam type...</option>
                  {examTypes.map((exam) => (
                    <option key={exam} value={exam}>{exam}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
              {selectedExam && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 font-medium text-sm">Exam selected: {selectedExam}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:border-gray-500 dark:bg-slate-900 dark:text-white/80 rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-[700px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between"
                style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div className="flex items-center space-x-3">
                  {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600    rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div> */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Dr. Rajesh Kumar - Expert Mentor</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-blue-600 font-medium">
                        {isProcessing ? 'Loading chat history...' : 'Online'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mentor Mode Selector */}
                <div className="flex items-center space-x-2">
                  <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => handleMentorModeChange('chat')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        mentorMode === 'chat' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => handleMentorModeChange('analysis')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        mentorMode === 'analysis' ? 'bg-green-600 text-white' : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      Analysis
                    </button>
                    <button
                      onClick={() => handleMentorModeChange('strategy')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        mentorMode === 'strategy' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      Strategy
                    </button>
                  </div>
                  <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-2 space-y-6 bg-gradient-to-b dark: from-slate-800/60 dark:to-slate-900 from-slate-50/30 to-white">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${
                    message.role === 'user' ? 'ml-8' : 'mr-8'
                  }`}
                >
                  <div className={`max-w-[100%] flex items-start space-x-1 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                    style={{ flexDirection: message.role === 'user' ? 'column' : 'column',
                           alignItem: message.role === 'user'? 'items-end' : 'items-start'}}>
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        : message.type === 'insight'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600'
                      }`}>
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : message.type === 'insight' ? (
                        <Lightbulb className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`relative p-4 max-[400px]:max-w-[100%] mt-2 dark:border-gray-500 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r dark:from-gray-600 dark:to-gray-600 from-blue-500 to-indigo-600 text-white'
                          : message.type === 'insight'
                            ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-slate-800 border border-purple-200'
                            : 'bg-white dark:bg-teal-900 dark:text-white/90 text-slate-800 border border-slate-200'
                        }`}
                    >
                      {/* Message Content */}
                      <div className="max-[450px]:overflow-x-auto whitespace-pre-wrap text-sm lg:text-base leading-relaxed" style={{scrollbarWidth: 'thin'}}>
                        <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                      </div>

                      {/* Metadata */}
                      {message.metadata && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <div className="flex items-center space-x-4 text-xs">
                            {message.metadata.fileName && (
                              <div className="flex items-center space-x-1">
                                <FileText className="w-3 h-3" />
                                <span>{message.metadata.fileName}</span>
                              </div>
                            )}
                            {message.metadata.processingTime && (
                              <div className="flex items-center space-x-1">
                                <Zap className="w-3 h-3" />
                                <span>{message.metadata.processingTime}s</span>
                              </div>
                            )}
                            {message.metadata.confidence && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3" />
                                <span>{message.metadata.confidence}% confidence</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className={`text-xs mt-3 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </div>

                      {/* Message Actions */}
                      {message.role === 'assistant' && (
                        <div className="flex items-center space-x-2 mt-3">
                          <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                            <ThumbsUp className="w-3 h-3 text-slate-400 hover:text-green-500" />
                          </button>
                          <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                            <Heart className="w-3 h-3 text-slate-400 hover:text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isAnalyzing && (
                <div className="flex justify-start mr-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-2xl shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-400 border-t-purple-600"></div>
                        <span className="text-purple-800 text-sm font-medium">Analyzing your comprehensive study data...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isTyping && (
                <div className="flex justify-start mr-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-slate-600 text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Enhanced Input Area */}
            <div className="border-t dark:bg-slate-900 dark:border-slate-900 border-slate-200 bg-white">
              {/* Quick Actions */}
              {showQuickActions && chatMessages.length <= 1 && (
                <div className="px-6 py-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <Rocket className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-slate-700">Quick Start</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.text)}
                        className="flex items-center space-x-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-200 text-left group"
                      >
                        <action.icon className={`w-4 h-4 ${action.color}`} />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900">{action.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Field */}
              <div className="p-6"
                style={{ borderTopColor: 'rgba(13, 21, 36, 0.5) !important' }}>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask your mentor anything about your studies..."
                      className="max-[400px]:text-xs text-sm w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 resize-none text-slate-800 placeholder-slate-400"
                      rows={2}
                      disabled={isProcessing || isSendingMessage || isAnalyzing} // Disable if processing, sending, or analyzing
                    />
                    <div className="absolute right-3 bottom-3 flex items-center space-x-1">
                      <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                        <Paperclip className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                        <Mic className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isProcessing || isSendingMessage || isAnalyzing} // Disable if processing, sending, or analyzing
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                  >
                    {isSendingMessage ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span>Press Enter to send</span>
                    <span>•</span>
                    <span>Shift + Enter for new line</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {currentMessage.length}/1000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      {user?.id && (
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 text-white shadow-2xl hidden md:block">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-10 bg-gradient-to-r from-green-600 to-emerald-800 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Expert Mentor Capabilities</h3>
              <p className="text-indigo-200">Comprehensive analysis of your learning journey</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-2">{studySessions.length}</div>
              <div className="text-sm text-indigo-200">Study Sessions Analyzed</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-2">{progressReports.length}</div>
              <div className="text-sm text-indigo-200">Subjects Tracked</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <Brain className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-2">{Math.round(studySessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60)}</div>
              <div className="text-sm text-indigo-200">Hours of Data Analyzed</div>
            </div>
          </div>
        </div>
      )}

      {progressReports.length > 0 && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Real-Time Learning Insights</h3>
              <p className="text-slate-300">Real-time analysis of your learning patterns</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span className="font-semibold">Learning Velocity</span>
              </div>
              <p className="text-slate-300 text-sm">
                {studySessions.length > 0 ?
                  `${Math.round((studySessions.reduce((sum, s) => sum + (s.topics_covered?.length || 0), 0) / Math.max(studySessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60, 1)) * 100) / 100} topics/hour learning rate` :
                  'Start studying to track your learning velocity'
                }
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-orange-400" />
                <span className="font-semibold">Performance Trend</span>
              </div>
              <p className="text-slate-300 text-sm">
                {studySessions.length >= 5 ?
                  (() => {
                    const recent = studySessions.slice(0, 5).reduce((sum, s) => sum + s.performance_score, 0) / 5;
                    const older = studySessions.slice(5, 10).reduce((sum, s) => sum + s.performance_score, 0) / Math.max(studySessions.slice(5, 10).length, 1);
                    const trend = recent > older ? 'Improving' : recent < older ? 'Declining' : 'Stable';
                    return `${trend} trend (${Math.round(recent * 100) / 100}/10 recent avg)`;
                  })() :
                  'Complete more sessions for trend analysis'
                }
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
                <span className="font-semibold">Exam Readiness</span>
              </div>
              <p className="text-slate-300 text-sm">
                {progressReports.length > 0 ?
                  `${Math.round(progressReports.reduce((sum, r) => sum + (r.completion_percentage || 0), 0) / progressReports.length)}% overall progress` :
                  'Start studying to assess exam readiness'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expert Mentor Features */}
      <div className="hidden md-block bg-white dark:bg-teal-950/60 dark:text-white/80 dark:border-teal-900 rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r dark:from-emerald-900/50 dark:to-emerald-900/20 from-slate-50 to-gray-50 px-8 py-6 dark:border-emerald-900 border-b border-slate-200">
          <h3 className="text-2xl dark:text-white/80 font-bold text-slate-800 mb-2">Expert Mentor Features</h3>
          <p className="dark:text-white/80 text-slate-600">Leverage 15+ years of mentoring experience with comprehensive data analysis</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => handleMentorModeChange('analysis')}
              disabled={isAnalyzing}
              className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 disabled:opacity-50"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Study Effectiveness Analysis</h4>
                <p className="text-slate-600 text-sm mb-4">Get comprehensive analysis of your learning patterns, efficiency, and areas for optimization</p>
                <div className="flex items-center text-green-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                  <span>{isAnalyzing ? 'Analyzing...' : 'Get Analysis'}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </button>

            <button
              onClick={() => handleMentorModeChange('strategy')}
              disabled={isAnalyzing}
              className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 disabled:opacity-50"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Personalized Study Strategy</h4>
                <p className="text-slate-600 text-sm mb-4">Get a customized study strategy based on your performance data and learning patterns</p>
                <div className="flex items-center text-purple-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                  <span>{isAnalyzing ? 'Generating...' : 'Get Strategy'}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </button>

            <div className="group relative overflow-hidden bg-gradient-to-br dark:from-sky-100 dark:to-indigo-100 from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Real-Time Guidance</h4>
                <p className="text-slate-600 text-sm mb-4">Ask specific questions and get expert guidance based on your complete study profile</p>
                <div className="flex items-center text-blue-600 font-medium text-sm">
                  <span>Chat Above</span>
                  <MessageSquare className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIMentor;
