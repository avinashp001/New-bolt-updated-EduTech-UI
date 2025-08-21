// // import React, { useState, useRef } from 'react';
// // import { Brain, BookOpen, Loader2, AlertCircle, Download } from 'lucide-react';
// // import LoadingSpinner from '../Common/LoadingSpinner';
// // import { AIService } from '../../lib/mistralAI';
// // import { useAuth } from '../../hooks/useAuth';
// // import { useNotification } from '../../context/NotificationContext';
// // import TheoryContentDisplay from './TheoryContentDisplay';
// // import html2pdf from 'html2pdf.js';


// // const TheoryGeneratorPage: React.FC = () => {
// //   const { user } = useAuth();
// //   const { showSuccess, showError } = useNotification();

// //   const [subjectInput, setSubjectInput] = useState('');
// //   const [topicInput, setTopicInput] = useState('');
// //   const [selectedExamLevel, setSelectedExamLevel] = useState('General');
// //   const [generatedTheory, setGeneratedTheory] = useState<string | null>(null);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const theoryContentRef = useRef<HTMLDivElement>(null);

// //   // const subjects = [
// //   //   'Mathematics', 'Physics', 'Chemistry', 'Biology',
// //   //   'History', 'Geography', 'Economics', 'Political Science',
// //   //   'English', 'Current Affairs', 'Reasoning', 'General Knowledge'
// //   // ];


// //    const examLevels = [ // Options for exam level
// //     'Board Exams (Class 12)',
// //     'University Exams (B.Arch)',
// //     'University Exams (B.Tech)',
// //     'University Exams (BAMS)',
// //     'University Exams (MBBS)',
// //     'University Exams (BHMS)',
// //     'University Exams (B.Sc Agriculture)',
// //     'University Exams (B.Sc Veterinary)',
// //     'General',
// //     'UPSC Civil Services',
// //     'Banking (SBI PO/Clerk)',
// //     'JEE Main/Advanced',
// //     'SSC CGL',
// //     'NEET UG',
// //     'CAT',
// //     'GATE',
// //   ];

// //   const handleGenerateTheory = async () => {
// //     if (!subjectInput || !topicInput || !selectedExamLevel) {
// //       setError('Please enter a subject, topic and select an exam type.');
// //       return;
// //     }
// //     if (!user?.id) {
// //       setError('User not authenticated. Please log in.');
// //       return;
// //     }

// //     setIsLoading(true);
// //     setGeneratedTheory(null);
// //     setError(null);

// //     try {
// //       const theory = await AIService.generateTheory(subjectInput, topicInput, user.id, selectedExamLevel);
// //       setGeneratedTheory(theory);
// //       showSuccess('Theory Generated!', `Theoretical content for "${topicInput}" in ${subjectInput} (${selectedExamLevel} level) has been successfully generated.`);
// //     } catch (err) {
// //       console.error('Error generating theory:', err);
// //       setError('Failed to generate theory. Please try again later.');
// //       showError('Generation Failed', 'Could not generate theory. Please check your input and try again.');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleDownloadPdf = () => {
// //     if (!theoryContentRef.current || !generatedTheory) {
// //       showError('Download Failed', 'No theory content to download. Please generate theory first.');
// //       return;
// //     }

// //     setIsLoading(true);
// //     const element = theoryContentRef.current;
// //     const opt = {
// //       margin: 0.5,
// //       filename: `${subjectInput.replace(/[^a-zA-Z0-9]/g, '_')}_${topicInput.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedExamLevel.replace(/[^a-zA-Z0-9]/g, '_')}_theory.pdf`, // Updated filename
// //       image: { type: 'jpeg', quality: 0.98 },
// //       html2canvas: { scale: 2, logging: false, dpi: 192, letterRendering: true },
// //       jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
// //     };

// //     html2pdf().set(opt).from(element).save().then(() => {
// //       setIsLoading(false);
// //       showSuccess('PDF Downloaded!', 'The theory content has been successfully downloaded as a PDF.');
// //     }).catch(error => {
// //       setIsLoading(false);
// //       showError('Download Failed', 'There was an error downloading the PDF. Please try again.');
// //       console.error('PDF generation error:', error);
// //     });
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto space-y-6">
// //       {/* Header */}
// //       <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-2xl text-white">
// //         <div className="flex items-center space-x-3 mb-4">
// //           <BookOpen className="w-8 h-8" />
// //           <h2 className="text-2xl font-bold">Theory Generator</h2>
// //         </div>
// //         <p className="text-blue-100">
// //           Generate theoretical content for any subject and topic using AI.
// //         </p>
// //       </div>

// //       {/* Input Form */}
// //       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
// //         <h3 className="text-lg font-semibold text-slate-800 mb-4">Generate New Theory</h3>
        
// //         <div className="space-y-4">
// //           {/* <div>
// //             <label htmlFor="subject-select" className="block text-sm font-medium text-slate-700 mb-2">
// //               Select Subject *
// //             </label>
// //             <select
// //               id="subject-select"
// //               value={selectedSubject}
// //               onChange={(e) => setSelectedSubject(e.target.value)}
// //               className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               disabled={isLoading}
// //             >
// //               <option value="">Choose a subject</option>
// //               {subjects.map(subject => (
// //                 <option key={subject} value={subject}>{subject}</option>
// //               ))}
// //             </select>
// //           </div> */}

// //           <div>
// //             <label htmlFor="subject-input" className="block text-sm font-medium text-slate-700 mb-2">
// //               Enter Subject *
// //             </label>
// //             <input // Changed from select to input
// //               id="subject-input"
// //               type="text"
// //               value={subjectInput}
// //               onChange={(e) => setSubjectInput(e.target.value)}
// //               placeholder="e.g., Quantum Physics, Indian History"
// //               className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               disabled={isLoading}
// //             />
// //           </div>

// //           <div>
// //             <label htmlFor="topic-input" className="block text-sm font-medium text-slate-700 mb-2">
// //               Enter Topic *
// //             </label>
// //             <input
// //               id="topic-input"
// //               type="text"
// //               value={topicInput}
// //               onChange={(e) => setTopicInput(e.target.value)}
// //               placeholder="e.g., Quantum Physics, Indian History, Organic Chemistry"
// //               className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               disabled={isLoading}
// //             />
// //           </div>

// //           <div>
// //             <label htmlFor="exam-level-select" className="block text-sm font-medium text-slate-700 mb-2">
// //               Select Exam Level *
// //             </label>
// //             <select // New select for exam level
// //               id="exam-level-select"
// //               value={selectedExamLevel}
// //               onChange={(e) => setSelectedExamLevel(e.target.value)}
// //               className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               disabled={isLoading}
// //             >
// //               {examLevels.map(level => (
// //                 <option key={level} value={level}>{level}</option>
// //               ))}
// //             </select>
// //           </div>

// //           {error && (
// //             <div className="flex items-center space-x-2 text-red-600 text-sm">
// //               <AlertCircle className="w-4 h-4" />
// //               <span>{error}</span>
// //             </div>
// //           )}

// //           <button
// //             onClick={handleGenerateTheory}
// //             className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
// //             disabled={isLoading || !subjectInput || !topicInput || !selectedExamLevel}
// //           >
// //             {isLoading ? (
// //               <>
// //                 <Loader2 className="w-5 h-5 animate-spin" />
// //                 <span>Generating...</span>
// //               </>
// //             ) : (
// //               <>
// //                 <Brain className="w-5 h-5" />
// //                 <span>Generate Theory</span>
// //               </>
// //             )}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Generated Theory Display */}
// //       {/* {generatedTheory && (
// //         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
// //           <h3 className="text-lg font-semibold text-slate-800 mb-4">Generated Theory</h3>
// //           <div className="prose max-w-none text-slate-700 bg-slate-50 p-4 rounded-lg overflow-auto max-h-96">
// //             <p>{generatedTheory}</p>
// //           </div>
// //         </div>
// //       )} */}
// //       {generatedTheory && (
// //         <div ref={theoryContentRef} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
// //           <div className="flex items-center justify-between mb-4">
// //             <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Generated Theory</h3>
// //             <button
// //               onClick={handleDownloadPdf}
// //               className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
// //               disabled={isLoading}
// //             >
// //               {isLoading ? (
// //                 <>
// //                   <Loader2 className="w-4 h-4 animate-spin" />
// //                   <span>Downloading...</span>
// //                 </>
// //               ) : (
// //                 <>
// //                   <Download className="w-4 h-4" />
// //                   <span>Download PDF</span>
// //                 </>
// //               )}
// //             </button>
// //           </div>
// //           <TheoryContentDisplay content={generatedTheory} />
// //         </div>
// //       )}

// //       {/* Loading State */}
// //       {isLoading && !generatedTheory && (
// //         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
// //           <LoadingSpinner message="We are making your content Available... Please wait" variant="brain" />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TheoryGeneratorPage;


// // src/lib/mistralAI/theoryGeneratorV2.ts
// import { Mistral } from '@mistralai/mistralai';
// import { supabase } from '../supabase';

// const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
// const useMockAI = !apiKey;
// const client = apiKey ? new Mistral({ apiKey }) : null;

// // Tunables
// const MODEL_NAME = 'mistral-large-latest';
// const TEMPERATURE = 0.25; // lower = more factual, consistent
// const MAX_TOKENS = 8500;  // bump slightly for longer chapters (adjust per plan)

// export class TheoryGeneratorV2 { // Renamed class to V2
//   /** Public entrypoint */
//   static async generateTheory(subject: string, topic: string, userId: string, examLevel: string) {
//     if (useMockAI) {
//       await new Promise((resolve) => setTimeout(resolve, 300));
//       return this.generateMockTheory(subject, topic);
//     }

//     try {
//       const relevantContent = await this.retrieveRelevantContent(subject, topic, userId);
//       const prompt = this.getUnifiedPrompt(subject, topic, relevantContent, examLevel);

//       const response = await client!.chat.complete({
//         model: MODEL_NAME,
//         messages: [
//           {
//             role: 'system',
//             content:
//               'You are a senior competitive exam and college academics exam mentor and academic content creator. Follow instructions exactly. Never hallucinate. Use ONLY provided sources when present. Prefer descriptive paragraphs over bullets. Avoid one-liners.',
//           },
//           { role: 'user', content: prompt },
//         ],
//         temperature: TEMPERATURE,
//         max_tokens: MAX_TOKENS,
//       });

//       const out = response.choices?.[0]?.message?.content?.trim();
//       return out && out.length > 0 ? out : this.generateMockTheory(subject, topic);
//     } catch (error) {
//       console.error('Error generating theory:', error);
//       return this.generateMockTheory(subject, topic);
//     }
//   }

//   /** RAG: Fetch uploaded materials with a relevance ranking pipeline. */
//   private static async retrieveRelevantContent(
//     subject: string,
//     topic: string,
//     userId: string,
//   ): Promise<string[]> {
//     try {
//       const { data: materials, error } = await supabase
//         .from('uploaded_materials')
//         .select('extracted_content, filename, processed_topics, exam_relevance_score')
//         .eq('user_id', userId)
//         .gte('exam_relevance_score', 4); // slightly permissive threshold

//       if (error) {
//         console.error('Supabase error retrieving uploaded materials:', error);
//         return [];
//       }
//       if (!materials || materials.length === 0) return [];

//       // Normalize query terms
//       const subjectKey = subject.toLowerCase();
//       const topicKey = topic.toLowerCase();

//       type Item = {
//         content: string;
//         filename?: string;
//         processed_topics?: string[];
//         score: number;
//       };

//       const scored: Item[] = materials
//         .map((m: any) => {
//           const content: string = m.extracted_content || '';
//           const filename: string = (m.filename || '').toLowerCase();
//           const topics: string[] = Array.isArray(m.processed_topics) ? m.processed_topics : [];
//           const text = content.toLowerCase();

//           const subjectHit = Number(
//             text.includes(subjectKey) ||
//               filename.includes(subjectKey) ||
//               topics.some((t) => t?.toLowerCase?.().includes(subjectKey)),
//           );
//           const topicHit = Number(
//             text.includes(topicKey) ||
//               filename.includes(topicKey) ||
//               topics.some((t) => t?.toLowerCase?.().includes(topicKey)),
//           );

//           // Soft scoring: topic match weighted higher than subject match
//           const score = topicHit * 2 + subjectHit + (m.exam_relevance_score || 0) * 0.25;

//           return { content, filename: m.filename, processed_topics: topics, score };
//         })
//         .sort((a, b) => b.score - a.score);

//       // Take top N and extract relevant sections
//       const top = scored.slice(0, 10);
//       const snippets: string[] = [];

//       for (const t of top) {
//         const snippet = this.extractRelevantSections(t.content, subject, topic);
//         if (snippet && snippet.length > 160) snippets.push(this.normalize(snippet));
//         if (snippets.length >= 6) break;
//       }

//       // Deduplicate by simple semantic similarity on word sets
//       const unique = this.dedupeBySimilarity(snippets, 0.82);
//       return unique.slice(0, 5);
//     } catch (err) {
//       console.error('Error in retrieveRelevantContent:', err);
//       return [];
//     }
//   }

//   /** Extract relevant sections with neighbor-window expansion for context. */
//   private static extractRelevantSections(content: string, subject: string, topic: string): string {
//     if (!content || content.trim().length < 30) return '';

//     const maxLen = 5200; // generous prompt budget per source
//     const cleaned = content.replace(/\u0000/g, '').replace(/\s+\n/g, '\n').trim();

//     const paras = cleaned
//       .split(/\n\s*\n/g)
//       .map((p) => p.trim())
//       .filter((p) => p.length > 30);

//     const sKey = subject.toLowerCase();
//     const tKey = topic.toLowerCase();

//     // rank paragraphs by presence of topic and subject
//     const ranks = paras.map((p, i) => {
//       const l = p.toLowerCase();
//       const score = (l.includes(tKey) ? 2 : 0) + (l.includes(sKey) ? 1 : 0);
//       return { i, p, score };
//     });

//     const sorted = ranks.sort((a, b) => b.score - a.score).slice(0, 8);

//     // collect with a window around top hits to preserve context
//     const take = new Set<number>();
//     for (const r of sorted) {
//       for (let j = Math.max(0, r.i - 1); j <= Math.min(paras.length - 1, r.i + 1); j++) {
//         take.add(j);
//       }
//     }

//     // build output up to maxLen
//     let out = '';
//     const chosen = Array.from(take).sort((a, b) => a - b).map(idx => paras[idx]); // Ensure order
//     for (const chunk of chosen) {
//       if (out.length + chunk.length + 2 > maxLen) break;
//       out += chunk + '\n\n';
//     }

//     if (out.trim().length > 160) return out.trim();

//     // last resort: first few paragraphs
//     return paras.slice(0, 4).join('\n\n');
//   }

//   /** Simple text normalization */
//   private static normalize(s: string) {
//     return s.replace(/\s+/g, ' ').replace(/\u0000/g, '').trim();
//   }

//   /** Very light similarity dedupe on word sets */
//   private static dedupeBySimilarity(snippets: string[], threshold = 0.85) {
//     const result: string[] = [];
//     for (const s of snippets) {
//       let isDup = false;
//       const setA = new Set(s.toLowerCase().split(/[^a-z0-9]+/g).filter(Boolean));
//       for (const r of result) {
//         const setB = new Set(r.toLowerCase().split(/[^a-z0-9]+/g).filter(Boolean));
//         const inter = new Set([...setA].filter((w) => setB.has(w)));
//         const union = new Set([...setA, ...setB]);
//         const sim = inter.size / Math.max(1, union.size);
//         if (sim >= threshold) { isDup = true; break; }
//       }
//       if (!isDup) result.push(s);
//     }
//     return result;
//   }

//   /**
//    * Unified Prompt Generator
//    * - With sources: STRICT source fidelity (no external facts)
//    * - Without sources: Same rich, descriptive style using standard consensus sources
//    */
//   private static getUnifiedPrompt(subject: string, topic: string, relevantContent: string[], examLevel: string): string {
//     const hasSources = Array.isArray(relevantContent) && relevantContent.length > 0;
//     const contentContext = hasSources ? relevantContent.join('\n\n---\n\n') : '(no uploaded materials)';

//     // Define exam-specific depth and focus
//     let examLevelInstruction = '';
//     let examRelevanceTagForPrompt = examLevel; // Default to the full examLevel for the tag
    
//     switch (examLevel) {
//       case 'UPSC Civil Services':
//         examLevelInstruction = 'Focus on analytical depth, conceptual clarity, interdisciplinary connections, and relevance to General Studies papers. Include nuances, critical perspectives, and potential essay/answer writing angles. Emphasize comprehensive understanding for Mains and factual recall for Prelims.';
//         examRelevanceTagForPrompt = 'UPSC Civil Services';
//         break;
//       case 'JEE Main/Advanced':
//         examLevelInstruction = 'Emphasize problem-solving approaches, numerical applications, and conceptual understanding required for highly competitive engineering entrance exams. Include relevant formulas, their derivations, and common problem-solving techniques. Focus on speed and accuracy.';
//         examRelevanceTagForPrompt = 'JEE Main/Advanced';
//         break;
//       case 'NEET UG':
//         examLevelInstruction = 'Focus on biological and chemical concepts, their applications, and factual recall necessary for medical entrance exams. Include relevant diagrams (textual description), clinical correlations, and common NEET question patterns. Emphasize accuracy and speed.';
//         examRelevanceTagForPrompt = 'NEET UG';
//         break;
//       case 'SSC CGL':
//         examLevelInstruction = 'Focus on factual accuracy, quick recall points, and direct application of concepts relevant for objective-type government exams. Include common pitfalls, shortcuts, and frequently asked question types. Emphasize speed and basic conceptual clarity.';
//         examRelevanceTagForPrompt = 'SSC CGL';
//         break;
//       case 'Banking (SBI PO/Clerk)':
//         examLevelInstruction = 'Focus on quantitative aptitude, reasoning, and general awareness relevant for banking sector exams. Include problem-solving strategies for data interpretation, logical puzzles, and current banking affairs. Emphasize speed, accuracy, and practical application.';
//         examRelevanceTagForPrompt = 'Banking (SBI PO/Clerk)';
//         break;
//       case 'CAT':
//         examLevelInstruction = 'Emphasize logical reasoning, data interpretation, and conceptual understanding for management aptitude tests. Include strategic thinking aspects, critical reasoning, and efficient problem-solving techniques. Focus on analytical skills.';
//         examRelevanceTagForPrompt = 'CAT';
//         break;
//       case 'GATE':
//         examLevelInstruction = 'Focus on engineering principles, theoretical foundations, and problem-solving techniques relevant for postgraduate engineering entrance. Include derivations, technical details, and application to complex engineering problems. Emphasize in-depth understanding and analytical rigor.';
//         examRelevanceTagForPrompt = 'GATE';
//         break;
//       case 'Board Exams (Class 12)':
//         examLevelInstruction = 'Provide clear, concise explanations suitable for school-level understanding. Focus on syllabus coverage, definitions, basic applications, and typical board exam question formats. Include simple examples and step-by-step solutions. Content should strictly adhere to Class 12 academic curriculum and prepare students for their final board examinations.';
//         examRelevanceTagForPrompt = 'Board Exams (Class 12)';
//         break;
//       case 'University Exams (B.Arch)':
//         examLevelInstruction = 'Focus on concepts relevant to architecture, design principles, building materials, and environmental studies. Include historical context and contemporary applications. Emphasize conceptual understanding and design thinking relevant to B.Arch curriculum and university examination patterns.';
//         examRelevanceTagForPrompt = 'University Exams (B.Arch)';
//         break;
//       case 'University Exams (B.Tech)':
//         examLevelInstruction = 'Tailor content to engineering principles, problem-solving methodologies, and practical applications relevant to undergraduate engineering. Include derivations, circuit diagrams (textual description), and algorithm logic as per B.Tech curriculum and university examination patterns.';
//         examRelevanceTagForPrompt = 'University Exams (B.Tech)';
//         break;
//       case 'University Exams (BAMS)':
//         examLevelInstruction = 'Focus on Ayurvedic principles, traditional medicine concepts, and their scientific basis. Include historical context, therapeutic applications, and relevant Sanskrit terminology with explanations as per BAMS curriculum and university examination patterns.';
//         examRelevanceTagForPrompt = 'University Exams (BAMS)';
//         break;
//       case 'University Exams (MBBS)':
//         examLevelInstruction = 'Focus on medical sciences, human anatomy, physiology, pathology, and pharmacology. Include clinical correlations, disease mechanisms, and diagnostic principles. Emphasize factual accuracy and clinical relevance as per MBBS curriculum and university examination patterns.';
//         examRelevanceTagForPrompt = 'University Exams (MBBS)';
//         break;
//       case 'University Exams (BHMS)':
//         examLevelInstruction = 'Focus on homeopathic principles, materia medica, and repertory. Include philosophical underpinnings, case-taking methodologies, and therapeutic applications. Emphasize conceptual understanding and holistic approach as per BHMS curriculum and university examination patterns.';
//         examRelevanceTagForPrompt = 'University Exams (BHMS)';
//         break;
//       case 'University Exams (B.Sc Agriculture)':
//         examLevelInstruction = 'Focus on agricultural sciences, crop production, soil science, and agricultural economics. Include practical applications, sustainable practices, and relevant policies. Emphasize scientific principles and real-world relevance as per B.Sc Agriculture curriculum and university examination patterns.';
//         examRelevanceTagForPrompt = 'University Exams (B.Sc Agriculture)';
//         break;
//       case 'University Exams (B.Sc Veterinary)':
//         examLevelInstruction = 'Focus on veterinary sciences, animal anatomy, physiology, diseases, and livestock management. Include diagnostic procedures, treatment protocols, and public health aspects. Emphasize practical knowledge and animal welfare as per B.Sc Veterinary curriculum and university examination patterns.';
//         examRelevanceTagForPrompt = 'University Exams (B.Sc Veterinary)';
//         break;
//       case 'General':
//       default:
//         examLevelInstruction = 'Provide a general, comprehensive overview suitable for foundational understanding. Balance theoretical and practical aspects, and explain concepts clearly for a broad audience.';
//         examRelevanceTagForPrompt = 'General Knowledge';
//         break;
//     }

//     const DESCRIPTIVE_STYLE_GUIDE = `
// OUTPUT LENGTH & STYLE:
// - Target length: **1,600–2,600 words** (comprehensive chapter-like notes).
// - Write in **descriptive paragraphs**, not terse bullets.
// - If bullets are absolutely necessary, each bullet must be **2–3 full sentences**.
// - Progress naturally from **basics → intermediate → advanced** so a beginner can follow.
// - Use precise, exam-appropriate terminology, but always **explain terms in plain language** on first use.
// - Keep tone teacherly and clear; avoid filler or fluff.
// `;

//     const CORE_RULES = `
// MATHEMATICAL EXPRESSIONS & FORMATTING RULES:
// - Use **KaTeX-compatible LaTeX** for all mathematical expressions.
// - Use **inline LaTeX** for short expressions: $\\text{e.g., } E=mc^2$.
// - Use **display LaTeX** for equations on their own line: $$\\text{e.g., } \\int_a^b f(x) dx = F(b) - F(a)$$.
// - Do NOT use \\\[...] or \\\( ... \\\) or equation environments.
// - Define every symbol and unit in plain words near first use.
// - Never repeat the same formula or definition.
// - Use clean Markdown: #, ##, ### for headings; **bold** for key terms; *italics* for emphasis.
// - When including currency or units inside math, wrap in \\text{ } (e.g., $\\text{₹}1200$ or $5 \\text{ m/s}$).
// `;

//     const SHARED_STRUCTURE = `
// REQUIRED STRUCTURE (Paragraph-first, Exam-Specific Sync):
// # ${topic} in ${subject}

// ## Introduction
// Write a gentle, beginner-friendly opening that defines the topic in plain language, gives brief context or historical background where relevant, and explains why exams care about it (${examRelevanceTagForPrompt}).

// ## Detailed Explanation (Progressive Flow)
// Explain all subtopics in a **continuous narrative** that starts simple and gradually adds depth. Use analogies, micro-examples, and short caselets. Make the transitions smooth so a reader never feels a jump in difficulty.

// ## Key Ideas & Exam Concepts
// Summarize all essential definitions and principles **within paragraphs**. Insert relevance tags inline like [${examRelevanceTagForPrompt}] where they naturally fit. **Ensure ONLY this exam's relevance tag is used.**

// ## Formulas and Principles
// For each formula: present once with display LaTeX ($$ ... $$), then explain symbols and meaning in words, and add a short, clear worked example or usage scenario. Keep math neat.

// ## Applications & Case Studies
// Describe practical uses and exam-style applications in narrative form. Where suitable, include brief case studies or realistic scenarios and indicate which exams emphasize them.

// ## Misconceptions & Clarifications
// Explain common mistakes learners make and the correct reasoning, using short paragraphs instead of one-liners.

// ## Interlinking with Other Topics
// Describe high-yield connections to other chapters/subjects and why these edges are frequently tested. Mention exam focus where applicable.

// ## Mind Map Overview
// Provide a concise textual overview of the mind map for this topic, describing the central theme and its main branches.
// Then, generate a Mermaid.js graph definition that visually represents the hierarchical structure of the topic as a mind map. Use 'graph TD' (Top-Down) or 'graph LR' (Left-Right) for the graph type. Ensure clear parent-child relationships.

// \`\`\`mermaid
// graph TD
//     A[Central Topic: ${topic}] --> B(Main Branch 1);
//     A --> C(Main Branch 2);
//     B --> D(Sub-topic 1.1);
//     B --> E(Sub-topic 1.2);
//     C --> F(Sub-topic 2.1);
//     C --> G(Sub-topic 2.2);
//     D --> H(Detail 1.1.1);
//     E --> I(Detail 1.2.1);
//     F --> J(Detail 2.1.1);
//     G --> K(Detail 2.2.1);
// \`\`\`


// ## Exam Preparation Strategy
// Give actionable guidance for tackling typical questions (definition, analysis, numerical/diagram-based if applicable), recall strategies, and quick checks for self-evaluation. Provide mnemonics and memory hooks in context.

// ## Study Tips & Revision Plan
// Offer a short plan for moving from beginner → exam-ready: what to read, how to practice PYQs, spaced repetition cues, and how to integrate with mock tests.

// ## Revision Quick Table  
// Provide a concise tabular summary with these columns:  
// - **Concept / Term**  
// - **Explanation (1–2 lines, no bullets)**  
// - **Formula / Example** (if applicable)  
// - **Exam Relevance** ([${examRelevanceTagForPrompt}]) **(MUST use ONLY this tag)**

// `;

//     if (hasSources) {
//       return `You are an expert academic content creator and competitive exam mentor with 20+ years of experience in ${subject}.
// Create **AUTHENTIC, HIGH-QUALITY, BEGINNER-FRIENDLY yet EXAM-READY notes** for the topic "${topic}" in ${subject},
// **USING ONLY** the uploaded materials below. **Do not add external facts.** If any subtopic is missing, explicitly write: "The uploaded materials do not cover this subtopic." Expand explanations descriptively so a first-time learner understands everything.

// **EXAM LEVEL FOCUS: ${examLevel}**
// ${examLevelInstruction}

// UPLOADED STUDY MATERIALS (PRIMARY SOURCE):
// ${contentContext}

// CRITICAL CONTENT REQUIREMENTS:
// 1) SOURCE FIDELITY: Extract and synthesize **only** what is verifiable from the uploaded materials. No hallucinations.
// 2) SAME STYLE AS FALLBACK: Write in **long, descriptive paragraphs** (not terse bullets). Build from basic ideas to advanced insights smoothly.
// 3) EXAM-SPECIFIC TAGS: Insert relevance tags inline: [${examRelevanceTagForPrompt}]. **Ensure ONLY this exam's relevance tag is used.**
// 4) QUALITY OVER QUANTITY: Every line must add value; remove redundancy. No duplication of formulas/definitions/examples.
// 5) GAP HONESTY: If something isn't present in sources, say so clearly.

// ${DESCRIPTIVE_STYLE_GUIDE}
// ${CORE_RULES}
// ${SHARED_STRUCTURE}

// Only output the final, polished notes.`;
//     }

//     // No sources → Full syllabus oriented fallback with IDENTICAL rich style
//     return `You are an expert academic content creator and competitive exam mentor with 20+ years in ${subject}.
// There are **no uploaded materials**. Generate **comprehensive, descriptive, beginner→advanced notes** for "${topic}" in ${subject}, matching the same style you would use if sources were provided. Use standard, widely accepted references (NCERTs, Govt publications, and standard competitive exam texts) to ensure correctness.

// **EXAM LEVEL FOCUS: ${examLevel}**
// ${examLevelInstruction}

// EXAM PREPARATION FOCUS:
// - Emphasize concepts that frequently appear in ${subject} competitive exams for ${examLevel}
// - Highlight common exam question patterns related to "${topic}" for ${examLevel}
// - Include memory aids, mnemonics, or quick recall techniques where applicable
// - Focus on problem-solving approaches and application methods relevant to ${examLevel}
// - Mention common mistakes or misconceptions that students should avoid in ${examLevel}
// - **Integrate Problem-Solving Strategies**: Weave in practical problem-solving strategies relevant to competitive exams for ${examLevel}.
// - **Identify and Explain High-Yield Concepts**: Clearly identify and explain concepts that are frequently tested and have high weightage in ${examLevel} exams.
// - **Connect Topics**: Suggest how this topic connects to other high-yield areas in the subject, fostering a holistic understanding for ${examLevel}.
// - **Topper's Strategy Integration**: Incorporate elements of proven study strategies (e.g., active recall, spaced repetition, weakness-first approach) into the study tips or content where naturally applicable for ${examLevel}.

// CONTENT RULES:
// - Write like a **chapter explanation**, not revision bullets.
// - Cover the **entire high-yield syllabus scope** for this topic for ${examLevel}. If an item is *${examLevel}-only depth*, mark *(${examLevel} only)*.
// - Start simple, then deepen naturally; explain every term on first use.
// - For formulas: present once in display LaTeX ($$ ... $$), define symbols, and give one short worked example.
// - Include **mnemonics, misconceptions with clarifications, interlinking, and exam strategy**.
// - Insert exam tags naturally inline: [${examRelevanceTagForPrompt}]. **Ensure ONLY this exam's relevance tag is used.**

// ${DESCRIPTIVE_STYLE_GUIDE}
// ${CORE_RULES}
// ${SHARED_STRUCTURE}

// Only output the final, polished notes.`;
//   }

//   /** Legacy mock content for offline/dev */
//   private static generateMockTheory(subject: string, topic: string): string {
//     const header = `# ${topic} in ${subject}\n\n`;
//     const intro = `## Introduction\n${topic} is a foundational chapter in ${subject}. These notes provide beginner→advanced explanations with exam-specific coverage.\n\n`;
//     const body = `## Detailed Explanation (Progressive Flow)\nThis is placeholder content used only in local mock mode. In production, notes are generated from uploaded materials or the fallback syllabus.\n\n## Key Ideas & Exam Concepts\nSummarize key ideas in paragraphs with inline tags like [General Knowledge] or [UPSC Civil Services].\n\n## Formulas and Principles\nFor example: $$\\text{Newton's Second Law: } F = ma$$ where $F$ is force, $m$ is mass, and $a$ is acceleration.\n\n## Applications & Case Studies\nTie concepts to realistic examples and exam questions.\n\n## Misconceptions & Clarifications\nAddress common errors and provide correct reasoning.\n\n## Interlinking with Other Topics\nDescribe how this topic links to adjacent chapters.\n\n## Mind Map Overview\nProvide a concise textual overview of the mind map for this topic, describing the central theme and its main branches.\nThen, generate a Mermaid.js graph definition that visually represents the hierarchical structure of the topic as a mind map.\n\n\`\`\`mermaid\ngraph TD\n    A[Central Topic: ${topic}] --> B(Main Branch 1);\n    A --> C(Main Branch 2);\n    B --> D(Sub-topic 1.1);\n    B --> E(Sub-topic 1.2);\n    C --> F(Sub-topic 2.1);\n    C --> G(Sub-topic 2.2);\n    D --> H(Detail 1.1.1);\n    E --> I(Detail 1.2.1);\n    F --> J(Detail 2.1.1);\n    G --> K(Detail 2.2.1);\n\`\`\`\n\n## Exam Preparation Strategy\nActionable tips for typical question types and quick checks.\n\n## Study Tips & Revision Plan\nSpaced repetition, active recall, and PYQ strategy.\n\n## Revision Quick Table\n| Concept / Term | Explanation | Formula / Example | Exam Relevance |\n|---|---|---|---|\n| **Force** | An external agent capable of changing a body's state of rest or motion. | $F=ma$ | [General Knowledge] |\n| **Inertia** | Tendency of an object to resist changes in its state of motion. | Newton's 1st Law | [General Knowledge] |\n`;
//     return header + intro + body;
//   }
// }




















// src/lib/mistralAI/theoryGeneratorV2.ts
import { Mistral } from '@mistralai/mistralai';
import { supabase } from '../supabase';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
const useMockAI = !apiKey;
const client = apiKey ? new Mistral({ apiKey }) : null;

// Tunables
const MODEL_NAME = 'mistral-large-latest';
const TEMPERATURE = 0.25; // lower = more factual, consistent
const MAX_TOKENS = 8500;  // bump slightly for longer chapters (adjust per plan)

type GeneratedTheory = {
  notes: string;
  mermaid?: string;   // mermaid source (without ```mermaid fences)
  examTag?: string;
  raw?: string;
};

export class TheoryGeneratorV2 { // Renamed class to V2
  /** Public entrypoint
   * Returns a structured object { notes, mermaid, examTag, raw }
   */
  static async generateTheory(
    subject: string,
    topic: string,
    userId: string,
    examLevel: string
  ): Promise<GeneratedTheory> {
    if (useMockAI) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mock = this.generateMockTheory(subject, topic);
      // Parse mock too so front-end sees same structure
      const parsed = this.parseModelOutput(mock, topic);
      parsed.mermaid = parsed.mermaid ?? this.generateMermaidFromHeadings(parsed.notes, topic);
      parsed.examTag = parsed.examTag ?? this.getExamTag(examLevel);
      parsed.notes = this.ensureExamTagInNotes(parsed.notes, parsed.examTag);
      return parsed;
    }

    try {
      const relevantContent = await this.retrieveRelevantContent(subject, topic, userId);
      const prompt = this.getUnifiedPrompt(subject, topic, relevantContent, examLevel);

      const response = await client!.chat.complete({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content:
              `You are a senior mentor and academic content creator specializing in ${examLevel}. 
Your task is to generate structured notes strictly aligned with ${examLevel} requirements. 
Never hallucinate. Use ONLY provided sources when present. Prefer descriptive paragraphs over bullets. Avoid one-liners.`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
      });

      const out = response.choices?.[0]?.message?.content?.trim() ?? '';
      if (!out || out.length === 0) {
        return this.generateMockReturn(subject, topic, examLevel);
      }

      // Parse the model output into structured parts
      const parsed = this.parseModelOutput(out, topic);

      // guarantee we have a mermaid graph; if the model didn't produce one, auto-create from headings
      parsed.mermaid = parsed.mermaid ?? this.generateMermaidFromHeadings(parsed.notes, topic);

      // guarantee examTag exists
      parsed.examTag = parsed.examTag ?? this.getExamTag(examLevel);

      // ensure the canonical tag appears in the notes
      parsed.notes = this.ensureExamTagInNotes(parsed.notes, parsed.examTag);

      // include raw for debugging
      parsed.raw = out;

      return parsed;
    } catch (error) {
      console.error('Error generating theory:', error);
      return this.generateMockReturn(subject, topic, examLevel);
    }
  }

  /** Helper: fallback that returns structured mock output */
  private static generateMockReturn(subject: string, topic: string, examLevel: string): GeneratedTheory {
    const raw = this.generateMockTheory(subject, topic);
    const parsed = this.parseModelOutput(raw, topic);
    parsed.mermaid = parsed.mermaid ?? this.generateMermaidFromHeadings(parsed.notes, topic);
    parsed.examTag = parsed.examTag ?? this.getExamTag(examLevel);
    parsed.notes = this.ensureExamTagInNotes(parsed.notes, parsed.examTag);
    parsed.raw = raw;
    return parsed;
  }

  /** RAG: Fetch uploaded materials with a relevance ranking pipeline. */
  private static async retrieveRelevantContent(
    subject: string,
    topic: string,
    userId: string,
  ): Promise<string[]> {
    try {
      const { data: materials, error } = await supabase
        .from('uploaded_materials')
        .select('extracted_content, filename, processed_topics, exam_relevance_score')
        .eq('user_id', userId)
        .gte('exam_relevance_score', 4); // slightly permissive threshold

      if (error) {
        console.error('Supabase error retrieving uploaded materials:', error);
        return [];
      }
      if (!materials || materials.length === 0) return [];

      // Normalize query terms
      const subjectKey = subject.toLowerCase();
      const topicKey = topic.toLowerCase();

      type Item = {
        content: string;
        filename?: string;
        processed_topics?: string[];
        score: number;
      };

      const scored: Item[] = materials
        .map((m: any) => {
          const content: string = m.extracted_content || '';
          const filename: string = (m.filename || '').toLowerCase();
          const topics: string[] = Array.isArray(m.processed_topics) ? m.processed_topics : [];
          const text = content.toLowerCase();

          const subjectHit = Number(
            text.includes(subjectKey) ||
              filename.includes(subjectKey) ||
              topics.some((t) => t?.toLowerCase?.().includes(subjectKey)),
          );
          const topicHit = Number(
            text.includes(topicKey) ||
              filename.includes(topicKey) ||
              topics.some((t) => t?.toLowerCase?.().includes(topicKey)),
          );

          // Soft scoring: topic match weighted higher than subject match
          const score = topicHit * 2 + subjectHit + (m.exam_relevance_score || 0) * 0.25;

          return { content, filename: m.filename, processed_topics: topics, score };
        })
        .sort((a, b) => b.score - a.score);

      // Take top N and extract relevant sections
      const top = scored.slice(0, 10);
      const snippets: string[] = [];

      for (const t of top) {
        const snippet = this.extractRelevantSections(t.content, subject, topic);
        if (snippet && snippet.length > 160) snippets.push(this.normalize(snippet));
        if (snippets.length >= 6) break;
      }

      // Deduplicate by simple semantic similarity on word sets
      const unique = this.dedupeBySimilarity(snippets, 0.82);
      return unique.slice(0, 5);
    } catch (err) {
      console.error('Error in retrieveRelevantContent:', err);
      return [];
    }
  }

  /** Extract relevant sections with neighbor-window expansion for context. */
  private static extractRelevantSections(content: string, subject: string, topic: string): string {
    if (!content || content.trim().length < 30) return '';

    const maxLen = 5200; // generous prompt budget per source
    const cleaned = content.replace(/\u0000/g, '').replace(/\s+\n/g, '\n').trim();

    const paras = cleaned
      .split(/\n\s*\n/g)
      .map((p) => p.trim())
      .filter((p) => p.length > 30);

    const sKey = subject.toLowerCase();
    const tKey = topic.toLowerCase();

    // rank paragraphs by presence of topic and subject
    const ranks = paras.map((p, i) => {
      const l = p.toLowerCase();
      const score = (l.includes(tKey) ? 2 : 0) + (l.includes(sKey) ? 1 : 0);
      return { i, p, score };
    });

    const sorted = ranks.sort((a, b) => b.score - a.score).slice(0, 8);

    // collect with a window around top hits to preserve context
    const take = new Set<number>();
    for (const r of sorted) {
      for (let j = Math.max(0, r.i - 1); j <= Math.min(paras.length - 1, r.i + 1); j++) {
        take.add(j);
      }
    }

    // build output up to maxLen
    let out = '';
    const chosen = Array.from(take).sort((a, b) => a - b).map(idx => paras[idx]); // Ensure order
    for (const chunk of chosen) {
      if (out.length + chunk.length + 2 > maxLen) break;
      out += chunk + '\n\n';
    }

    if (out.trim().length > 160) return out.trim();

    // last resort: first few paragraphs
    return paras.slice(0, 4).join('\n\n');
  }

  /** Simple text normalization */
  private static normalize(s: string) {
    return s.replace(/\s+/g, ' ').replace(/\u0000/g, '').trim();
  }

  /** Very light similarity dedupe on word sets */
  private static dedupeBySimilarity(snippets: string[], threshold = 0.85) {
    const result: string[] = [];
    for (const s of snippets) {
      let isDup = false;
      const setA = new Set(s.toLowerCase().split(/[^a-z0-9]+/g).filter(Boolean));
      for (const r of result) {
        const setB = new Set(r.toLowerCase().split(/[^a-z0-9]+/g).filter(Boolean));
        const inter = new Set([...setA].filter((w) => setB.has(w)));
        const union = new Set([...setA, ...setB]);
        const sim = inter.size / Math.max(1, union.size);
        if (sim >= threshold) { isDup = true; break; }
      }
      if (!isDup) result.push(s);
    }
    return result;
  }

  /**
   * Prepare exam instruction and canonical tag from examLevel (centralized)
   */
  private static getExamConfig(examLevel: string) {
  let examLevelInstruction = '';
  let examRelevanceTagForPrompt = examLevel || 'General Knowledge';

  switch (examLevel) {
    // ---------------- Boards & Universities ----------------
    case 'Board Exams (Class 12)':
      examLevelInstruction = 'Provide NCERT-aligned, structured explanations. Keep notes descriptive yet precise, with emphasis on clarity, diagrams, derivations, and typical Class 12 board exam-style questions.';
      examRelevanceTagForPrompt = 'Board Exams (Class 12)';
      break;

    case 'University Exams (B.Arch)':
      examLevelInstruction = 'Focus on architecture fundamentals, design theory, structural mechanics, building materials, and drawing-based questions. Include conceptual clarity with practical architectural applications.';
      examRelevanceTagForPrompt = 'University Exams (B.Arch)';
      break;

    case 'University Exams (B.Tech)':
      examLevelInstruction = 'Focus on technical depth, engineering fundamentals, derivations, numerical problem solving, and applied engineering concepts. Align explanations with typical B.Tech semester exam style.';
      examRelevanceTagForPrompt = 'University Exams (B.Tech)';
      break;

    case 'University Exams (BAMS)':
      examLevelInstruction = 'Cover Ayurveda concepts, classical texts, clinical correlations, and modern applications. Maintain exam relevance with case-based questions and terminology as expected in BAMS exams.';
      examRelevanceTagForPrompt = 'University Exams (BAMS)';
      break;

    case 'University Exams (MBBS)':
      examLevelInstruction = 'Emphasize medical fundamentals, anatomy, physiology, pathology, pharmacology, and clinical applications. Include exam-focused correlations, diagrams, and case-based reasoning.';
      examRelevanceTagForPrompt = 'University Exams (MBBS)';
      break;

    case 'University Exams (BHMS)':
      examLevelInstruction = 'Focus on homeopathic principles, materia medica, organon, and clinical case applications. Keep explanations aligned with BHMS university exam question patterns.';
      examRelevanceTagForPrompt = 'University Exams (BHMS)';
      break;

    case 'University Exams (B.Sc Agriculture)':
      examLevelInstruction = 'Cover crop science, soil science, genetics, plant breeding, entomology, and extension education. Include applied case studies and examples relevant to B.Sc Agriculture exams.';
      examRelevanceTagForPrompt = 'University Exams (B.Sc Agriculture)';
      break;

    case 'University Exams (B.Sc Veterinary)':
      examLevelInstruction = 'Cover veterinary anatomy, physiology, pathology, surgery, and animal husbandry. Include case-based examples relevant to veterinary practices and exam requirements.';
      examRelevanceTagForPrompt = 'University Exams (B.Sc Veterinary)';
      break;

    // ---------------- General ----------------
    case 'General':
      examLevelInstruction = 'Provide a general, comprehensive overview suitable for foundational understanding. Balance theoretical and practical aspects, and explain concepts clearly for a broad audience.';
      examRelevanceTagForPrompt = 'General';
      break;

    // ---------------- National Exams ----------------
    case 'UPSC Civil Services':
      examLevelInstruction = 'Focus on analytical depth, conceptual clarity, interdisciplinary connections, and relevance to General Studies papers. Include nuances, critical perspectives, and essay/answer writing perspectives.';
      examRelevanceTagForPrompt = 'UPSC Civil Services';
      break;

    case 'Banking (SBI PO/Clerk)':
      examLevelInstruction = 'Focus on reasoning shortcuts, quantitative aptitude tricks, English comprehension, banking awareness, and current affairs. Provide exam-relevant practice strategies for speed and accuracy.';
      examRelevanceTagForPrompt = 'Banking (SBI PO/Clerk)';
      break;

    case 'JEE Main/Advanced':
      examLevelInstruction = 'Emphasize problem-solving approaches, numerical applications, and conceptual understanding required for engineering entrance exams. Include formulas, derivations, and common problem-solving techniques.';
      examRelevanceTagForPrompt = 'JEE Main/Advanced';
      break;

    case 'SSC CGL':
      examLevelInstruction = 'Focus on factual clarity, static GK, reasoning shortcuts, quantitative aptitude tricks, and memory-based quick recall. Keep content precise but explanatory for SSC exam standards.';
      examRelevanceTagForPrompt = 'SSC CGL';
      break;

    case 'NEET UG':
      examLevelInstruction = 'Focus on biological and chemical concepts, factual recall, and clinical correlations necessary for NEET. Include diagrams (textual), mnemonics, and exam question patterns.';
      examRelevanceTagForPrompt = 'NEET UG';
      break;

    case 'CAT':
      examLevelInstruction = 'Emphasize quantitative aptitude, data interpretation, logical reasoning, and verbal ability. Provide exam-style strategies for time management, accuracy, and problem-solving techniques.';
      examRelevanceTagForPrompt = 'CAT';
      break;

    case 'GATE':
      examLevelInstruction = 'Focus on in-depth technical knowledge, derivations, numerical problem solving, and applied engineering concepts. Highlight GATE-style problem solving with previous year question references.';
      examRelevanceTagForPrompt = 'GATE';
      break;

    // ---------------- Default ----------------
    default:
      examLevelInstruction = 'Provide a general, comprehensive overview suitable for foundational understanding. Balance theoretical and practical aspects, and explain concepts clearly for a broad audience.';
      examRelevanceTagForPrompt = 'General Knowledge';
      break;
  }

  return { examLevelInstruction, examRelevanceTagForPrompt };
}

  /**
   * Unified Prompt Generator
   * - With sources: STRICT source fidelity (no external facts)
   * - Without sources: Same rich, descriptive style using standard consensus sources
   *
   * Important: we now instruct the model to append a deterministic metadata block
   * wrapped between <META_START> ... <META_END> so the caller can extract
   * the mermaid mindmap and canonical exam tag reliably.
   */
  private static getUnifiedPrompt(subject: string, topic: string, relevantContent: string[], examLevel: string): string {
    const hasSources = Array.isArray(relevantContent) && relevantContent.length > 0;
    const contentContext = hasSources ? relevantContent.join('\n\n---\n\n') : '(no uploaded materials)';
    const { examLevelInstruction, examRelevanceTagForPrompt } = this.getExamConfig(examLevel);

    const DESCRIPTIVE_STYLE_GUIDE = `
OUTPUT LENGTH & STYLE:
- Target length: **1,600–2,600 words** (comprehensive chapter-like notes).
- Write in **descriptive paragraphs**, not terse bullets.
- If bullets are absolutely necessary, each bullet must be **2–3 full sentences**.
- Progress naturally from **basics → intermediate → advanced** so a beginner can follow.
- Use precise, exam-appropriate terminology, but always **explain terms in plain language** on first use.
- Keep tone teacherly and clear; avoid filler or fluff.
`;

    const CORE_RULES = `
MATHEMATICAL EXPRESSIONS & FORMATTING RULES:
- Use **KaTeX-compatible LaTeX** for all mathematical expressions.
- Use **inline LaTeX** for short expressions: $\\text{e.g., } E=mc^2$.
- Use **display LaTeX** for equations on their own line: $$
\\text{e.g., } \\int_a^b f(x) dx = F(b) - F(a)
$$.
- Do NOT use \\\\[ ... \\\\] or \\( ... \\) or equation environments.
- Define every symbol and unit in plain words near first use.
- Never repeat the same formula or definition.
- Use clean Markdown: #, ##, ### for headings; **bold** for key terms; *italics* for emphasis.
- When including currency or units inside math, wrap in \\text{ } (e.g., $\\text{₹}1200$ or $5 \\text{ m/s}$).
`;

    const SHARED_STRUCTURE = `
REQUIRED STRUCTURE (Paragraph-first, Exam-Specific Sync):
# ${topic} in ${subject}

## Introduction
Write a gentle, beginner-friendly opening that defines the topic in plain language, gives brief context or historical background where relevant, and explains why exams care about it ([${examRelevanceTagForPrompt}]).

## Detailed Explanation (Progressive Flow)
Explain all subtopics in a **continuous narrative** that starts simple and gradually adds depth. Use analogies, micro-examples, and short caselets. Make the transitions smooth so a reader never feels a jump in difficulty.

## Key Ideas & Exam Concepts
Summarize all essential definitions and principles **within paragraphs**. Insert relevance tags inline like [${examRelevanceTagForPrompt}] where they naturally fit. **Ensure ONLY this exam's relevance tag is used.**

## Formulas and Principles
For each formula: present once with display LaTeX ($$ ... $$), then explain symbols and meaning in words, and add a short, clear worked example or usage scenario. Keep math neat.

## Applications & Case Studies
Describe practical uses and exam-style applications in narrative form. Where suitable, include brief case studies or realistic scenarios and indicate which exams emphasize them.

## Misconceptions & Clarifications
Explain common mistakes learners make and the correct reasoning, using short paragraphs instead of one-liners.

## Interlinking with Other Topics
Describe high-yield connections to other chapters/subjects and why these edges are frequently tested. Mention exam focus where applicable.

## Mind Map Overview
 Provide a concise textual overview of the mind map for this topic, describing the central theme and its main branches.
 Then, generate a Mermaid.js graph definition that visually represents the hierarchical structure of the topic as a **true mind map**.  
 Use **graph LR** (Left-to-Right) so branches radiate horizontally like a real mind map.  
 Place the **central node in the middle**.  
 Expand into **3–4 hierarchical levels** (main branches → sub-branches → details).  
 Keep labels short and clear.  
 Ensure children alternate left/right so the map is balanced.

\`\`\`${'```'}mermaid
graph LR
    A[Central Topic: ${topic}]
    A --> B(Main Branch 1)
    A --> C(Main Branch 2)
    A --> D(Main Branch 3)
    B --> B1(Sub-topic 1.1)
    B --> B2(Sub-topic 1.2)
    C --> C1(Sub-topic 2.1)
    D --> D1(Sub-topic 3.1)
    D --> D2(Sub-topic 3.2)
\`\`\`${'```'}

## Exam Preparation Strategy
Give actionable guidance for tackling typical questions (definition, analysis, numerical/diagram-based if applicable), recall strategies, and quick checks for self-evaluation. Provide mnemonics and memory hooks in context.

## Study Tips & Revision Plan
Offer a short plan for moving from beginner → exam-ready: what to read, how to practice PYQs, spaced repetition cues, and how to integrate with mock tests.

## Revision Quick Table  
Provide a concise tabular summary with these columns:  
- **Concept / Term**  
- **Explanation (1–2 lines, no bullets)**  
- **Formula / Example** (if applicable)  
- **Exam Relevance** ([${examRelevanceTagForPrompt}]) **(MUST use ONLY this tag)**

`;

    // Machine-readable metadata instructions appended EXACTLY as shown so parsing is deterministic.
    const METADATA_INSTRUCTIONS = `
IMPORTANT: After the full human-readable notes, append a machine-readable metadata block EXACTLY in this format (no extra words outside the block):

<META_START>
EXAM_TAG=${examRelevanceTagForPrompt}
MINDMAP_START
${'```'}mermaid
(graph definition here; use graph TD ... )
${'```'}
MINDMAP_END
META_END

Notes:
- The EXAM_TAG line must contain the exact canonical exam tag string (no brackets).
- The mermaid graph must be placed between MINDMAP_START and MINDMAP_END using a fenced mermaid block as above.
- If a subtopic is missing in the sources, explicitly write: "The uploaded materials do not cover this subtopic." inside the note body, then still include META block.
- Only output the final polished notes followed by the metadata block (no extra commentary after META_END).
`;

    if (hasSources) {
      return `You are an expert academic content creator and competitive exam mentor with 20+ years of experience in ${subject}.
Create **AUTHENTIC, HIGH-QUALITY, BEGINNER-FRIENDLY yet EXAM-READY notes** for the topic "${topic}" in ${subject},
**USING ONLY** the uploaded materials below. **Do not add external facts.** If any subtopic is missing, explicitly write: "The uploaded materials do not cover this subtopic." Expand explanations descriptively so a first-time learner understands everything.

**EXAM LEVEL FOCUS: ${examLevel}**
${examLevelInstruction}

UPLOADED STUDY MATERIALS (PRIMARY SOURCE):
${contentContext}

CRITICAL CONTENT REQUIREMENTS:
1) SOURCE FIDELITY: Extract and synthesize **only** what is verifiable from the uploaded materials. No hallucinations.
2) SAME STYLE AS FALLBACK: Write in **long, descriptive paragraphs** (not terse bullets). Build from basic ideas to advanced insights smoothly.
3) EXAM-SPECIFIC TAGS: Insert relevance tags inline: [${examRelevanceTagForPrompt}]. **Ensure ONLY this exam's relevance tag is used.**
4) QUALITY OVER QUANTITY: Every line must add value; remove redundancy. No duplication of formulas/definitions/examples.
5) GAP HONESTY: If something isn't present in sources, say so clearly.

${DESCRIPTIVE_STYLE_GUIDE}
${CORE_RULES}
${SHARED_STRUCTURE}
${METADATA_INSTRUCTIONS}

Only output the final, polished notes followed by the metadata block.`;
    }

    // No sources → Full syllabus oriented fallback with IDENTICAL rich style
    return `You are an expert academic content creator and competitive exam mentor with 20+ years in ${subject}.
There are **no uploaded materials**. Generate **comprehensive, descriptive, beginner→advanced notes** for "${topic}" in ${subject}, matching the same style you would use if sources were provided. Use standard, widely accepted references (NCERTs, Govt publications, and standard competitive exam texts) to ensure correctness.

**EXAM LEVEL FOCUS: ${examLevel}**
${examLevelInstruction}

EXAM PREPARATION FOCUS:
- Emphasize concepts that frequently appear in ${subject} competitive exams for ${examLevel}
- Highlight common exam question patterns related to "${topic}" for ${examLevel}
- Include memory aids, mnemonics, or quick recall techniques where applicable
- Focus on problem-solving approaches and application methods relevant to ${examLevel}
- Mention common mistakes or misconceptions that students should avoid in ${examLevel}
- **Integrate Problem-Solving Strategies**: Weave in practical problem-solving strategies relevant to competitive exams for ${examLevel}.
- **Identify and Explain High-Yield Concepts**: Clearly identify and explain concepts that are frequently tested and have high weightage in ${examLevel} exams.
- **Connect Topics**: Suggest how this topic connects to other high-yield areas in the subject, fostering a holistic understanding for ${examLevel}.
- **Topper's Strategy Integration**: Incorporate elements of proven study strategies (e.g., active recall, spaced repetition, weakness-first approach) into the study tips or content where naturally applicable for ${examLevel}.

CONTENT RULES:
- Write like a **chapter explanation**, not revision bullets.
- Cover the **entire high-yield syllabus scope** for this topic for ${examLevel}. If an item is *${examLevel}-only depth*, mark *(${examLevel} only)*.
- Start simple, then deepen naturally; explain every term on first use.
- For formulas: present once in display LaTeX ($$ ... $$), define symbols, and give one short worked example.
- Include **mnemonics, misconceptions with clarifications, interlinking, and exam strategy**.
- Insert exam tags naturally inline: [${examRelevanceTagForPrompt}]. **Ensure ONLY this exam's relevance tag is used.**

${DESCRIPTIVE_STYLE_GUIDE}
${CORE_RULES}
${SHARED_STRUCTURE}
${METADATA_INSTRUCTIONS}

Only output the final, polished notes followed by the metadata block.`;
  }

  /** Legacy mock content for offline/dev */
  private static generateMockTheory(subject: string, topic: string): string {
    const header = `# ${topic} in ${subject}\n\n`;
    const intro = `## Introduction\n${topic} is a foundational chapter in ${subject}. These notes provide beginner→advanced explanations with exam-specific coverage.\n\n`;
    const body = `## Detailed Explanation (Progressive Flow)\nThis is placeholder content used only in local mock mode. In production, notes are generated from uploaded materials or the fallback syllabus.\n\n## Key Ideas & Exam Concepts\nSummarize key ideas in paragraphs with inline tags like [General Knowledge] or [UPSC Civil Services].\n\n## Formulas and Principles\nFor example: $$\\text{Newton's Second Law: } F = ma$$ where $F$ is force, $m$ is mass, and $a$ is acceleration.\n\n## Applications & Case Studies\nTie concepts to realistic examples and exam questions.\n\n## Misconceptions & Clarifications\nAddress common errors and provide correct reasoning.\n\n## Interlinking with Other Topics\nDescribe how this topic links to adjacent chapters.\n\n## Mind Map Overview\nProvide a concise textual overview of the mind map for this topic, describing the central theme and its main branches.\nThen, generate a Mermaid.js graph definition that visually represents the hierarchical structure of the topic as a mind map.\n\n${'```'}mermaid\ngraph TD\n    A[Central Topic: ${topic}] --> B(Main Branch 1);\n    A --> C(Main Branch 2);\n    B --> D(Sub-topic 1.1);\n    B --> E(Sub-topic 1.2);\n    C --> F(Sub-topic 2.1);\n    C --> G(Sub-topic 2.2);\n    D --> H(Detail 1.1.1);\n    E --> I(Detail 1.2.1);\n    F --> J(Detail 2.1.1);\n    G --> K(Detail 2.2.1);\n${'```'}\n\n## Exam Preparation Strategy\nActionable tips for typical question types and quick checks.\n\n## Study Tips & Revision Plan\nSpaced repetition, active recall, and PYQ strategy.\n\n## Revision Quick Table\n| Concept / Term | Explanation | Formula / Example | Exam Relevance |\n|---|---|---|---|\n| **Force** | An external agent capable of changing a body's state of rest or motion. | $F=ma$ | [General Knowledge] |\n| **Inertia** | Tendency of an object to resist changes in its state of motion. | Newton's 1st Law | [General Knowledge] |\n`;
    return header + intro + body;
  }

  /** ------- NEW: parsing & helpers ------- */

  /**
   * Parse the model output. Looks for the explicit machine-readable META block first.
   * If not found, falls back to searching for fenced mermaid blocks and bracketed tags.
   */
  private static parseModelOutput(raw: string, topic: string): GeneratedTheory {
    const result: GeneratedTheory = { notes: raw };

    // Try to find <META_START> ... <META_END> block
    const metaRegex = /<META_START>([\s\S]*?)<META_END>/i;
    const metaMatch = raw.match(metaRegex);
    if (metaMatch) {
      const metaBody = metaMatch[1];

      // EXAM_TAG=...
      const examTagMatch = metaBody.match(/EXAM_TAG\s*=\s*(.+)/i);
      if (examTagMatch) result.examTag = examTagMatch[1].trim();

      // mermaid block between MINDMAP_START and MINDMAP_END
      const mindmapMatch = metaBody.match(/MINDMAP_START([\s\S]*?)MINDMAP_END/i);
      if (mindmapMatch) {
        // inside that, extract fenced mermaid if present
        const fenced = mindmapMatch[1].match(/```mermaid\s*([\s\S]*?)```/i);
        if (fenced) {
          result.mermaid = fenced[1].trim();
        } else {
          // maybe the model omitted fences — accept raw content inside block
          result.mermaid = mindmapMatch[1].trim();
        }
      }

      // remove the metadata block from notes
      result.notes = raw.replace(metaRegex, '').trim();
      return result;
    }

    // Fallback 1: look for any fenced mermaid block
    const mermaidAny = raw.match(/```mermaid\s*([\s\S]*?)```/i);
    if (mermaidAny) result.mermaid = mermaidAny[1].trim();

    // Fallback 2: try to detect a likely exam tag in square brackets near the "Key Ideas" section
    const explicitTag = raw.match(/\[([A-Za-z0-9 \-\/&().]{3,80})\]/);
    if (explicitTag) {
      // Avoid capturing short generic words; heuristic: >= 3 characters
      result.examTag = explicitTag[1].trim();
    }

    // Result.notes should not include the mermaid block if it was fenced in-body
    if (result.mermaid) {
      result.notes = raw.replace(/```mermaid\s*([\s\S]*?)```/i, '').trim();
    } else {
      result.notes = raw;
    }

    return result;
  }

  /** If the model doesn't produce a mermaid, build a simple one from headings.
   * - Level 2 (##) become main branches
   * - Level 3 (###) become children
   * - Level 4 (####) become grandchildren (limited)
   */
 private static generateMermaidFromHeadings(notes: string, topic: string): string {
  const lines = notes.split(/\r?\n/);
  const rootId = 'A0';
  const nodes: string[] = [];
  const edges: string[] = [];
  const headings: { level: number; text: string }[] = [];

  lines.forEach((l) => {
    const m = l.match(/^(#{2,4})\s*(.+)$/);
    if (m) headings.push({ level: m[1].length, text: m[2].trim() });
  });

  if (headings.length === 0) {
    return `graph LR\n    ${rootId}[Central Topic: ${topic}]`;
  }

  nodes.push(`${rootId}[Central Topic: ${topic}]`);

  let sideToggle = true; // alternate sides
  headings.forEach((h, idx) => {
    const id = `H${idx}`;
    const label = h.text.replace(/\[/g, '(').replace(/\]/g, ')');
    nodes.push(`${id}[${label}]`);

    if (h.level === 2) {
      const dirClass = sideToggle ? ":::left" : ":::right";
      edges.push(`${rootId} --> ${id}${dirClass}`);
      sideToggle = !sideToggle;
    } else {
      let parent = rootId;
      for (let j = idx - 1; j >= 0; j--) {
        if (headings[j].level < h.level) {
          parent = `H${j}`;
          break;
        }
      }
      edges.push(`${parent} --> ${id}`);
    }
  });

  return [
    "graph LR",
    ...nodes.map((n) => "    " + n),
    ...edges.map((e) => "    " + e),
    "classDef left fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;",
    "classDef right fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px;"
  ].join("\n");
}

  /** Ensure canonical exam tag appears in the notes (insert near Key Ideas section or append) */
  private static ensureExamTagInNotes(notes: string, tag?: string): string {
    if (!tag) return notes;
    if (notes.includes(`[${tag}]`)) return notes;

    // insert after "## Key Ideas & Exam Concepts" if present (case-insensitive)
    const headingRegex = /(##\s*Key Ideas & Exam Concepts[^\n]*\n)/i;
    if (headingRegex.test(notes)) {
      return notes.replace(headingRegex, (m, g1) => `${g1}\nExam Relevance: [${tag}]\n\n`);
    }

    // else append a short line near the end before Revision Quick Table if possible
    const tableRegex = /(##\s*Revision Quick Table)/i;
    if (tableRegex.test(notes)) {
      return notes.replace(tableRegex, (m) => `Exam Relevance: [${tag}]\n\n${m}`);
    }

    // final fallback: append at the end
    return `${notes}\n\nExam Relevance: [${tag}]`;
  }

  /** Return canonical exam tag for a given examLevel (fallback) */
  private static getExamTag(examLevel: string): string {
    const cfg = this.getExamConfig(examLevel);
    return cfg.examRelevanceTagForPrompt;
  }

  /** ------- end new helpers ------- */

  /** Legacy mock for other code paths when needed */
  private static generateMockTheoryWithMeta(subject: string, topic: string): string {
    // Not used currently; kept for reference
    return this.generateMockTheory(subject, topic);
  }
}
