// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate, useLocation } from 'react-router-dom';
// // import { ArrowLeft, BookOpen, Brain, Loader, Play, FileText, Lightbulb, Target, CheckCircle } from 'lucide-react';
// // import { AIService } from '../../lib/mistralAI';
// // import katex from 'katex';
// // import 'katex/dist/katex.min.css';


// // const TheoryView: React.FC<{ userId: string }> = ({ userId }) => {
// //   const navigate = useNavigate();
// //   const { subject: subjectParam, topic: topicParam } = useParams<{ subject: string; topic: string }>();
// //   const [theoryContent, setTheoryContent] = useState<string>('');
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string>('');

// //   // Redirect if no parameters
// //   if (!subjectParam || !topicParam) {
// //     navigate('/courses');
// //     return null;
// //   }

// //   const subject = decodeURIComponent(subjectParam);
// //   const topic = decodeURIComponent(topicParam);

// //   const handleProceedToAssessment = () => {
// //     navigate('/courses/theory-quiz', {
// //       state: {
// //         subject: subject,
// //         topic: topic,
// //         theoryContent: theoryContent
// //       }
// //     });
// //   };

// //   const handleBack = () => {
// //     navigate(`/courses/${encodeURIComponent(subject)}`);
// //   };
// //   useEffect(() => {
// //     const fetchTheory = async () => {
// //       if (!subject || !topic || !userId) return;

// //       setLoading(true);
// //       setError('');

// //       try {
// //         const content = await AIService.generateTheory(subject, topic, userId);
// //         setTheoryContent(content);
// //       } catch (err) {
// //         console.error('Error fetching theory:', err);
// //         setError('Failed to load theory content. Please try again.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchTheory();
// //   }, [subject, topic, userId]);

// //   const formatTheoryContent = (content: string) => {
// //     // Clean markdown-like formatting to HTML matching reference image style
// //     let formattedContent = content;
    
// //     // First, protect math expressions from other processing
// //     const mathExpressions: { [key: string]: string } = {};
// //     let mathCounter = 0;
    
// //     // Extract display math ($$...$$)
// //     formattedContent = formattedContent.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
// //       const placeholder = `__DISPLAY_MATH_${mathCounter}__`;
// //       mathExpressions[placeholder] = math.trim();
// //       mathCounter++;
// //       return placeholder;
// //     });
    
// //     // Extract inline math ($...$)
// //     formattedContent = formattedContent.replace(/\$([^$\n]+?)\$/g, (match, math) => {
// //       const placeholder = `__INLINE_MATH_${mathCounter}__`;
// //       mathExpressions[placeholder] = math.trim();
// //       mathCounter++;
// //       return placeholder;
// //     });
    
// //     // Process tables (GitHub Flavored Markdown style)
// //     formattedContent = formattedContent.replace(/^\|(.+)\|$/gm, (match, content) => {
// //       const cells = content.split('|').map(cell => cell.trim());
// //       return `__TABLE_ROW__${cells.join('__CELL_SEPARATOR__')}__TABLE_ROW_END__`;
// //     });
    
// //     // Convert table rows to HTML
// //     const tableRows = formattedContent.match(/__TABLE_ROW__(.*?)__TABLE_ROW_END__/g);
// //     if (tableRows && tableRows.length > 0) {
// //       let tableHtml = '<div class="overflow-x-auto my-8 rounded-xl border border-slate-200 shadow-lg bg-white">';
// //       tableHtml += '<table class="min-w-full divide-y divide-slate-200">';
      
// //       tableRows.forEach((row, index) => {
// //         const cells = row.replace(/__TABLE_ROW__|__TABLE_ROW_END__/g, '').split('__CELL_SEPARATOR__');
// //         const isHeader = index === 0 || (index === 1 && cells.every(cell => cell.match(/^[-:]+$/)));
        
// //         if (isHeader && !cells.every(cell => cell.match(/^[-:]+$/))) {
// //           tableHtml += '<thead class="bg-gradient-to-r from-slate-50 to-slate-100"><tr>';
// //           cells.forEach(cell => {
// //             tableHtml += `<th class="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide border-r border-slate-200 last:border-r-0">${cell}</th>`;
// //           });
// //           tableHtml += '</tr></thead><tbody class="divide-y divide-slate-100">';
// //         } else if (!cells.every(cell => cell.match(/^[-:]+$/))) {
// //           tableHtml += '<tr class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">';
// //           cells.forEach(cell => {
// //             tableHtml += `<td class="px-6 py-4 text-sm text-slate-800 border-r border-slate-100 last:border-r-0 leading-relaxed">${cell}</td>`;
// //           });
// //           tableHtml += '</tr>';
// //         }
// //       });
      
// //       tableHtml += '</tbody></table></div>';
      
// //       // Replace all table rows with the complete table
// //       formattedContent = formattedContent.replace(/__TABLE_ROW__(.*?)__TABLE_ROW_END__/g, '');
// //       formattedContent = formattedContent + tableHtml;

// //     }
    
// //     // Process headings with enhanced typography and spacing
// //     formattedContent = formattedContent
// //       .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-6 theory-heading-h1">$1</h1>')
// //       .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 mt-5 theory-heading-h2">$1</h2>')
// //       .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-3 mt-4  theory-heading-h3">$1</h3>')
// //       .replace(/^#### (.*$)/gm, '<h4 class="text-base font-bold mb-2 mt-3 theory-heading-h4">$1</h4>');
    
// //     // Process bold and italic text with simple styling
// //     formattedContent = formattedContent
// //       .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
// //       .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');
    
// //     // Process code blocks and inline code with simple styling
// //     formattedContent = formattedContent
// //       .replace(/```([\s\S]*?)```/g, '<div class="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto"><pre class="text-slate-800 whitespace-pre-wrap">$1</pre></div>')
// //       .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-slate-800 px-2 py-1 rounded text-sm font-mono">$1</code>');
    
// //     // Split content into lines for processing
// //     const lines = formattedContent.split('\n');
// //     const processedLines: string[] = [];
// //     let inList = false;
// //     let listType = '';
    
// //     for (let i = 0; i < lines.length; i++) {
// //       const line = lines[i].trim();
      
// //       // Skip empty lines but add spacing
// //       if (!line) {
// //         if (inList) {
// //           processedLines.push(`</${listType}>`);
// //           inList = false;
// //         }
// //         processedLines.push('<div class="h-6"></div>');
// //         continue;
// //       }
      
// //       // Check if line is already a heading or HTML element
// //       if (line.startsWith('<h') || line.startsWith('<div') || line.startsWith('<pre') || line.startsWith('<table')) {
// //         if (inList) {
// //           processedLines.push(`</${listType}>`);
// //           inList = false;
// //         }
// //         processedLines.push(line);
// //         continue;
// //       }
      
// //       // Process bullet points and numbered lists
// //       const bulletMatch = line.match(/^[-•*]\s+(.+)$/);
// //       const numberedMatch = line.match(/^\d+\.\s+(.+)$/);
      
// //       if (bulletMatch) {
// //         if (!inList || listType !== 'ul') {
// //           if (inList) processedLines.push(`</${listType}>`);
// //           processedLines.push('<ul class="list-disc ml-6 mb-4 space-y-2">');
// //           inList = true;
// //           listType = 'ul';
// //         }
// //         processedLines.push(`<li class="text-slate-800 leading-relaxed">${bulletMatch[1]}</li>`);
// //       } else if (numberedMatch) {
// //         if (!inList || listType !== 'ol') {
// //           if (inList) processedLines.push(`</${listType}>`);
// //           processedLines.push('<ol class="list-decimal ml-6 mb-4 space-y-2">');
// //           inList = true;
// //           listType = 'ol';
// //         }
// //         processedLines.push(`<li class="text-slate-800 leading-relaxed">${numberedMatch[1]}</li>`);
// //       } else {
// //         if (inList) {
// //           processedLines.push(`</${listType}>`);
// //           inList = false;
// //         }
// //         // Regular paragraph
// //         if (line) {
// //           processedLines.push(`<p class="text-slate-800 leading-relaxed mb-4">${line}</p>`);
// //         }
// //       }
// //     }
    
// //     // Close any remaining list
// //     if (inList) {
// //       processedLines.push(`</${listType}>`);
// //     }
    
// //     // Join all processed lines to create finalContent
// //     let finalContent = processedLines.join('\n');
    
// //     // Restore math expressions and render them
// //     Object.keys(mathExpressions).forEach(placeholder => {
// //       const mathContent = mathExpressions[placeholder];
// //       if (placeholder.includes('DISPLAY_MATH')) {
// //         // For display math, we'll use a placeholder that will be processed by a custom component
// //         finalContent = finalContent.replace(placeholder, `<div class="math-display my-4 text-center" data-math="${encodeURIComponent(mathContent)}"></div>`);
// //       } else if (placeholder.includes('INLINE_MATH')) {
// //         // For inline math, we'll use a placeholder that will be processed by a custom component
// //         finalContent = finalContent.replace(placeholder, `<span class="math-inline" data-math="${encodeURIComponent(mathContent)}"></span>`);
// //       }
// //     });
    
// //     return finalContent;
// //   };

// //   // Component to render math expressions
// //   const MathRenderer: React.FC<{ content: string }> = ({ content }) => {
// //     const containerRef = React.useRef<HTMLDivElement>(null);
    
// //     React.useEffect(() => {
// //       if (containerRef.current) {
// //         // Find and render display math
// //         const displayMathElements = containerRef.current.querySelectorAll('.math-display');
// //         displayMathElements.forEach((element) => {
// //           const mathContent = decodeURIComponent(element.getAttribute('data-math') || '');
// //           const mathDiv = document.createElement('div');
// //           element.appendChild(mathDiv);
          
// //           try {
// //             katex.render(mathContent, mathDiv, {
// //               displayMode: true,
// //               throwOnError: false,
// //               errorColor: '#cc0000',
// //             });
// //           } catch (error) {
// //             mathDiv.textContent = `Error rendering math: ${mathContent}`;
// //             mathDiv.className = 'text-red-600 text-sm';
// //           }
// //         });
        
// //         // Find and render inline math
// //         const inlineMathElements = containerRef.current.querySelectorAll('.math-inline');
// //         inlineMathElements.forEach((element) => {
// //           const mathContent = decodeURIComponent(element.getAttribute('data-math') || '');
// //           const mathSpan = document.createElement('span');
// //           element.appendChild(mathSpan);
          
// //           try {
// //             katex.render(mathContent, mathSpan, {
// //               displayMode: false,
// //               throwOnError: false,
// //               errorColor: '#cc0000',
// //             });
// //           } catch (error) {
// //             mathSpan.textContent = `Error: ${mathContent}`;
// //             mathSpan.className = 'text-red-600 text-sm';
// //           }
// //         });
// //       }
// //     }, [content]);
    
// //     return (
// //       <div 
// //         ref={containerRef}
// //         className="theory-content max-w-none"
// //         dangerouslySetInnerHTML={{ __html: content }}
// //       />
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <div className="max-w-4xl mx-auto space-y-6">
// //         {/* Header */}
// //         <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-2xl text-white">
// //           <div className="flex items-center space-x-3 mb-4">
// //             <BookOpen className="w-8 h-8" />
// //             <h2 className="text-2xl font-bold">Theory: {topic}</h2>
// //           </div>
// //           <p className="text-green-100">
// //             Subject: {subject} • AI-Generated from Your Study Materials
// //           </p>
// //         </div>

// //         {/* Loading State */}
// //         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
// //           <div className="flex flex-col items-center justify-center py-12">
// //             <div className="relative mb-6">
// //               <Loader className="w-12 h-12 animate-spin text-blue-600" />
// //               <Brain className="w-6 h-6 text-blue-600 absolute top-3 left-3" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-slate-800 mb-2">Generating Theory Content</h3>
// //             <p className="text-slate-600 text-center max-w-md">
// //               AI is analyzing your uploaded study materials and generating comprehensive theory content for <strong>{topic}</strong> in {subject}...
// //             </p>
// //             <div className="mt-4 flex items-center space-x-2 text-sm text-slate-500">
// //               <FileText className="w-4 h-4" />
// //               <span>Processing uploaded materials with RAG technology</span>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="max-w-4xl mx-auto space-y-6">
// //         {/* Header */}
// //         <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 rounded-2xl text-white">
// //           <div className="flex items-center space-x-3 mb-4">
// //             <BookOpen className="w-8 h-8" />
// //             <h2 className="text-2xl font-bold">Theory: {topic}</h2>
// //           </div>
// //           <p className="text-red-100">
// //             Subject: {subject} • Error Loading Content
// //           </p>
// //         </div>

// //         {/* Error State */}
// //         <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-200">
// //           <div className="text-center py-8">
// //             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <span className="text-2xl">⚠️</span>
// //             </div>
// //             <h3 className="text-xl font-semibold text-slate-800 mb-2">Failed to Load Theory</h3>
// //             <p className="text-slate-600 mb-6">{error}</p>
// //             <div className="flex justify-center space-x-4">
// //               <button
// //                 onClick={() => window.location.reload()}
// //                 className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
// //               >
// //                 Try Again
// //               </button>
// //               <button
// //                 onClick={handleBack}
// //                 className="bg-slate-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
// //               >
// //                 Go Back
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="max-w-4xl mx-auto space-y-6">
// //       {/* Header */}
// //       <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-2xl text-white">
// //         <div className="flex items-center space-x-3 mb-4">
// //           <BookOpen className="w-8 h-8" />
// //           <h2 className="text-2xl font-bold">Theory: {topic}</h2>
// //         </div>
// //         <p className="text-green-100">
// //           Subject: {subject} • AI-Generated from Your Study Materials
// //         </p>
// //         <div className="mt-4 flex items-center space-x-4 text-sm">
// //           <div className="flex items-center space-x-2">
// //             <Brain className="w-4 h-4" />
// //             <span>RAG-Enhanced Content</span>
// //           </div>
// //           <div className="flex items-center space-x-2">
// //             <FileText className="w-4 h-4" />
// //             <span>Based on Uploaded Materials</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Theory Content */}
// //       <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
// //         <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
// //           <div className="flex items-center justify-between">
// //             <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
// //               <Lightbulb className="w-5 h-5 text-yellow-600" />
// //               <span>Comprehensive Theory</span>
// //             </h3>
// //             <div className="flex items-center space-x-2 text-sm text-slate-600">
// //               <Target className="w-4 h-4" />
// //               <span>Exam-Focused Content</span>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="p-6 bg-white">
// //           <MathRenderer content={formatTheoryContent(theoryContent)} />
// //         </div>
// //       </div>

// //       {/* Action Buttons */}
// //       <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
// //         <button
// //           onClick={handleBack}
// //           className="flex items-center justify-center space-x-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
// //         >
// //           <ArrowLeft className="w-5 h-5" />
// //           <span>Back to Course</span>
// //         </button>
        
// //         <button
// //           onClick={handleProceedToAssessment}
// //           className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all shadow-lg"
// //         >
// //           <Play className="w-5 h-5" />
// //           <span>Proceed to AI Assessment</span>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TheoryView;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft, BookOpen, Brain, Loader, Play, FileText, Lightbulb, Target, CheckCircle } from 'lucide-react';
// import { AIService } from '../../lib/mistralAI';
// import katex from 'katex';
// import 'katex/dist/katex.min.css';


// const TheoryView: React.FC<{ userId: string }> = ({ userId }) => {
//   const navigate = useNavigate();
//   const { subject: subjectParam, topic: topicParam } = useParams<{ subject: string; topic: string }>();
//   const [theoryContent, setTheoryContent] = useState<string>('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>('');

//   // Redirect if no parameters
//   if (!subjectParam || !topicParam) {
//     navigate('/courses');
//     return null;
//   }

//   const subject = decodeURIComponent(subjectParam);
//   const topic = decodeURIComponent(topicParam);

//   const handleProceedToAssessment = () => {
//     navigate('/courses/theory-quiz', {
//       state: {
//         subject: subject,
//         topic: topic,
//         theoryContent: theoryContent
//       }
//     });
//   };

//   const handleBack = () => {
//     navigate(`/courses/${encodeURIComponent(subject)}`);
//   };
//   useEffect(() => {
//     const fetchTheory = async () => {
//       if (!subject || !topic || !userId) return;

//       setLoading(true);
//       setError('');

//       try {
//         const content = await AIService.generateTheory(subject, topic, userId);
//         setTheoryContent(content);
//       } catch (err) {
//         console.error('Error fetching theory:', err);
//         setError('Failed to load theory content. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTheory();
//   }, [subject, topic, userId]);

//   const formatTheoryContent = (content: string) => {
//     // --- START: New text normalization for clean formatting ---
//     let formattedContent = content;

//     // Normalize line endings to Unix style
//     formattedContent = formattedContent.replace(/\r\n/g, '\n');

//     // Collapse multiple empty lines to at most two newlines
//     formattedContent = formattedContent.replace(/\n{3,}/g, '\n\n');

//     // Trim whitespace from each line
//     formattedContent = formattedContent.split('\n').map(line => line.trim()).join('\n');

//     // Remove leading/trailing newlines from the whole content
//     formattedContent = formattedContent.trim();
//     // --- END: New text normalization ---

//     // First, protect math expressions from other processing
//     const mathExpressions: { [key: string]: string } = {};
//     let mathCounter = 0;

//     // --- START: Updated regex for LaTeX delimiter recognition ---
//     // Extract display math ($$...$$ and \[...\])
//     formattedContent = formattedContent.replace(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g, (match, p1, p2) => {
//       const math = p1 || p2; // p1 for $$, p2 for \[\]
//       const placeholder = `__DISPLAY_MATH_${mathCounter}__`;
//       mathExpressions[placeholder] = math.trim();
//       mathCounter++;
//       return placeholder;
//     });

//     // Extract inline math ($...$ and \(...\))
//     formattedContent = formattedContent.replace(/\$([^$\n]+?)\$|\\\(([\s\S]*?)\\\)/g, (match, p1, p2) => {
//       const math = p1 || p2; // p1 for $, p2 for \(\)
//       const placeholder = `__INLINE_MATH_${mathCounter}__`;
//       mathExpressions[placeholder] = math.trim();
//       mathCounter++;
//       return placeholder;
//     });
//     // --- END: Updated regex for LaTeX delimiter recognition ---

//     // Process tables (GitHub Flavored Markdown style)
//     formattedContent = formattedContent.replace(/^\|(.+)\|$/gm, (match, content) => {
//       const cells = content.split('|').map(cell => cell.trim());
//       return `__TABLE_ROW__${cells.join('__CELL_SEPARATOR__')}__TABLE_ROW_END__`;
//     });

//     // Convert table rows to HTML
//     const tableRows = formattedContent.match(/__TABLE_ROW__(.*?)__TABLE_ROW_END__/g);
//     if (tableRows && tableRows.length > 0) {
//       let tableHtml = '<div class="overflow-x-auto my-8 rounded-xl border border-slate-200 shadow-lg bg-white">';
//       tableHtml += '<table class="min-w-full divide-y divide-slate-200">';

//       tableRows.forEach((row, index) => {
//         const cells = row.replace(/__TABLE_ROW__|__TABLE_ROW_END__/g, '').split('__CELL_SEPARATOR__');
//         const isHeader = index === 0 || (index === 1 && cells.every(cell => cell.match(/^[-:]+$/)));

//         if (isHeader && !cells.every(cell => cell.match(/^[-:]+$/))) {
//           tableHtml += '<thead class="bg-gradient-to-r from-slate-50 to-slate-100"><tr>';
//           cells.forEach(cell => {
//             tableHtml += `<th class="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide border-r border-slate-200 last:border-r-0">${cell}</th>`;
//           });
//           tableHtml += '</tr></thead><tbody class="divide-y divide-slate-100">';
//         } else if (!cells.every(cell => cell.match(/^[-:]+$/))) {
//           tableHtml += '<tr class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">';
//           cells.forEach(cell => {
//             tableHtml += `<td class="px-6 py-4 text-sm text-slate-800 border-r border-slate-100 last:border-r-0 leading-relaxed">${cell}</td>`;
//           });
//           tableHtml += '</tr>';
//         }
//       });

//       tableHtml += '</tbody></table></div>';

//       // Replace all table rows with the complete table
//       formattedContent = formattedContent.replace(/__TABLE_ROW__(.*?)__TABLE_ROW_END__/g, '');
//       formattedContent = formattedContent + tableHtml;

//     }

//     // Process headings with enhanced typography and spacing
//     formattedContent = formattedContent
//       .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-6 theory-heading-h1">$1</h1>')
//       .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 mt-5 theory-heading-h2">$1</h2>')
//       .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-3 mt-4  theory-heading-h3">$1</h3>')
//       .replace(/^#### (.*$)/gm, '<h4 class="text-base font-bold mb-2 mt-3 theory-heading-h4">$1</h4>');

//     // Process bold and italic text with simple styling
//     formattedContent = formattedContent
//       .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
//       .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');

//     // Process code blocks and inline code with simple styling
//     formattedContent = formattedContent
//       .replace(/```([\s\S]*?)```/g, '<div class="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto"><pre class="text-slate-800 whitespace-pre-wrap">$1</pre></div>')
//       .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-slate-800 px-2 py-1 rounded text-sm font-mono">$1</code>');

//     // Split content into lines for processing
//     const lines = formattedContent.split('\n');
//     const processedLines: string[] = [];
//     let inList = false;
//     let listType = '';

//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].trim();

//       // Skip empty lines but add spacing
//       if (!line) {
//         if (inList) {
//           processedLines.push(`</${listType}>`);
//           inList = false;
//         }
//         processedLines.push('<div class="h-6"></div>');
//         continue;
//       }

//       // Check if line is already a heading or HTML element
//       if (line.startsWith('<h') || line.startsWith('<div') || line.startsWith('<pre') || line.startsWith('<table')) {
//         if (inList) {
//           processedLines.push(`</${listType}>`);
//           inList = false;
//         }
//         processedLines.push(line);
//         continue;
//       }

//       // Process bullet points and numbered lists
//       const bulletMatch = line.match(/^[-•*]\s+(.+)$/);
//       const numberedMatch = line.match(/^\d+\.\s+(.+)$/);

//       if (bulletMatch) {
//         if (!inList || listType !== 'ul') {
//           if (inList) processedLines.push(`</${listType}>`);
//           processedLines.push('<ul class="list-disc ml-6 mb-4 space-y-2">');
//           inList = true;
//           listType = 'ul';
//         }
//         processedLines.push(`<li class="text-slate-800 leading-relaxed">${bulletMatch[1]}</li>`);
//       } else if (numberedMatch) {
//         if (!inList || listType !== 'ol') {
//           if (inList) processedLines.push(`</${listType}>`);
//           processedLines.push('<ol class="list-decimal ml-6 mb-4 space-y-2">');
//           inList = true;
//           listType = 'ol';
//         }
//         processedLines.push(`<li class="text-slate-800 leading-relaxed">${numberedMatch[1]}</li>`);
//       } else {
//         if (inList) {
//           processedLines.push(`</${listType}>`);
//           inList = false;
//         }
//         // Regular paragraph
//         if (line) {
//           processedLines.push(`<p class="text-slate-800 leading-relaxed mb-4">${line}</p>`);
//         }
//       }
//     }

//     // Close any remaining list
//     if (inList) {
//       processedLines.push(`</${listType}>`);
//     }

//     // Join all processed lines to create finalContent
//     let finalContent = processedLines.join('\n');

//     // Restore math expressions and render them
//     Object.keys(mathExpressions).forEach(placeholder => {
//       const mathContent = mathExpressions[placeholder];
//       if (placeholder.includes('DISPLAY_MATH')) {
//         // For display math, we'll use a placeholder that will be processed by a custom component
//         finalContent = finalContent.replace(placeholder, `<div class="math-display my-4 text-center" data-math="${encodeURIComponent(mathContent)}"></div>`);
//       } else if (placeholder.includes('INLINE_MATH')) {
//         // For inline math, we'll use a placeholder that will be processed by a custom component
//         finalContent = finalContent.replace(placeholder, `<span class="math-inline" data-math="${encodeURIComponent(mathContent)}"></span>`);
//       }
//     });

//     return finalContent;
//   };

//   // Component to render math expressions
//   const MathRenderer: React.FC<{ content: string }> = ({ content }) => {
//     const containerRef = React.useRef<HTMLDivElement>(null);

//     React.useEffect(() => {
//       if (containerRef.current) {
//         // Find and render display math
//         const displayMathElements = containerRef.current.querySelectorAll('.math-display');
//         displayMathElements.forEach((element) => {
//           const mathContent = decodeURIComponent(element.getAttribute('data-math') || '');
//           const mathDiv = document.createElement('div');
//           element.appendChild(mathDiv);

//           try {
//             katex.render(mathContent, mathDiv, {
//               displayMode: true,
//               throwOnError: false, // Keep false to avoid crashing, but log errors
//               errorColor: '#cc0000',
//             });
//           } catch (error: any) { // Catch specific KaTeX errors
//             console.error('KaTeX display math rendering error:', error);
//             mathDiv.innerHTML = `<span class="text-red-600 text-sm font-mono">Math Error: ${error.message || 'Invalid expression'}</span>`;
//             mathDiv.className = 'text-red-600 text-sm text-center my-2 p-1 border border-red-300 rounded';
//           }
//         });

//         // Find and render inline math
//         const inlineMathElements = containerRef.current.querySelectorAll('.math-inline');
//         inlineMathElements.forEach((element) => {
//           const mathContent = decodeURIComponent(element.getAttribute('data-math') || '');
//           const mathSpan = document.createElement('span');
//           element.appendChild(mathSpan);

//           try {
//             katex.render(mathContent, mathSpan, {
//               displayMode: false,
//               throwOnError: false, // Keep false to avoid crashing, but log errors
//               errorColor: '#cc0000',
//             });
//           } catch (error: any) { // Catch specific KaTeX errors
//             console.error('KaTeX inline math rendering error:', error);
//             mathSpan.innerHTML = `<span class="text-red-600 text-sm font-mono">Math Error: ${error.message || 'Invalid expression'}</span>`;
//             mathSpan.className = 'text-red-600 text-sm inline-block mx-1 p-0.5 border border-red-300 rounded';
//           }
//         });
//       }
//     }, [content]);

//     return (
//       <div
//         ref={containerRef}
//         className="theory-content max-w-none"
//         dangerouslySetInnerHTML={{ __html: content }}
//       />
//     );
//   };

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-2xl text-white">
//           <div className="flex items-center space-x-3 mb-4">
//             <BookOpen className="w-8 h-8" />
//             <h2 className="text-2xl font-bold">Theory: {topic}</h2>
//           </div>
//           <p className="text-green-100">
//             Subject: {subject} • AI-Generated from Your Study Materials
//           </p>
//         </div>

//         {/* Loading State */}
//         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
//           <div className="flex flex-col items-center justify-center py-12">
//             <div className="relative mb-6">
//               <Loader className="w-12 h-12 animate-spin text-blue-600" />
//               <Brain className="w-6 h-6 text-blue-600 absolute top-3 left-3" />
//             </div>
//             <h3 className="text-xl font-semibold text-slate-800 mb-2">Generating Theory Content</h3>
//             <p className="text-slate-600 text-center max-w-md">
//               AI is analyzing your uploaded study materials and generating comprehensive theory content for <strong>{topic}</strong> in {subject}...
//             </p>
//             <div className="mt-4 flex items-center space-x-2 text-sm text-slate-500">
//               <FileText className="w-4 h-4" />
//               <span>Processing uploaded materials with RAG technology</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 rounded-2xl text-white">
//           <div className="flex items-center space-x-3 mb-4">
//             <BookOpen className="w-8 h-8" />
//             <h2 className="text-2xl font-bold">Theory: {topic}</h2>
//           </div>
//           <p className="text-red-100">
//             Subject: {subject} • Error Loading Content
//           </p>
//         </div>

//         {/* Error State */}
//         <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-200">
//           <div className="text-center py-8">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">⚠️</span>
//             </div>
//             <h3 className="text-xl font-semibold text-slate-800 mb-2">Failed to Load Theory</h3>
//             <p className="text-slate-600 mb-6">{error}</p>
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={() => window.location.reload()}
//                 className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
//               >
//                 Try Again
//               </button>
//               <button
//                 onClick={handleBack}
//                 className="bg-slate-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
//               >
//                 Go Back
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-2xl text-white">
//         <div className="flex items-center space-x-3 mb-4">
//           <BookOpen className="w-8 h-8" />
//           <h2 className="text-2xl font-bold">Theory: {topic}</h2>
//         </div>
//         <p className="text-green-100">
//           Subject: {subject} • AI-Generated from Your Study Materials
//         </p>
//         <div className="mt-4 flex items-center space-x-4 text-sm">
//           <div className="flex items-center space-x-2">
//             <Brain className="w-4 h-4" />
//             <span>RAG-Enhanced Content</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <FileText className="w-4 h-4" />
//             <span>Based on Uploaded Materials</span>
//           </div>
//         </div>
//       </div>

//       {/* Theory Content */}
//       <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//         <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
//               <Lightbulb className="w-5 h-5 text-yellow-600" />
//               <span>Comprehensive Theory</span>
//             </h3>
//             <div className="flex items-center space-x-2 text-sm text-slate-600">
//               <Target className="w-4 h-4" />
//               <span>Exam-Focused Content</span>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 bg-white">
//           <MathRenderer content={formatTheoryContent(theoryContent)} />
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
//         <button
//           onClick={handleBack}
//           className="flex items-center justify-center space-x-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span>Back to Course</span>
//         </button>

//         <button
//           onClick={handleProceedToAssessment}
//           className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all shadow-lg"
//         >
//           <Play className="w-5 h-5" />
//           <span>Proceed to AI Assessment</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TheoryView;



// ---------------- Fluctuation improvement -------------


// // src/components/Courses/TheoryView.tsx
// import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft, BookOpen, Brain, Loader, Play, FileText, Lightbulb, Target, CheckCircle } from 'lucide-react';
// import { AIService } from '../../lib/mistralAI';
// import katex from 'katex';
// import 'katex/dist/katex.min.css';


// const TheoryView: React.FC<{ userId: string }> = ({ userId }) => {
//   const navigate = useNavigate();
//   const { subject: subjectParam, topic: topicParam } = useParams<{ subject: string; topic: string }>();
//   const [theoryContent, setTheoryContent] = useState<string>('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>('');

//   // Redirect if no parameters
//   if (!subjectParam || !topicParam) {
//     navigate('/courses');
//     return null;
//   }

//   const subject = decodeURIComponent(subjectParam);
//   const topic = decodeURIComponent(topicParam);

//   const handleProceedToAssessment = () => {
//     navigate('/courses/theory-quiz', {
//       state: {
//         subject: subject,
//         topic: topic,
//         theoryContent: theoryContent
//       }
//     });
//   };

//   const handleBack = () => {
//     navigate(`/courses/${encodeURIComponent(subject)}`);
//   };
//   useEffect(() => {
//     const fetchTheory = async () => {
//       if (!subject || !topic || !userId) return;

//       setLoading(true);
//       setError('');

//       try {
//         const content = await AIService.generateTheory(subject, topic, userId);
//         setTheoryContent(content);
//       } catch (err) {
//         console.error('Error fetching theory:', err);
//         setError('Failed to load theory content. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTheory();
//   }, [subject, topic, userId]);

//   const formatTheoryContent = (content: string) => {
//     // --- START: New text normalization for clean formatting ---
//     let formattedContent = content;

//     // Normalize line endings to Unix style
//     formattedContent = formattedContent.replace(/\r\n/g, '\n');

//     // Collapse multiple empty lines to at most two newlines
//     formattedContent = formattedContent.replace(/\n{3,}/g, '\n\n');

//     // Trim whitespace from each line
//     formattedContent = formattedContent.split('\n').map(line => line.trim()).join('\n');

//     // Remove leading/trailing newlines from the whole content
//     formattedContent = formattedContent.trim();
//     // --- END: New text normalization ---

//     // First, protect math expressions from other processing
//     const mathExpressions: { [key: string]: string } = {};
//     let mathCounter = 0;

//     // --- START: Updated regex for LaTeX delimiter recognition ---
//     // Extract display math ($$...$$ and \[...\])
//     formattedContent = formattedContent.replace(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g, (match, p1, p2) => {
//       const math = p1 || p2; // p1 for $$, p2 for \[\]
//       const placeholder = `__DISPLAY_MATH_${mathCounter}__`;
//       mathExpressions[placeholder] = math.trim();
//       mathCounter++;
//       return placeholder;
//     });

//     // Extract inline math ($...$ and \(...\))
//     formattedContent = formattedContent.replace(/\$([^$\n]+?)\$|\\\(([\s\S]*?)\\\)/g, (match, p1, p2) => {
//       const math = p1 || p2; // p1 for $, p2 for \(\)
//       const placeholder = `__INLINE_MATH_${mathCounter}__`;
//       mathExpressions[placeholder] = math.trim();
//       mathCounter++;
//       return placeholder;
//     });
//     // --- END: Updated regex for LaTeX delimiter recognition ---

//     // Process tables (GitHub Flavored Markdown style)
//     formattedContent = formattedContent.replace(/^\|(.+)\|$/gm, (match, content) => {
//       const cells = content.split('|').map(cell => cell.trim());
//       return `__TABLE_ROW__${cells.join('__CELL_SEPARATOR__')}__TABLE_ROW_END__`;
//     });

//     // Convert table rows to HTML
//     const tableRows = formattedContent.match(/__TABLE_ROW__(.*?)__TABLE_ROW_END__/g);
//     if (tableRows && tableRows.length > 0) {
//       let tableHtml = '<div class="overflow-x-auto my-8 rounded-xl border border-slate-200 shadow-lg bg-white">';
//       tableHtml += '<table class="min-w-full divide-y divide-slate-200">';

//       tableRows.forEach((row, index) => {
//         const cells = row.replace(/__TABLE_ROW__|__TABLE_ROW_END__/g, '').split('__CELL_SEPARATOR__');
//         const isHeader = index === 0 || (index === 1 && cells.every(cell => cell.match(/^[-:]+$/)));

//         if (isHeader && !cells.every(cell => cell.match(/^[-:]+$/))) {
//           tableHtml += '<thead class="bg-gradient-to-r from-slate-50 to-slate-100"><tr>';
//           cells.forEach(cell => {
//             tableHtml += `<th class="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide border-r border-slate-200 last:border-r-0">${cell}</th>`;
//           });
//           tableHtml += '</tr></thead><tbody class="divide-y divide-slate-100">';
//         } else if (!cells.every(cell => cell.match(/^[-:]+$/))) {
//           tableHtml += '<tr class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">';
//           cells.forEach(cell => {
//             tableHtml += `<td class="px-6 py-4 text-sm text-slate-800 border-r border-slate-100 last:border-r-0 leading-relaxed">${cell}</td>`;
//           });
//           tableHtml += '</tr>';
//         }
//       });

//       tableHtml += '</tbody></table></div>';

//       // Replace all table rows with the complete table
//       formattedContent = formattedContent.replace(/__TABLE_ROW__(.*?)__TABLE_ROW_END__/g, '');
//       formattedContent = formattedContent + tableHtml;

//     }

//     // Process headings with enhanced typography and spacing
//     formattedContent = formattedContent
//       .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-6 theory-heading-h1">$1</h1>')
//       .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 mt-5 theory-heading-h2">$1</h2>')
//       .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-3 mt-4  theory-heading-h3">$1</h3>')
//       .replace(/^#### (.*$)/gm, '<h4 class="text-base font-bold mb-2 mt-3 theory-heading-h4">$1</h4>');

//     // Process bold and italic text with simple styling
//     formattedContent = formattedContent
//       .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
//       .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');

//     // Process code blocks and inline code with simple styling
//     formattedContent = formattedContent
//       .replace(/```([\s\S]*?)```/g, '<div class="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto"><pre class="text-slate-800 whitespace-pre-wrap">$1</pre></div>')
//       .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-slate-800 px-2 py-1 rounded text-sm font-mono">$1</code>');

//     // Split content into lines for processing
//     const lines = formattedContent.split('\n');
//     const processedLines: string[] = [];
//     let inList = false;
//     let listType = '';

//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].trim();

//       // Skip empty lines but add spacing
//       if (!line) {
//         if (inList) {
//           processedLines.push(`</${listType}>`);
//           inList = false;
//         }
//         processedLines.push('<div class="h-6"></div>');
//         continue;
//       }

//       // Check if line is already a heading or HTML element
//       if (line.startsWith('<h') || line.startsWith('<div') || line.startsWith('<pre') || line.startsWith('<table')) {
//         if (inList) {
//           processedLines.push(`</${listType}>`);
//           inList = false;
//         }
//         processedLines.push(line);
//         continue;
//       }

//       // Process bullet points and numbered lists
//       const bulletMatch = line.match(/^[-•*]\s+(.+)$/);
//       const numberedMatch = line.match(/^\d+\.\s+(.+)$/);

//       if (bulletMatch) {
//         if (!inList || listType !== 'ul') {
//           if (inList) processedLines.push(`</${listType}>`);
//           processedLines.push('<ul class="list-disc ml-6 mb-4 space-y-2">');
//           inList = true;
//           listType = 'ul';
//         }
//         processedLines.push(`<li class="text-slate-800 leading-relaxed">${bulletMatch[1]}</li>`);
//       } else if (numberedMatch) {
//         if (!inList || listType !== 'ol') {
//           if (inList) processedLines.push(`</${listType}>`);
//           processedLines.push('<ol class="list-decimal ml-6 mb-4 space-y-2">');
//           inList = true;
//           listType = 'ol';
//         }
//         processedLines.push(`<li class="text-slate-800 leading-relaxed">${numberedMatch[1]}</li>`);
//       } else {
//         if (inList) {
//           processedLines.push(`</${listType}>`);
//           inList = false;
//         }
//         // Regular paragraph
//         if (line) {
//           processedLines.push(`<p class="text-slate-800 leading-relaxed mb-4">${line}</p>`);
//         }
//       }
//     }

//     // Close any remaining list
//     if (inList) {
//       processedLines.push(`</${listType}>`);
//     }

//     // Join all processed lines to create finalContent
//     let finalContent = processedLines.join('\n');

//     // Restore math expressions and render them
//     Object.keys(mathExpressions).forEach(placeholder => {
//       const mathContent = mathExpressions[placeholder];
//       if (placeholder.includes('DISPLAY_MATH')) {
//         // For display math, we'll use a placeholder that will be processed by a custom component
//         finalContent = finalContent.replace(placeholder, `<div class="math-display my-4 text-center" data-math="${encodeURIComponent(mathContent)}"></div>`);
//       } else if (placeholder.includes('INLINE_MATH')) {
//         // For inline math, we'll use a placeholder that will be processed by a custom component
//         finalContent = finalContent.replace(placeholder, `<span class="math-inline" data-math="${encodeURIComponent(mathContent)}"></span>`);
//       }
//     });

//     return finalContent;
//   };

//   // Component to render math expressions
//   const MathRenderer: React.FC<{ content: string }> = ({ content }) => {
//     const containerRef = React.useRef<HTMLDivElement>(null);

//     React.useEffect(() => {
//       if (containerRef.current) {
//         // Find and render display math
//         const displayMathElements = containerRef.current.querySelectorAll('.math-display');
//         displayMathElements.forEach((element) => {
//           const mathContent = decodeURIComponent(element.getAttribute('data-math') || '');
//           const mathDiv = document.createElement('div');
//           element.appendChild(mathDiv);

//           try {
//             katex.render(mathContent, mathDiv, {
//               displayMode: true,
//               throwOnError: false, // Keep false to avoid crashing, but log errors
//               errorColor: '#cc0000',
//             });
//           } catch (error: any) { // Catch specific KaTeX errors
//             console.error('KaTeX display math rendering error:', error);
//             mathDiv.innerHTML = `<span class="text-red-600 text-sm font-mono">Math Error: ${error.message || 'Invalid expression'}</span>`;
//             mathDiv.className = 'text-red-600 text-sm text-center my-2 p-1 border border-red-300 rounded';
//           }
//         });

//         // Find and render inline math
//         const inlineMathElements = containerRef.current.querySelectorAll('.math-inline');
//         inlineMathElements.forEach((element) => {
//           const mathContent = decodeURIComponent(element.getAttribute('data-math') || '');
//           const mathSpan = document.createElement('span');
//           element.appendChild(mathSpan);

//           try {
//             katex.render(mathContent, mathSpan, {
//               displayMode: false,
//               throwOnError: false, // Keep false to avoid crashing, but log errors
//               errorColor: '#cc0000',
//             });
//           } catch (error: any) { // Catch specific KaTeX errors
//             console.error('KaTeX inline math rendering error:', error);
//             mathSpan.innerHTML = `<span class="text-red-600 text-sm font-mono">Math Error: ${error.message || 'Invalid expression'}</span>`;
//             mathSpan.className = 'text-red-600 text-sm inline-block mx-1 p-0.5 border border-red-300 rounded';
//           }
//         });
//       }
//     }, [content]);

//     return (
//       <div
//         ref={containerRef}
//         className="theory-content max-w-none"
//         dangerouslySetInnerHTML={{ __html: content }}
//       />
//     );
//   };

//   // Memoize the formatted content to prevent unnecessary re-renders of MathRenderer
//   const memoizedFormattedContent = useMemo(() => formatTheoryContent(theoryContent), [theoryContent]);


//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-2xl text-white">
//           <div className="flex items-center space-x-3 mb-4">
//             <BookOpen className="w-8 h-8" />
//             <h2 className="text-2xl font-bold">Theory: {topic}</h2>
//           </div>
//           <p className="text-green-100">
//             Subject: {subject} • AI-Generated from Your Study Materials
//           </p>
//         </div>

//         {/* Loading State */}
//         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
//           <div className="flex flex-col items-center justify-center py-12">
//             <div className="relative mb-6">
//               <Loader className="w-12 h-12 animate-spin text-blue-600" />
//               <Brain className="w-6 h-6 text-blue-600 absolute top-3 left-3" />
//             </div>
//             <h3 className="text-xl font-semibold text-slate-800 mb-2">Generating Theory Content</h3>
//             <p className="text-slate-600 text-center max-w-md">
//               AI is analyzing your uploaded study materials and generating comprehensive theory content for <strong>{topic}</strong> in {subject}...
//             </p>
//             <div className="mt-4 flex items-center space-x-2 text-sm text-slate-500">
//               <FileText className="w-4 h-4" />
//               <span>Processing uploaded materials with RAG technology</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 rounded-2xl text-white">
//           <div className="flex items-center space-x-3 mb-4">
//             <BookOpen className="w-8 h-8" />
//             <h2 className="text-2xl font-bold">Theory: {topic}</h2>
//           </div>
//           <p className="text-red-100">
//             Subject: {subject} • Error Loading Content
//           </p>
//         </div>

//         {/* Error State */}
//         <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-200">
//           <div className="text-center py-8">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">⚠️</span>
//             </div>
//             <h3 className="text-xl font-semibold text-slate-800 mb-2">Failed to Load Theory</h3>
//             <p className="text-slate-600 mb-6">{error}</p>
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={() => window.location.reload()}
//                 className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
//               >
//                 Try Again
//               </button>
//               <button
//                 onClick={handleBack}
//                 className="bg-slate-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
//               >
//                 Go Back
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-2xl text-white">
//         <div className="flex items-center space-x-3 mb-4">
//           <BookOpen className="w-8 h-8" />
//           <h2 className="text-2xl font-bold">Theory: {topic}</h2>
//         </div>
//         <p className="text-green-100">
//           Subject: {subject} • AI-Generated from Your Study Materials
//         </p>
//         <div className="mt-4 flex items-center space-x-4 text-sm">
//           <div className="flex items-center space-x-2">
//             <Brain className="w-4 h-4" />
//             <span>RAG-Enhanced Content</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <FileText className="w-4 h-4" />
//             <span>Based on Uploaded Materials</span>
//           </div>
//         </div>
//       </div>

//       {/* Theory Content */}
//       <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//         <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
//               <Lightbulb className="w-5 h-5 text-yellow-600" />
//               <span>Comprehensive Theory</span>
//             </h3>
//             <div className="flex items-center space-x-2 text-sm text-slate-600">
//               <Target className="w-4 h-4" />
//               <span>Exam-Focused Content</span>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 bg-white">
//           <MathRenderer content={memoizedFormattedContent} /> {/* Use memoized content */}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
//         <button
//           onClick={handleBack}
//           className="flex items-center justify-center space-x-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span>Back to Course</span>
//         </button>

//         <button
//           onClick={handleProceedToAssessment}
//           className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all shadow-lg"
//         >
//           <Play className="w-5 h-5" />
//           <span>Proceed to AI Assessment</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TheoryView;








//  ------------- Error Popup  ----------------------

// src/components/Courses/TheoryView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Brain, Loader, Play, FileText, Lightbulb, Target, CheckCircle } from 'lucide-react';
import { AIService } from '../../lib/mistralAI';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import RetryPopup from '../Common/RetryPopup'; // Import the new popup component



const TheoryView: React.FC<{ userId: string }> = ({ userId }) => {
  const navigate = useNavigate();
  const { subject: subjectParam, topic: topicParam } = useParams<{ subject: string; topic: string }>();
  const [theoryContent, setTheoryContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showRetryPopup, setShowRetryPopup] = useState(false); // New state for popup

  // Redirect if no parameters
  if (!subjectParam || !topicParam) {
    navigate('/app/courses');
    return null;
  }

  const subject = decodeURIComponent(subjectParam);
  const topic = decodeURIComponent(topicParam);

  const handleProceedToAssessment = () => {
    navigate(`/app/courses/${encodeURIComponent(subject)}/theory-quiz/${encodeURIComponent(topic)}`, {
      state: {
        subject: subject,
        topic: topic,
        theoryContent: theoryContent
      }
    });
  };

  const handleBack = () => {
    navigate(`/app/courses/${encodeURIComponent(subject)}`);
  };

  const fetchTheory = async () => { // Extracted fetch logic into its own function
    if (!subject || !topic || !userId) return;

    setLoading(true);
    setError('');
    setShowRetryPopup(false); // Hide popup on retry

    try {
      const content = await AIService.generateTheory(subject, topic, userId);
      setTheoryContent(content);
    } catch (err: any) {
      console.error('Error fetching theory:', err);


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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheory(); // Call fetchTheory on component mount/dependency change
  }, [subject, topic, userId]);

  const handleRetryFetchTheory = () => {
    fetchTheory();
  };

  const handleCancelFetchTheory = () => {
    setShowRetryPopup(false);
    navigate(`/app/courses/${encodeURIComponent(subject)}`); // Go back to course list or previous page
  };

  const formatTheoryContent = (content: string) => {
    // --- START: New text normalization for clean formatting ---
    let formattedContent = content;

    // Normalize line endings to Unix style
    formattedContent = formattedContent.replace(/\r\n/g, '\n');

    // Collapse multiple empty lines to at most two newlines
    formattedContent = formattedContent.replace(/\n{3,}/g, '\n\n');

    // Trim whitespace from each line
    formattedContent = formattedContent.split('\n').map(line => line.trim()).join('\n');

    // Remove leading/trailing newlines from the whole content
    formattedContent = formattedContent.trim();
    // --- END: New text normalization ---

    // First, protect math expressions from other processing
    const mathExpressions: { [key: string]: string } = {};
    let mathCounter = 0;

    // --- START: Updated regex for LaTeX delimiter recognition ---
    // Extract display math ($$...$$ and \[...\])
    formattedContent = formattedContent.replace(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g, (match, p1, p2) => {
      const math = p1 || p2; // p1 for $$, p2 for \[\]
      const placeholder = `__DISPLAY_MATH_${mathCounter}__`;
      mathExpressions[placeholder] = math.trim();
      mathCounter++;
      return placeholder;
    });

    // Extract inline math ($...$ and \(...\))
    formattedContent = formattedContent.replace(/\$([^$\n]+?)\$|\\\(([\s\S]*?)\\\)/g, (match, p1, p2) => {
      const math = p1 || p2; // p1 for $, p2 for \(\)
      const placeholder = `__INLINE_MATH_${mathCounter}__`;
      mathExpressions[placeholder] = math.trim();
      mathCounter++;
      return placeholder;
    });
    // --- END: Updated regex for LaTeX delimiter recognition ---

    // Process tables (GitHub Flavored Markdown style)
    formattedContent = formattedContent.replace(/^\|(.+)\|$/gm, (match, content) => {
      const cells = content.split('|').map(cell => cell.trim());
      return `__TABLE_ROW__${cells.join('__CELL_SEPARATOR__')}__TABLE_ROW_END__`;
    });

    // Convert table rows to HTML
    const tableRows = formattedContent.match(/__TABLE_ROW__(.*?)__TABLE_ROW_END__/g);
    if (tableRows && tableRows.length > 0) {
      let tableHtml = '<div class="overflow-x-auto my-8 rounded-xl border border-slate-200 shadow-lg bg-white">';
      tableHtml += '<table class="min-w-full divide-y divide-slate-200">';

      tableRows.forEach((row, index) => {
        const cells = row.replace(/__TABLE_ROW__|__TABLE_ROW_END__/g, '').split('__CELL_SEPARATOR__');
        const isHeader = index === 0 || (index === 1 && cells.every(cell => cell.match(/^[-:]+$/)));

        if (isHeader && !cells.every(cell => cell.match(/^[-:]+$/))) {
          tableHtml += '<thead class="bg-gradient-to-r from-slate-50 to-slate-100"><tr>';
          cells.forEach(cell => {
            tableHtml += `<th class="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide border-r border-slate-200 last:border-r-0">${cell}</th>`;
          });
          tableHtml += '</tr></thead><tbody class="divide-y divide-slate-100">';
        } else if (!cells.every(cell => cell.match(/^[-:]+$/))) {
          tableHtml += '<tr class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">';
          cells.forEach(cell => {
            tableHtml += `<td class="px-6 py-4 text-sm text-slate-800 border-r border-slate-100 last:border-r-0 leading-relaxed">${cell}</td>`;
          });
          tableHtml += '</tr>';
        }
      });

      tableHtml += '</tbody></table></div>';

      // Replace all table rows with the complete table
      formattedContent = formattedContent.replace(/__TABLE_ROW__(.*?)__TABLE_ROW_END__/g, '');
      formattedContent = formattedContent + tableHtml;

    }

    // Process headings with enhanced typography and spacing
    formattedContent = formattedContent
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-6 theory-heading-h1">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 mt-5 theory-heading-h2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-3 mt-4  theory-heading-h3">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-base font-bold mb-2 mt-3 theory-heading-h4">$1</h4>');

    // Process bold and italic text with simple styling
    formattedContent = formattedContent
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');

    // Process code blocks and inline code with simple styling
    formattedContent = formattedContent
      .replace(/```([\s\S]*?)```/g, '<div class="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto"><pre class="text-slate-800 whitespace-pre-wrap">$1</pre></div>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-slate-800 px-2 py-1 rounded text-sm font-mono">$1</code>');

    // Split content into lines for processing
    const lines = formattedContent.split('\n');
    const processedLines: string[] = [];
    let inList = false;
    let listType = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines but add spacing
      if (!line) {
        if (inList) {
          processedLines.push(`</${listType}>`);
          inList = false;
        }
        processedLines.push('<div class="h-6"></div>');
        continue;
      }

      // Check if line is already a heading or HTML element
      if (line.startsWith('<h') || line.startsWith('<div') || line.startsWith('<pre') || line.startsWith('<table')) {
        if (inList) {
          processedLines.push(`</${listType}>`);
          inList = false;
        }
        processedLines.push(line);
        continue;
      }

      // Process bullet points and numbered lists
      const bulletMatch = line.match(/^[-•*]\s+(.+)$/);
      const numberedMatch = line.match(/^\d+\.\s+(.+)$/);

      if (bulletMatch) {
        if (!inList || listType !== 'ul') {
          if (inList) processedLines.push(`</${listType}>`);
          processedLines.push('<ul class="list-disc ml-6 mb-4 space-y-2">');
          inList = true;
          listType = 'ul';
        }
        processedLines.push(`<li class="text-slate-800 leading-relaxed">${bulletMatch[1]}</li>`);
      } else if (numberedMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) processedLines.push(`</${listType}>`);
          processedLines.push('<ol class="list-decimal ml-6 mb-4 space-y-2">');
          inList = true;
          listType = 'ol';
        }
        processedLines.push(`<li class="text-slate-800 leading-relaxed">${numberedMatch[1]}</li>`);
      } else {
        if (inList) {
          processedLines.push(`</${listType}>`);
          inList = false;
        }
        // Regular paragraph
        if (line) {
          processedLines.push(`<p class="text-slate-800 leading-relaxed mb-4">${line}</p>`);
        }
      }
    }

    // Close any remaining list
    if (inList) {
      processedLines.push(`</${listType}>`);
    }

    // Join all processed lines to create finalContent
    let finalContent = processedLines.join('\n');

    // Restore math expressions and render them
    Object.keys(mathExpressions).forEach(placeholder => {
      const mathContent = mathExpressions[placeholder];
      if (placeholder.includes('DISPLAY_MATH')) {
        // For display math, we'll use a placeholder that will be processed by a custom component
        finalContent = finalContent.replace(placeholder, `<div class="math-display my-4 text-center" data-math="${encodeURIComponent(mathContent)}"></div>`);
      } else if (placeholder.includes('INLINE_MATH')) {
        // For inline math, we'll use a placeholder that will be processed by a custom component
        finalContent = finalContent.replace(placeholder, `<span class="math-inline" data-math="${encodeURIComponent(mathContent)}"></span>`);
      }
    });

    return finalContent;
  };

  // Component to render math expressions
  const MathRenderer: React.FC<{ content: string }> = ({ content }) => {
    const containerRef = React.useRef<HTMLHTMLDivElement>(null);

    React.useEffect(() => {
      if (containerRef.current) {
        // Find and render display math
        const displayMathElements = containerRef.current.querySelectorAll('.math-display');
        displayMathElements.forEach((element) => {
          const mathContent = decodeURIComponent(element.getAttribute('data-math') || '');
          const mathDiv = document.createElement('div');
          element.appendChild(mathDiv);

          try {
            katex.render(mathContent, mathDiv, {
              displayMode: true,
              throwOnError: false, // Keep false to avoid crashing, but log errors
              errorColor: '#cc0000',
            });
          } catch (error: any) { // Catch specific KaTeX errors
            console.error('KaTeX display math rendering error:', error);
            mathDiv.innerHTML = `<span class="text-red-600 text-sm font-mono">Math Error: ${error.message || 'Invalid expression'}</span>`;
            mathDiv.className = 'text-red-600 text-sm text-center my-2 p-1 border border-red-300 rounded';
          }
        });

        // Find and render inline math
        const inlineMathElements = containerRef.current.querySelectorAll('.math-inline');
        inlineMathElements.forEach((element) => {
          const mathContent = decodeURIComponent(element.getAttribute('data-math') || '');
          const mathSpan = document.createElement('span');
          element.appendChild(mathSpan);

          try {
            katex.render(mathContent, mathSpan, {
              displayMode: false,
              throwOnError: false, // Keep false to avoid crashing, but log errors
              errorColor: '#cc0000',
            });
          } catch (error: any) { // Catch specific KaTeX errors
            console.error('KaTeX inline math rendering error:', error);
            mathSpan.innerHTML = `<span class="text-red-600 text-sm font-mono">Math Error: ${error.message || 'Invalid expression'}</span>`;
            mathSpan.className = 'text-red-600 text-sm inline-block mx-1 p-0.5 border border-red-300 rounded';
          }
        });
      }
    }, [content]);

    return (
      <div
        ref={containerRef}
        className="theory-content max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  // Memoize the formatted content to prevent unnecessary re-renders of MathRenderer
  const memoizedFormattedContent = useMemo(() => formatTheoryContent(theoryContent), [theoryContent]);


  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-3">
        {/* Header */}
        <div className="bg-gradient-to-r dark:from-slate-700 dark:to-slate-800 from-green-500 to-blue-600 p-6 rounded-2xl text-white">
          <div className="flex items-center space-x-3 mb-4">
            {/* <BookOpen className="w-8 h-8" /> */}
            <h2 className="text-xl font-bold">Theory: {topic}</h2>
          </div>
          <p className="text-sm text-teal-100">
            Subject: <strong>{subject}</strong>
          </p>
        </div>

        {/* Loading State */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-6">
              <Loader className="w-12 h-12 animate-spin text-blue-600" />
              <BookOpen className="w-6 h-6 text-blue-600 absolute top-3 left-3" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Generating Theory Content</h3>
            <p className="text-slate-600 text-center max-w-md">
              Processing and generating comprehensive theory content for <strong>{topic}</strong> in {subject}...
            </p>
            <div className="mt-4 flex items-center space-x-2 text-sm text-slate-500">
              <FileText className="w-4 h-4" />
              <span>Processing with RAG technology</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // The error state will now trigger the popup instead of a static message
  // if (error) {
  //   return (
  //     <div className="max-w-4xl mx-auto space-y-6">
  //       {/* Header */}
  //       <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 rounded-2xl text-white">
  //         <div className="flex items-center space-x-3 mb-4">
  //           <BookOpen className="w-8 h-8" />
  //           <h2 className="text-2xl font-bold">Theory: {topic}</h2>
  //         </div>
  //         <p className="text-red-100">
  //           Subject: {subject} • Error Loading Content
  //         </p>
  //       </div>

  //       {/* Error State */}
  //       <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-200">
  //         <div className="text-center py-8">
  //           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //             <span className="text-2xl">⚠️</span>
  //           </div>
  //           <h3 className="text-xl font-semibold text-slate-800 mb-2">Failed to Load Theory</h3>
  //           <p className="text-slate-600 mb-6">{error}</p>
  //           <div className="flex justify-center space-x-4">
  //             <button
  //               onClick={() => window.location.reload()}
  //               className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
  //             >
  //               Try Again
  //             </button>
  //             <button
  //               onClick={handleBack}
  //               className="bg-slate-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
  //             >
  //               Go Back
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-3">
      {/* Header */}
      <div className="bg-gradient-to-r dark:from-slate-700 dark:to-slate-800 from-green-500 to-blue-600 p-6 rounded-2xl text-white">
        <div className="flex items-center space-x-3 mb-4">
          {/* <BookOpen className="w-8 h-8" /> */}
          <h2 className="text-xl font-bold">Theory: {topic}</h2>
        </div>
        <p className="text-sm text-green-100">
          Subject: <strong>{subject}</strong>
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>RAG-Enhanced Content</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Based on Uploaded Materials</span>
          </div>
        </div>
      </div>

      {/* Theory Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <span>Comprehensive Theory</span>
            </h3>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Target className="w-4 h-4" />
              <span>Exam-Focused Content</span>
            </div>
          </div>
        </div>

        <div className="max-p-2 p-6 bg-white">
          <MathRenderer content={memoizedFormattedContent} /> {/* Use memoized content */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleBack}
          className="flex items-center justify-center space-x-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Course</span>
        </button>

        <button
          onClick={handleProceedToAssessment}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all shadow-lg"
        >
          <Play className="w-5 h-5" />
          <span>Proceed to AI Assessment</span>
        </button>
      </div>

      {/* Retry Popup */}
      <RetryPopup
        isOpen={showRetryPopup}
        title="Failed to Generate Theory"
        message={error || "We encountered an issue generating the theory content. Please try again."}
        onTryAgain={handleRetryFetchTheory}
        onCancel={handleCancelFetchTheory}
      />
    </div>
  );
};

export default TheoryView;

