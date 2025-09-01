// import { Mistral } from '@mistralai/mistralai';
// import { supabase } from '../supabase';

// const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
// const useMockAI = !apiKey;
// const client = apiKey ? new Mistral({ apiKey }) : null;

// export class TheoryGenerator {
//   static async generateTheory(subject: string, topic: string, userId: string) {
//     if (useMockAI) {
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       return this.generateMockTheory(subject, topic);
//     }

//     try {
//       // Retrieve relevant uploaded materials using RAG
//       const relevantContent = await this.retrieveRelevantContent(subject, topic, userId);
      
//       if (!relevantContent || relevantContent.length === 0) {
//         // Fallback to general theory if no uploaded content is available
//         return await this.generateGeneralTheory(subject, topic);
//       }

//       // Generate theory based on retrieved content
//       const prompt = this.getTheoryPrompt(subject, topic, relevantContent);
      
//       const response = await client!.chat.complete({
//         model: 'mistral-large-latest',
//         messages: [{ role: 'user', content: prompt }],
//         temperature: 0.3, // Lower temperature for more factual content
//         max_tokens: 4000,
//       });

//       return response.choices[0]?.message?.content || this.generateMockTheory(subject, topic);
//     } catch (error) {
//       console.error('Error generating theory:', error);
//       return this.generateMockTheory(subject, topic);
//     }
//   }

//   private static async retrieveRelevantContent(subject: string, topic: string, userId: string): Promise<string[]> {
//     try {
//       // Query uploaded materials for relevant content
//       const { data: materials, error } = await supabase
//         .from('uploaded_materials')
//         .select('extracted_content, filename, processed_topics')
//         .eq('user_id', userId)
//         .gte('exam_relevance_score', 4); // Slightly lower threshold for more content

//       if (error) {
//         console.error('Error retrieving uploaded materials:', error);
//         return [];
//       }

//       if (!materials || materials.length === 0) {
//         return [];
//       }

//       // First pass: Find materials that contain both subject and topic (highest relevance)
//       const highRelevanceMaterials = materials
//         .filter(material => {
//           const content = material.extracted_content?.toLowerCase() || '';
//           const topics = material.processed_topics || [];
//           const filename = material.filename?.toLowerCase() || '';
          
//           const subjectMatch = content.includes(subject.toLowerCase()) || 
//                                filename.includes(subject.toLowerCase()) ||
//                                topics.some(t => t.toLowerCase().includes(subject.toLowerCase()));
          
//           const topicMatch = content.includes(topic.toLowerCase()) ||
//                             filename.includes(topic.toLowerCase()) ||
//                             topics.some(t => t.toLowerCase().includes(topic.toLowerCase()));
          
//           return subjectMatch && topicMatch; // Both must match for high relevance
//         })
//         .map(material => {
//           const content = material.extracted_content || '';
//           const relevantSections = this.extractRelevantSections(content, subject, topic);
//           return relevantSections;
//         })
//         .filter(content => content.length > 100);

//       // If we have enough high-relevance materials, use them
//       if (highRelevanceMaterials.length >= 2) {
//         return highRelevanceMaterials.slice(0, 5);
//       }

//       // Second pass: Include materials that match either subject or topic
//       const mediumRelevanceMaterials = materials
//         .filter(material => {
//           const content = material.extracted_content?.toLowerCase() || '';
//           const topics = material.processed_topics || [];
//           const filename = material.filename?.toLowerCase() || '';
          
//           const subjectMatch = content.includes(subject.toLowerCase()) || 
//                                filename.includes(subject.toLowerCase()) ||
//                                topics.some(t => t.toLowerCase().includes(subject.toLowerCase()));
          
//           const topicMatch = content.includes(topic.toLowerCase()) ||
//                             filename.includes(topic.toLowerCase()) ||
//                             topics.some(t => t.toLowerCase().includes(topic.toLowerCase()));
          
//           return subjectMatch || topicMatch; // Either can match for medium relevance
//         })
//         .map(material => {
//           const content = material.extracted_content || '';
//           const relevantSections = this.extractRelevantSections(content, subject, topic);
//           return relevantSections;
//         })
//         .filter(content => content.length > 100);

//       // Combine high and medium relevance materials, prioritizing high relevance
//       const allRelevantMaterials = [...highRelevanceMaterials, ...mediumRelevanceMaterials];
      
//       // Remove duplicates and limit to top 5
//       const uniqueMaterials = Array.from(new Set(allRelevantMaterials));
//       return uniqueMaterials.slice(0, 5);

//     } catch (error) {
//       console.error('Error in retrieveRelevantContent:', error);
//       return [];
//     }
//   }

//   private static extractRelevantSections(content: string, subject: string, topic: string): string {
//     // Split content into paragraphs and sentences for better extraction
//     const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 30);
//     const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
//     // Hierarchical extraction: Topic-specific > Subject-specific > General
    
//     // 1. Find paragraphs that mention the specific topic
//     const topicSpecificParagraphs = paragraphs.filter(paragraph => {
//       const lowerParagraph = paragraph.toLowerCase();
//       const topicMatch = lowerParagraph.includes(topic.toLowerCase());
//       return topicMatch;
//     });
    
//     // 2. Find paragraphs that mention the subject (but not already included)
//     const subjectSpecificParagraphs = paragraphs.filter(paragraph => {
//       const lowerParagraph = paragraph.toLowerCase();
//       const subjectMatch = lowerParagraph.includes(subject.toLowerCase());
//       const alreadyIncluded = topicSpecificParagraphs.some(tp => tp === paragraph);
//       return subjectMatch && !alreadyIncluded;
//     });
    
//     // 3. Get general context paragraphs from the beginning
//     const generalParagraphs = paragraphs.slice(0, 3).filter(paragraph => {
//       const alreadyIncluded = topicSpecificParagraphs.some(tp => tp === paragraph) ||
//                              subjectSpecificParagraphs.some(sp => sp === paragraph);
//       return !alreadyIncluded;
//     });
    
//     // Combine in order of relevance
//     let relevantContent = '';
//     let totalLength = 0;
//     const maxLength = 2000; // Limit total content length
    
//     // Increase maxLength for better context
//     const enhancedMaxLength = 4000; // Increased from 2000 to 4000
    
//     // Add topic-specific content first
//     for (const paragraph of topicSpecificParagraphs) {
//       if (totalLength + paragraph.length > enhancedMaxLength) break;
//       relevantContent += paragraph + '\n\n';
//       totalLength += paragraph.length;
//     }
    
//     // Add subject-specific content if space allows
//     for (const paragraph of subjectSpecificParagraphs) {
//       if (totalLength + paragraph.length > enhancedMaxLength) break;
//       relevantContent += paragraph + '\n\n';
//       totalLength += paragraph.length;
//     }
    
//     // Add general content if still space and not enough specific content
//     if (totalLength < 500) { // If we don't have much specific content
//       for (const paragraph of generalParagraphs) {
//         if (totalLength + paragraph.length > enhancedMaxLength) break;
//         relevantContent += paragraph + '\n\n';
//         totalLength += paragraph.length;
//       }
//     }
    
//     // If we have good relevant content, return it
//     if (relevantContent.trim().length > 100) {
//       return relevantContent.trim();
//     }
    
//     // Fallback: look for relevant sentences if paragraphs didn't work well
//     const relevantSentences = sentences.filter(sentence => {
//       const lowerSentence = sentence.toLowerCase();
//       const topicMatch = lowerSentence.includes(topic.toLowerCase());
//       const subjectMatch = lowerSentence.includes(subject.toLowerCase());
      
//       return topicMatch || subjectMatch;
//     });

//     if (relevantSentences.length > 0) {
//       let sentenceContent = '';
//       let sentenceLength = 0;
      
//       for (const sentence of relevantSentences.slice(0, 10)) { // Max 10 sentences
//         if (sentenceLength + sentence.length > enhancedMaxLength) break;
//         sentenceContent += sentence.trim() + '. ';
//         sentenceLength += sentence.length;
//       }
      
//       if (sentenceContent.length > 100) {
//         return sentenceContent.trim();
//       }
//     }

//     // Final fallback: return first few paragraphs as general context
//     return paragraphs.slice(0, 3).join('\n\n');
//   }

//   private static async generateGeneralTheory(subject: string, topic: string): Promise<string> {
//     if (useMockAI) {
//       return this.generateMockTheory(subject, topic);
//     }

//     try {
//       const prompt = `Generate a comprehensive theory explanation for the topic "${topic}" in ${subject}. 
      
//       Please provide:
//       1. Clear definition and introduction
//       2. Key concepts and principles
//       3. Important formulas or relationships (if applicable)
//       4. Real-world applications or examples
//       5. Common misconceptions to avoid
      
//       Make it suitable for exam preparation and easy to understand.`;

//       const response = await client!.chat.complete({
//         model: 'mistral-large-latest',
//         messages: [{ role: 'user', content: prompt }],
//         temperature: 0.3,
//         max_tokens: 2500,
//       });

//       return response.choices[0]?.message?.content || this.generateMockTheory(subject, topic);
//     } catch (error) {
//       console.error('Error generating general theory:', error);
//       return this.generateMockTheory(subject, topic);
//     }
//   }

//   private static generateMockTheory(subject: string, topic: string): string {
//     const theories: Record<string, Record<string, string>> = {
//       'Mathematics': {
//         'Quadratic Equations': `# Quadratic Equations

// ## Introduction
// A quadratic equation is a polynomial equation of degree 2, typically written in the standard form:
// $$ax^2 + bx + c = 0$$ where $a \\neq 0$

// ## Key Concepts

// ### 1. Standard Form
// - $a$ is the coefficient of $x^2$ (quadratic term)
// - $b$ is the coefficient of $x$ (linear term)  
// - $c$ is the constant term

// ### 2. Methods of Solving
// 1. **Factoring Method**: Express as $(px + q)(rx + s) = 0$
// 2. **Quadratic Formula**: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
// 3. **Completing the Square**: Convert to $(x + h)^2 = k$ form

// ### 3. Discriminant (Δ)
// $$\\Delta = b^2 - 4ac$$
// - If $\\Delta > 0$: Two distinct real roots
// - If $\\Delta = 0$: One repeated real root
// - If $\\Delta < 0$: Two complex roots

// ## Applications
// - Projectile motion in physics
// - Profit maximization in economics
// - Area and optimization problems
// - Engineering design calculations

// ## Common Mistakes to Avoid
// - Forgetting that $a \\neq 0$ in quadratic equations
// - Sign errors when applying the quadratic formula
// - Not checking solutions in the original equation`,

//         'Coordinate Geometry': `# Coordinate Geometry

// ## Introduction
// Coordinate geometry combines algebra and geometry using a coordinate system to represent geometric figures and solve problems analytically.

// ## Key Concepts

// ### 1. Distance Formula
// Distance between points $(x_1, y_1)$ and $(x_2, y_2)$:
// $$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

// ### 2. Section Formula
// Point dividing line segment in ratio $m:n$:
// $$x = \\frac{mx_2 + nx_1}{m + n}, \\quad y = \\frac{my_2 + ny_1}{m + n}$$

// ### 3. Slope of a Line
// $$m = \\frac{y_2 - y_1}{x_2 - x_1}$$

// ### 4. Equation of a Line
// - Point-slope form: $y - y_1 = m(x - x_1)$
// - Slope-intercept form: $y = mx + c$
// - Two-point form: $$\\frac{y - y_1}{y_2 - y_1} = \\frac{x - x_1}{x_2 - x_1}$$

// ## Applications
// - GPS navigation systems
// - Computer graphics and animation
// - Architecture and engineering design
// - Data visualization and plotting

// ## Important Properties
// - Parallel lines have equal slopes
// - Perpendicular lines have slopes that multiply to $-1$
// - Collinear points have the same slope between any two pairs`
//       },
//       'Physics': {
//         'Motion in a Straight Line': `# Motion in a Straight Line

// ## Introduction
// Motion in a straight line, also called rectilinear motion, is the simplest form of motion where an object moves along a straight path.

// ## Key Concepts

// ### 1. Position and Displacement
// - **Position**: Location of an object at a given time
// - **Displacement**: Change in position (vector quantity)
// - **Distance**: Total path length traveled (scalar quantity)

// ### 2. Velocity and Speed
// - **Average Velocity**: $v_{avg} = \\frac{\\Delta x}{\\Delta t}$
// - **Instantaneous Velocity**: $v = \\frac{dx}{dt}$
// - **Speed**: Magnitude of velocity (always positive)

// ### 3. Acceleration
// - **Average Acceleration**: $a_{avg} = \\frac{\\Delta v}{\\Delta t}$
// - **Instantaneous Acceleration**: $a = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}$

// ## Kinematic Equations
// For constant acceleration:
// 1. $v = u + at$
// 2. $s = ut + \\frac{1}{2}at^2$
// 3. $v^2 = u^2 + 2as$
// 4. $s = \\frac{(u + v)t}{2}$

// Where: $u$ = initial velocity, $v$ = final velocity, $a$ = acceleration, $t$ = time, $s$ = displacement

// ## Applications
// - Vehicle motion analysis
// - Projectile motion (vertical component)
// - Free fall under gravity
// - Elevator motion analysis

// ## Graphical Analysis
// - Position-time graphs show displacement
// - Velocity-time graphs show acceleration (slope)
// - Area under $v$-$t$ graph gives displacement`
//       },
//       'Chemistry': {
//         'Chemical Bonding': `# Chemical Bonding

// ## Introduction
// Chemical bonding is the force of attraction that holds atoms together in molecules and compounds. Understanding bonding helps explain the properties and behavior of substances.

// ## Types of Chemical Bonds

// ### 1. Ionic Bonding
// - Formed between metals and non-metals
// - Complete transfer of electrons
// - Results in charged ions (cations and anions)
// - Examples: $\\text{NaCl}$, $\\text{MgO}$, $\\text{CaF}_2$

// ### 2. Covalent Bonding
// - Formed between non-metals
// - Sharing of electron pairs
// - Can be single, double, or triple bonds
// - Examples: $\\text{H}_2\\text{O}$, $\\text{CO}_2$, $\\text{N}_2$

// ### 3. Metallic Bonding
// - Found in metals
// - Delocalized electrons in "electron sea"
// - Explains conductivity and malleability
// - Examples: $\\text{Fe}$, $\\text{Cu}$, $\\text{Al}$

// ## Key Theories

// ### 1. Lewis Theory
// - Atoms bond to achieve stable electron configuration
// - Octet rule: atoms tend to have $8$ electrons in outer shell
// - Lewis structures show bonding and lone pairs

// ### 2. VSEPR Theory
// - Valence Shell Electron Pair Repulsion
// - Predicts molecular geometry
// - Electron pairs repel and arrange to minimize repulsion

// ## Bond Properties
// - **Bond Length**: Distance between bonded atoms
// - **Bond Energy**: Energy required to break a bond
// - **Bond Polarity**: Unequal sharing of electrons

// ## Applications
// - Drug design and molecular recognition
// - Material science and polymer development
// - Understanding biological processes
// - Predicting chemical reactivity`
//       }
//     };

//     // Get theory for the specific subject and topic
//     const subjectTheories = theories[subject];
//     if (subjectTheories && subjectTheories[topic]) {
//       return subjectTheories[topic];
//     }

//     // Fallback generic theory
//     return `# ${topic} in ${subject}

// ## Introduction
// ${topic} is an important concept in ${subject} that forms the foundation for understanding more advanced topics in this field.

// ## Key Concepts
// This topic covers fundamental principles and concepts that are essential for exam preparation. The theoretical framework provides the necessary background for solving practical problems and understanding real-world applications.

// ## Mathematical Framework
// ${subject === 'Mathematics' ? `
// Key mathematical relationships and formulas for ${topic}:

// $$f(x) = ax^2 + bx + c$$

// Where $a$, $b$, and $c$ are constants, and $x$ is the variable.
// ` : subject === 'Physics' ? `
// Important physical relationships for ${topic}:

// $$F = ma$$

// Where $F$ is force, $m$ is mass, and $a$ is acceleration.
// ` : subject === 'Chemistry' ? `
// Chemical relationships and equations for ${topic}:

// $$\\text{Reactants} \\rightarrow \\text{Products}$$

// Balanced chemical equations follow conservation laws.
// ` : ''}

// ## Important Points to Remember
// - Master the basic definitions and terminology
// - Understand the underlying principles and their applications
// - Practice solving related problems to reinforce concepts
// - Connect this topic with other related areas in ${subject}

// ## Study Approach
// 1. **Read and Understand**: Start with basic definitions and concepts
// 2. **Visualize**: Use diagrams and examples to better understand
// 3. **Practice**: Solve problems and numerical exercises
// 4. **Review**: Regularly revisit the concepts to strengthen memory
// 5. **Apply**: Connect theoretical knowledge to practical situations

// ## Exam Tips
// - Focus on understanding rather than memorization
// - Practice previous year questions related to this topic
// - Create summary notes for quick revision
// - Identify common question patterns and solution approaches

// *Note: This theory content would be enhanced with your uploaded study materials for more specific and detailed explanations.*`;
//   }

//   private static getTheoryPrompt(subject: string, topic: string, relevantContent: string[]): string {
//     const contentContext = relevantContent.join('\n\n---\n\n');
    
//     return `You are an expert academic content creator and exam preparation specialist with 20+ years of experience in ${subject} education. Your task is to create EXAM-FOCUSED, HIGH-QUALITY theory content for "${topic}" in ${subject} based EXCLUSIVELY on the uploaded study materials provided.

// UPLOADED STUDY MATERIALS (PRIMARY SOURCE):
// ${contentContext}

// CRITICAL CONTENT REQUIREMENTS:
// 1. **EXAM AUTHENTICITY**: Generate content that is 100% exam-relevant and factually accurate for ${subject} competitive exams
// 2. **QUALITY OVER QUANTITY**: Focus on high-impact concepts rather than filling space with irrelevant information
// 3. **SOURCE FIDELITY**: Extract and synthesize information EXCLUSIVELY from the uploaded study materials above
// 4. **NO FILLER CONTENT**: Avoid generic statements, unnecessary elaboration, or content not directly related to exam preparation
// 5. **FACTUAL ACCURACY**: Ensure all facts, formulas, definitions, and examples are precisely correct and exam-standard
// 6. **CONCISE PRECISION**: Every sentence should add value to exam preparation - remove any redundant or obvious statements
// 7. **AUTHENTIC DEPTH**: Provide deep, meaningful insights that demonstrate mastery-level understanding of the topic

// CONTENT AUTHENTICITY STANDARDS:
// - Use ONLY information that can be verified from the uploaded materials
// - If uploaded materials lack sufficient detail, state this explicitly rather than adding generic content
// - Prioritize exam-specific terminology, formulas, and concepts
// - Include only examples and applications that are directly relevant to competitive exam patterns
// - Ensure all mathematical expressions and scientific facts are examination-standard accurate

// EXAM PREPARATION FOCUS:
// - Emphasize concepts that frequently appear in ${subject} competitive exams
// - Highlight common exam question patterns related to "${topic}"
// - Include memory aids, mnemonics, or quick recall techniques where applicable
// - Focus on problem-solving approaches and application methods
// - Mention common mistakes or misconceptions that students should avoid

// MATHEMATICAL EXPRESSIONS:
// - Use LaTeX syntax for all mathematical expressions
// - Inline math: Use $expression$ for inline mathematical expressions (e.g., $x^2 + y^2 = r^2$)
// - Display math: Use $$expression$$ for centered mathematical expressions (e.g., $$\\int_a^b f(x)dx = F(b) - F(a)$$)
// - Use proper LaTeX commands: \\frac{}{}, \\sqrt{}, \\sum_{i=1}^{n}, \\int, \\alpha, \\beta, etc.
// - For complex formulas, always use display math ($$...$$)

// MATHEMATICAL FORMATTING RULES:
// - NEVER use \\[...\\] or \\(...\\) delimiters - ONLY use $ and $$
// - Mathematical expressions must be written directly in the text, not inside code blocks
// - Example CORRECT: The quadratic formula is $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
// - Example WRONG: \`\`\`\\text{Net Change} = x + y + \\left( \\frac{xy}{100} \\right)\`\`\`
// - Example WRONG: \\[\\text{Original} = \\frac{P}{1 + \\left( \\frac{x}{100} \\right)}\\]
// - All mathematical content must use $ for inline math and $$ for display math ONLY
// - Do not mix LaTeX delimiters - stick to $ and $$ consistently throughout

// REQUIRED STRUCTURE (EXAM-FOCUSED):
// # ${topic} in ${subject}

// ## Introduction
// [Concise, exam-relevant introduction based ONLY on uploaded materials]

// ## Key Concepts
// [Essential definitions and concepts from uploaded materials that are exam-critical]

// ## Important Formulas and Principles
// [ONLY formulas and principles mentioned in uploaded materials, formatted with LaTeX]

// ## Exam Applications
// [Examples and applications from uploaded content that are relevant to competitive exams]

// ## Exam Preparation Focus
// [Highlight the most important points for exam success based on the content analysis]

// ## Study Tips
// [Provide specific study recommendations based on the complexity and nature of the content]

// FORMATTING GUIDELINES (CLEAN & SIMPLE):
// - Use # for main title, ## for major sections, ### for subsections
// - Use **bold** for key terms and important concepts
// - Use *italics* for emphasis
// - Use bullet points (-) for lists
// - Use numbered lists (1.) for sequential information
// - Use LaTeX math expressions ($...$) for inline math and ($$...$$) for display math
// - Use code blocks (\`\`\`) only for actual code, not mathematical expressions
// - Keep formatting clean and simple, similar to textbook style

// CRITICAL: Generate ONLY authentic, exam-relevant content based on uploaded materials. Avoid generic filler content. Every piece of information should be valuable for competitive exam preparation in ${subject}.`;
//   }
// }



















// import { Mistral } from '@mistralai/mistralai';
// import { supabase } from '../supabase';

// const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
// const useMockAI = !apiKey;
// const client = apiKey ? new Mistral({ apiKey }) : null;

// export class TheoryGenerator {
//   static async generateTheory(subject: string, topic: string, userId: string) {
//     if (useMockAI) {
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       return this.generateMockTheory(subject, topic);
//     }

//     try {
//       // Retrieve relevant uploaded materials using RAG
//       const relevantContent = await this.retrieveRelevantContent(subject, topic, userId);

//       if (!relevantContent || relevantContent.length === 0) {
//         // Fallback to general theory if no uploaded content is available
//         return await this.generateGeneralTheory(subject, topic);
//       }

//       // Generate theory based on retrieved content
//       const prompt = this.getTheoryPrompt(subject, topic, relevantContent);

//       const response = await client!.chat.complete({
//         model: 'mistral-large-latest',
//         messages: [{ role: 'user', content: prompt }],
//         temperature: 0.25, // Lower temperature for more factual content
//         max_tokens: 6000,
//       });

//       return response.choices[0]?.message?.content || this.generateMockTheory(subject, topic);
//     } catch (error) {
//       console.error('Error generating theory:', error);
//       return this.generateMockTheory(subject, topic);
//     }
//   }

//   private static async retrieveRelevantContent(subject: string, topic: string, userId: string): Promise<string[]> {
//     try {
//       // Query uploaded materials for relevant content
//       const { data: materials, error } = await supabase
//         .from('uploaded_materials')
//         .select('extracted_content, filename, processed_topics')
//         .eq('user_id', userId)
//         .gte('exam_relevance_score', 4); // Slightly lower threshold for more content

//       if (error) {
//         console.error('Error retrieving uploaded materials:', error);
//         return [];
//       }

//       if (!materials || materials.length === 0) {
//         return [];
//       }

//       // First pass: Find materials that contain both subject and topic (highest relevance)
//       const highRelevanceMaterials = materials
//         .filter(material => {
//           const content = material.extracted_content?.toLowerCase() || '';
//           const topics = material.processed_topics || [];
//           const filename = material.filename?.toLowerCase() || '';

//           const subjectMatch = content.includes(subject.toLowerCase()) ||
//                                filename.includes(subject.toLowerCase()) ||
//                                topics.some(t => t.toLowerCase().includes(subject.toLowerCase()));

//           const topicMatch = content.includes(topic.toLowerCase()) ||
//                             filename.includes(topic.toLowerCase()) ||
//                             topics.some(t => t.toLowerCase().includes(topic.toLowerCase()));

//           return subjectMatch && topicMatch; // Both must match for high relevance
//         })
//         .map(material => {
//           const content = material.extracted_content || '';
//           const relevantSections = this.extractRelevantSections(content, subject, topic);
//           return relevantSections;
//         })
//         .filter(content => content.length > 100);

//       // If we have enough high-relevance materials, use them
//       if (highRelevanceMaterials.length >= 2) {
//         return highRelevanceMaterials.slice(0, 5);
//       }

//       // Second pass: Include materials that match either subject or topic
//       const mediumRelevanceMaterials = materials
//         .filter(material => {
//           const content = material.extracted_content?.toLowerCase() || '';
//           const topics = material.processed_topics || [];
//           const filename = material.filename?.toLowerCase() || '';

//           const subjectMatch = content.includes(subject.toLowerCase()) ||
//                                filename.includes(subject.toLowerCase()) ||
//                                topics.some(t => t.toLowerCase().includes(subject.toLowerCase()));

//           const topicMatch = content.includes(topic.toLowerCase()) ||
//                             filename.includes(topic.toLowerCase()) ||
//                             topics.some(t => t.toLowerCase().includes(topic.toLowerCase()));

//           return subjectMatch || topicMatch; // Either can match for medium relevance
//         })
//         .map(material => {
//           const content = material.extracted_content || '';
//           const relevantSections = this.extractRelevantSections(content, subject, topic);
//           return relevantSections;
//         })
//         .filter(content => content.length > 100);

//       // Combine high and medium relevance materials, prioritizing high relevance
//       const allRelevantMaterials = [...highRelevanceMaterials, ...mediumRelevanceMaterials];

//       // Remove duplicates and limit to top 5
//       const uniqueMaterials = Array.from(new Set(allRelevantMaterials));
//       return uniqueMaterials.slice(0, 5);

//     } catch (error) {
//       console.error('Error in retrieveRelevantContent:', error);
//       return [];
//     }
//   }

//   private static extractRelevantSections(content: string, subject: string, topic: string): string {
//     // Split content into paragraphs and sentences for better extraction
//     const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 30);
//     const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);

//     // Hierarchical extraction: Topic-specific > Subject-specific > General

//     // 1. Find paragraphs that mention the specific topic
//     const topicSpecificParagraphs = paragraphs.filter(paragraph => {
//       const lowerParagraph = paragraph.toLowerCase();
//       const topicMatch = lowerParagraph.includes(topic.toLowerCase());
//       return topicMatch;
//     });

//     // 2. Find paragraphs that mention the subject (but not already included)
//     const subjectSpecificParagraphs = paragraphs.filter(paragraph => {
//       const lowerParagraph = paragraph.toLowerCase();
//       const subjectMatch = lowerParagraph.includes(subject.toLowerCase());
//       const alreadyIncluded = topicSpecificParagraphs.some(tp => tp === paragraph);
//       return subjectMatch && !alreadyIncluded;
//     });

//     // 3. Get general context paragraphs from the beginning
//     const generalParagraphs = paragraphs.slice(0, 3).filter(paragraph => {
//       const alreadyIncluded = topicSpecificParagraphs.some(tp => tp === paragraph) ||
//                              subjectSpecificParagraphs.some(sp => sp === paragraph);
//       return !alreadyIncluded;
//     });

//     // Combine in order of relevance
//     let relevantContent = '';
//     let totalLength = 0;
//     // Increased from 2000 to 4000 for more context
//     const enhancedMaxLength = 4000;

//     // Add topic-specific content first
//     for (const paragraph of topicSpecificParagraphs) {
//       if (totalLength + paragraph.length > enhancedMaxLength) break;
//       relevantContent += paragraph + '\n\n';
//       totalLength += paragraph.length;
//     }

//     // Add subject-specific content if space allows
//     for (const paragraph of subjectSpecificParagraphs) {
//       if (totalLength + paragraph.length > enhancedMaxLength) break;
//       relevantContent += paragraph + '\n\n';
//       totalLength += paragraph.length;
//     }

//     // Add general content if still space and not enough specific content
//     if (totalLength < 500) { // If we don't have much specific content
//       for (const paragraph of generalParagraphs) {
//         if (totalLength + paragraph.length > enhancedMaxLength) break;
//         relevantContent += paragraph + '\n\n';
//         totalLength += paragraph.length;
//       }
//     }

//     // If we have good relevant content, return it
//     if (relevantContent.trim().length > 100) {
//       return relevantContent.trim();
//     }

//     // Fallback: look for relevant sentences if paragraphs didn't work well
//     const relevantSentences = sentences.filter(sentence => {
//       const lowerSentence = sentence.toLowerCase();
//       const topicMatch = lowerSentence.includes(topic.toLowerCase());
//       const subjectMatch = lowerSentence.includes(subject.toLowerCase());

//       return topicMatch || subjectMatch;
//     });

//     if (relevantSentences.length > 0) {
//       let sentenceContent = '';
//       let sentenceLength = 0;

//       for (const sentence of relevantSentences.slice(0, 10)) { // Max 10 sentences
//         if (sentenceLength + sentence.length > enhancedMaxLength) break;
//         sentenceContent += sentence.trim() + '. ';
//         sentenceLength += sentence.length;
//       }

//       if (sentenceContent.length > 100) {
//         return sentenceContent.trim();
//       }
//     }

//     // Final fallback: return first few paragraphs as general context
//     return paragraphs.slice(0, 3).join('\n\n');
//   }

//   private static async generateGeneralTheory(subject: string, topic: string): Promise<string> {
//     if (useMockAI) {
//       return this.generateMockTheory(subject, topic);
//     }

//     try {
//       const prompt = `Generate a comprehensive theory explanation for the topic "${topic}" in ${subject}.

//       Please provide:
//       1. Clear definition and introduction
//       2. Key concepts and principles
//       3. Important formulas or relationships (if applicable)
//       4. Real-world applications or examples
//       5. Common misconceptions to avoid

//       Make it suitable for exam preparation and easy to understand.`;

//       const response = await client!.chat.complete({
//         model: 'mistral-large-latest',
//         messages: [{ role: 'user', content: prompt }],
//         temperature: 0.3,
//         max_tokens: 2500,
//       });

//       return response.choices[0]?.message?.content || this.generateMockTheory(subject, topic);
//     } catch (error) {
//       console.error('Error generating general theory:', error);
//       return this.generateMockTheory(subject, topic);
//     }
//   }

//   private static generateMockTheory(subject: string, topic: string): string {
//     const theories: Record<string, Record<string, string>> = {
//       'Mathematics': {
//         'Quadratic Equations': `# Quadratic Equations

// ## Introduction
// A quadratic equation is a polynomial equation of degree 2, typically written in the standard form:
// $$ax^2 + bx + c = 0$$ where $a \\neq 0$

// ## Key Concepts

// ### 1. Standard Form
// - $a$ is the coefficient of $x^2$ (quadratic term)
// - $b$ is the coefficient of $x$ (linear term)
// - $c$ is the constant term

// ### 2. Methods of Solving
// 1. **Factoring Method**: Express as $(px + q)(rx + s) = 0$
// 2. **Quadratic Formula**: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
// 3. **Completing the Square**: Convert to $(x + h)^2 = k$ form

// ### 3. Discriminant (Δ)
// $$\\Delta = b^2 - 4ac$$
// - If $\\Delta > 0$: Two distinct real roots
// - If $\\Delta = 0$: One repeated real root
// - If $\\Delta < 0$: Two complex roots

// ## Applications
// - Projectile motion in physics
// - Profit maximization in economics
// - Area and optimization problems
// - Engineering design calculations

// ## Common Mistakes to Avoid
// - Forgetting that $a \\neq 0$ in quadratic equations
// - Sign errors when applying the quadratic formula
// - Not checking solutions in the original equation`,

//         'Coordinate Geometry': `# Coordinate Geometry

// ## Introduction
// Coordinate geometry combines algebra and geometry using a coordinate system to represent geometric figures and solve problems analytically.

// ## Key Concepts

// ### 1. Distance Formula
// Distance between points $(x_1, y_1)$ and $(x_2, y_2)$:
// $$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

// ### 2. Section Formula
// Point dividing line segment in ratio $m:n$:
// $$x = \\frac{mx_2 + nx_1}{m + n}, \\quad y = \\frac{my_2 + ny_1}{m + n}$$

// ### 3. Slope of a Line
// $$m = \\frac{y_2 - y_1}{x_2 - x_1}$$

// ### 4. Equation of a Line
// - Point-slope form: $y - y_1 = m(x - x_1)$
// - Slope-intercept form: $y = mx + c$
// - Two-point form: $$\\frac{y - y_1}{y_2 - y_1} = \\frac{x - x_1}{x_2 - x_1}$$

// ## Applications
// - GPS navigation systems
// - Computer graphics and animation
// - Architecture and engineering design
// - Data visualization and plotting

// ## Important Properties
// - Parallel lines have equal slopes
// - Perpendicular lines have slopes that multiply to $-1$
// - Collinear points have the same slope between any two pairs`
//       },
//       'Physics': {
//         'Motion in a Straight Line': `# Motion in a Straight Line

// ## Introduction
// Motion in a straight line, also called rectilinear motion, is the simplest form of motion where an object moves along a straight path.

// ## Key Concepts

// ### 1. Position and Displacement
// - **Position**: Location of an object at a given time
// - **Displacement**: Change in position (vector quantity)
// - **Distance**: Total path length traveled (scalar quantity)

// ### 2. Velocity and Speed
// - **Average Velocity**: $v_{avg} = \\frac{\\Delta x}{\\Delta t}$
// - **Instantaneous Velocity**: $v = \\frac{dx}{dt}$
// - **Speed**: Magnitude of velocity (always positive)

// ### 3. Acceleration
// - **Average Acceleration**: $a_{avg} = \\frac{\\Delta v}{\\Delta t}$
// - **Instantaneous Acceleration**: $a = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}$

// ## Kinematic Equations
// For constant acceleration:
// 1. $v = u + at$
// 2. $s = ut + \\frac{1}{2}at^2$
// 3. $v^2 = u^2 + 2as$
// 4. $s = \\frac{(u + v)t}{2}$

// Where: $u$ = initial velocity, $v$ = final velocity, $a$ = acceleration, $t$ = time, $s$ = displacement

// ## Applications
// - Vehicle motion analysis
// - Projectile motion (vertical component)
// - Free fall under gravity
// - Elevator motion analysis

// ## Graphical Analysis
// - Position-time graphs show displacement
// - Velocity-time graphs show acceleration (slope)
// - Area under $v$-$t$ graph gives displacement`
//       },
//       'Chemistry': {
//         'Chemical Bonding': `# Chemical Bonding

// ## Introduction
// Chemical bonding is the force of attraction that holds atoms together in molecules and compounds. Understanding bonding helps explain the properties and behavior of substances.

// ## Types of Chemical Bonds

// ### 1. Ionic Bonding
// - Formed between metals and non-metals
// - Complete transfer of electrons
// - Results in charged ions (cations and anions)
// - Examples: $\\text{NaCl}$, $\\text{MgO}$, $\\text{CaF}_2$

// ### 2. Covalent Bonding
// - Formed between non-metals
// - Sharing of electron pairs
// - Can be single, double, or triple bonds
// - Examples: $\\text{H}_2\\text{O}$, $\\text{CO}_2$, $\\text{N}_2$

// ### 3. Metallic Bonding
// - Found in metals
// - Delocalized electrons in "electron sea"
// - Explains conductivity and malleability
// - Examples: $\\text{Fe}$, $\\text{Cu}$, $\\text{Al}$

// ## Key Theories

// ### 1. Lewis Theory
// - Atoms bond to achieve stable electron configuration
// - Octet rule: atoms tend to have $8$ electrons in outer shell
// - Lewis structures show bonding and lone pairs

// ### 2. VSEPR Theory
// - Valence Shell Electron Pair Repulsion
// - Predicts molecular geometry
// - Electron pairs repel and arrange to minimize repulsion

// ## Bond Properties
// - **Bond Length**: Distance between bonded atoms
// - **Bond Energy**: Energy required to break a bond
// - **Bond Polarity**: Unequal sharing of electrons

// ## Applications
// - Drug design and molecular recognition
// - Material science and polymer development
// - Understanding biological processes
// - Predicting chemical reactivity`
//       }
//     };

//     // Get theory for the specific subject and topic
//     const subjectTheories = theories[subject];
//     if (subjectTheories && subjectTheories[topic]) {
//       return subjectTheories[topic];
//     }

//     // Fallback generic theory
//     return `# ${topic} in ${subject}

// ## Introduction
// ${topic} is an important concept in ${subject} that forms the foundation for understanding more advanced topics in this field.

// ## Key Concepts
// This topic covers fundamental principles and concepts that are essential for exam preparation. The theoretical framework provides the necessary background for solving practical problems and understanding real-world applications.

// ## Mathematical Framework
// ${subject === 'Mathematics' ? `
// Key mathematical relationships and formulas for ${topic}:

// $$f(x) = ax^2 + bx + c$$

// Where $a$, $b$, and $c$ are constants, and $x$ is the variable.
// ` : subject === 'Physics' ? `
// Important physical relationships for ${topic}:

// $$F = ma$$

// Where $F$ is force, $m$ is mass, and $a$ is acceleration.
// ` : subject === 'Chemistry' ? `
// Chemical relationships and equations for ${topic}:

// $$\\text{Reactants} \\rightarrow \\text{Products}$$

// Balanced chemical equations follow conservation laws.
// ` : ''}

// ## Important Points to Remember
// - Master the basic definitions and terminology
// - Understand the underlying principles and their applications
// - Practice solving related problems to reinforce concepts
// - Connect this topic with other related areas in ${subject}

// ## Study Approach
// 1. **Read and Understand**: Start with basic definitions and concepts
// 2. **Visualize**: Use diagrams and examples to better understand
// 3. **Practice**: Solve problems and numerical exercises
// 4. **Review**: Regularly revisit the concepts to strengthen memory
// 5. **Apply**: Connect theoretical knowledge to practical situations

// ## Exam Tips
// - Focus on understanding rather than memorization
// - Practice previous year questions related to this topic
// - Create summary notes for quick revision
// - Identify common question patterns and solution approaches

// *Note: This theory content would be enhanced with your uploaded study materials for more specific and detailed explanations.*`;
//   }

//   private static getTheoryPrompt(subject: string, topic: string, relevantContent: string[]): string {
//     const contentContext = relevantContent.join('\n\n---\n\n');

//     return `You are an expert academic content creator and exam preparation specialist with 20+ years of experience in ${subject} education. Your task is to create EXAM-FOCUSED, HIGH-QUALITY DETAILED theory content for "${topic}" in ${subject} based EXCLUSIVELY on the uploaded study materials provided.

// UPLOADED STUDY MATERIALS (PRIMARY SOURCE):
// ${contentContext}

// CRITICAL CONTENT REQUIREMENTS:
// 1. **EXAM AUTHENTICITY**: Generate content that is 100% exam-relevant and factually accurate for ${subject} competitive exams
// 2. **QUALITY OVER QUANTITY**: Focus on high-impact concepts rather than filling space with irrelevant information
// 3. **SOURCE FIDELITY**: Extract and synthesize information EXCLUSIVELY from the uploaded study materials above. **DO NOT ADD ANY EXTERNAL INFORMATION.**
// 4. **NO FILLER CONTENT**: Avoid generic statements, unnecessary elaboration, or content not directly related to exam preparation
// 5. **FACTUAL ACCURACY**: Ensure all facts, formulas, definitions, and examples are precisely correct and exam-standard
// 6. **CONCISE PRECISION & NO DUPLICATION**: Every sentence should add value to exam preparation - remove any redundant or obvious statements. **MANDATORY: Avoid any repetition of formulas, definitions, or examples. Present each formula, equation, or example ONLY ONCE.** Do not output the same mathematical expression or calculation twice in a row or anywhere else in the document unless it's explicitly for a comparative analysis (e.g., 'Formula A vs. Formula B').
// 7. **AUTHENTIC DEPTH**: Provide deep, meaningful insights that demonstrate mastery-level understanding of the topic
// 8. **COMPREHENSIVENESS**: Synthesize *all* critical information from the provided context. Ensure no essential detail from the provided context is omitted. Provide a comprehensive overview based *solely* on the given text.

// CONTENT AUTHENTICITY STANDARDS:
// - Use ONLY information that can be verified from the uploaded materials
// - If uploaded materials lack sufficient detail, state this explicitly rather than adding generic content
// - Prioritize exam-specific terminology, formulas, and concepts
// - Include only examples and applications that are directly relevant to competitive exam patterns
// - Ensure all mathematical expressions and scientific facts are examination-standard accurate

// EXAM PREPARATION FOCUS:
// - Emphasize concepts that frequently appear in ${subject} competitive exams
// - Highlight common exam question patterns related to "${topic}"
// - Include memory aids, mnemonics, or quick recall techniques where applicable
// - Focus on problem-solving approaches and application methods
// - Mention common mistakes or misconceptions that students should avoid
// - **Integrate Problem-Solving Strategies**: Weave in practical problem-solving strategies relevant to competitive exams.
// - **Identify and Explain High-Yield Concepts**: Clearly identify and explain concepts that are frequently tested and have high weightage in exams.
// - **Connect Topics**: Suggest how this topic connects to other high-yield areas in the subject, fostering a holistic understanding.
// - **Topper's Strategy Integration**: Incorporate elements of proven study strategies (e.g., active recall, spaced repetition, weakness-first approach) into the study tips or content where naturally applicable.

// MATHEMATICAL EXPRESSIONS:
// - Use LaTeX syntax for all mathematical expressions
// - **CRITICAL: ONLY USE $ for inline math and $$ for display math.**
// - **DO NOT USE \[...\], \(...\), \begin{equation} or any other LaTeX environments for math.**
// - **Ensure all LaTeX syntax is perfectly valid and error-free for KaTeX rendering.** Double-check all braces, commands, and environments.
//  - For any non-mathematical text or symbols (e.g., currency symbols like ₹, $, €, units like kg, m/s, or words), ensure they are wrapped within \text{} command inside math environments. For example, \text{₹}1200 instead of ₹1200.

// - Inline math: Use $expression$ for inline mathematical expressions (e.g., $x^2 + y^2 = r^2$)
// - Display math: Use $$expression$$ for centered mathematical expressions (e.g., $$\\int_a^b f(x)dx = F(b) - F(a)$$)

// - Use proper LaTeX commands: \\frac{}{}, \\sqrt{}, \\sum_{i=1}^{n}, \\int, \\alpha, \\beta, etc.
// - For complex formulas, always use display math ($$...$$)

// MATHEMATICAL FORMATTING RULES:
// - NEVER use \\[...\\] or \\(...\\) delimiters - ONLY use $ and $$
// - Mathematical expressions must be written directly in the text, not inside code blocks
// - Example CORRECT: The quadratic formula is $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
// - Example WRONG: \`\`\`\\text{Net Change} = x + y + \\left( \\frac{xy}{100} \\right)\`\`\`
// - Example WRONG: \\[\\text{Original} = \\frac{P}{1 + \\left( \\frac{x}{100} \\right)}\\]
// - All mathematical content must use $ for inline math and $$ for display math ONLY
// - Do not mix LaTeX delimiters - stick to $ and $$ consistently throughout

// REQUIRED STRUCTURE (EXAM-FOCUSED):
// # ${topic} in ${subject}

// ## Introduction
// [Concise, exam-relevant introduction based ONLY on uploaded materials]

// ## Key Concepts
// [Essential definitions and concepts from uploaded materials that are exam-critical]

// ## Important Formulas and Principles
// [ONLY formulas and principles mentioned in uploaded materials, formatted with LaTeX]

// ## Exam Applications
// [Examples and applications from uploaded content that are relevant to competitive exams]

// ## Exam Preparation Focus
// [Highlight the most important points for exam success based on the content analysis]

// ## Study Tips
// [Provide specific study recommendations based on the complexity and nature of the content]

// FORMATTING GUIDELINES (CLEAN & SIMPLE):
// - Use # for main title, ## for major sections, ### for subsections
// - Use **bold** for key terms and important concepts
// - Use *italics* for emphasis
// - Use bullet points (-) for lists
// - Use numbered lists (1.) for sequential information
// - Use LaTeX math expressions ($...$) for inline math and ($$...$$) for display math
// - Use code blocks (\`\`\`) only for actual code, not mathematical expressions
// - Keep formatting clean and simple, similar to textbook style

// CRITICAL: Generate ONLY authentic, exam-relevant content based on uploaded materials. Avoid generic filler content. Every piece of information should be valuable for competitive exam preparation in ${subject}.`;
//   }
// }


















// import { Mistral } from '@mistralai/mistralai';
// import { supabase } from '../supabase';

// /**
//  * Unified TheoryGenerator (refined)
//  * - RAG-first: Uses uploaded materials exclusively when available
//  * - Fallback mirrors the SAME rich style (descriptive, beginner→advanced) with standard sources
//  * - SSC → UPSC exam-sync with inline tags, study aids, misconceptions, interlinking
//  * - Strict LaTeX rules ($ ... $ and $$ ... $$ only)
//  * - Descriptive, paragraph-first output (no terse bullets)
//  */

// const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
// const useMockAI = !apiKey;
// const client = apiKey ? new Mistral({ apiKey }) : null;

// // Tunables
// const MODEL_NAME = 'mistral-large-latest';
// const TEMPERATURE = 0.25; // lower = more factual, consistent
// const MAX_TOKENS = 8500;  // bump slightly for longer chapters (adjust per plan)

// export class TheoryGenerator {
//   /** Public entrypoint */
//   static async generateTheory(subject: string, topic: string, userId: string) {
//     if (useMockAI) {
//       await new Promise((resolve) => setTimeout(resolve, 300));
//       return this.generateMockTheory(subject, topic);
//     }

//     try {
//       const relevantContent = await this.retrieveRelevantContent(subject, topic, userId);
//       const prompt = this.getUnifiedPrompt(subject, topic, relevantContent);

//       const response = await client!.chat.complete({
//         model: MODEL_NAME,
//         messages: [
//           {
//             role: 'system',
//             content:
//               'You are a senior competitive exam mentor and academic content creator. Follow instructions exactly. Never hallucinate. Use ONLY provided sources when present. Prefer descriptive paragraphs over bullets. Avoid one-liners.',
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
//     const chosen = Array.from(take).sort((a, b) => a - b).map((idx) => paras[idx]);

//     let out = '';
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
//   private static getUnifiedPrompt(subject: string, topic: string, relevantContent: string[]): string {
//     const hasSources = Array.isArray(relevantContent) && relevantContent.length > 0;
//     const contentContext = hasSources ? relevantContent.join('\n\n---\n\n') : '(no uploaded materials)';

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
// - Use LaTeX with $...$ for inline and $$...$$ for display.
// - Do NOT use \\\[...] or \\\( ... \\\) or equation environments.
// - Define every symbol and unit in plain words near first use.
// - Never repeat the same formula or definition.
// - Use clean Markdown: #, ##, ### for headings; **bold** for key terms; *italics* for emphasis.
// - When including currency or units inside math, wrap in \\text{ } (e.g., $\\text{₹}1200$ or $5 \\text{ m/s}$).
// `;

//     const SHARED_STRUCTURE = `
// REQUIRED STRUCTURE (Paragraph-first, SSC → UPSC Sync):
// # ${topic} in ${subject}

// ## Introduction
// Write a gentle, beginner-friendly opening that defines the topic in plain language, gives brief context or historical background where relevant, and explains why exams care about it (SSC/Banking/UPSC).

// ## Detailed Explanation (Progressive Flow)
// Explain all subtopics in a **continuous narrative** that starts simple and gradually adds depth. Use analogies, micro-examples, and short caselets. Make the transitions smooth so a reader never feels a jump in difficulty.

// ## Key Ideas & Exam Concepts
// Summarize all essential definitions and principles **within paragraphs**. Insert relevance tags inline like [SSC/CHSL], [Banking/IBPS/RRB], [CDS/NDA/State PCS], [UPSC] where they naturally fit.

// ## Formulas and Principles
// For each formula: present once with $$...$$, then explain symbols and meaning in words, and add a short, clear worked example or usage scenario. Keep math neat.

// ## Applications & Case Studies
// Describe practical uses and exam-style applications in narrative form. Where suitable, include brief case studies or realistic scenarios and indicate which exams emphasize them.

// ## Misconceptions & Clarifications
// Explain common mistakes learners make and the correct reasoning, using short paragraphs instead of one-liners.

// ## Interlinking with Other Topics
// Describe high-yield connections to other chapters/subjects and why these edges are frequently tested. Mention exam focus where applicable.

// ## Exam Preparation Strategy
// Give actionable guidance for tackling typical questions (definition, analysis, numerical/diagram-based if applicable), recall strategies, and quick checks for self-evaluation. Provide mnemonics and memory hooks in context.

// ## Study Tips & Revision Plan
// Offer a short plan for moving from beginner → exam-ready: what to read, how to practice PYQs, spaced repetition cues, and how to integrate with mock tests.

// ## Revision Quick Table  
// Provide a concise tabular summary with these columns:  
// - **Concept / Term**  
// - **Explanation (1–2 lines, no bullets)**  
// - **Formula / Example** (if applicable)  
// - **Exam Relevance** ([SSC], [UPSC], [Banking], [State PCS], etc.)

// `;

//     if (hasSources) {
//       return `You are an expert academic content creator and competitive exam mentor with 20+ years of experience in ${subject}.
// Create **AUTHENTIC, HIGH-QUALITY, BEGINNER-FRIENDLY yet EXAM-READY notes** for the topic "${topic}" in ${subject},
// **USING ONLY** the uploaded materials below. **Do not add external facts.** If any subtopic is missing, explicitly write: "The uploaded materials do not cover this subtopic." Expand explanations descriptively so a first-time learner understands everything.

// UPLOADED STUDY MATERIALS (PRIMARY SOURCE):
// ${contentContext}

// CRITICAL CONTENT REQUIREMENTS:
// 1) SOURCE FIDELITY: Extract and synthesize **only** what is verifiable from the uploaded materials. No hallucinations.
// 2) SAME STYLE AS FALLBACK: Write in **long, descriptive paragraphs** (not terse bullets). Build from basic ideas to advanced insights smoothly.
// 3) SSC → UPSC SYNC: Insert relevant coverage tags inline: [SSC CGL/CHSL], [Banking/IBPS/RRB], [CDS/NDA/State PCS], [UPSC].
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

// EXAM PREPARATION FOCUS:
// - Emphasize concepts that frequently appear in ${subject} competitive exams
// - Highlight common exam question patterns related to "${topic}"
// - Include memory aids, mnemonics, or quick recall techniques where applicable
// - Focus on problem-solving approaches and application methods
// - Mention common mistakes or misconceptions that students should avoid
// - **Integrate Problem-Solving Strategies**: Weave in practical problem-solving strategies relevant to competitive exams.
// - **Identify and Explain High-Yield Concepts**: Clearly identify and explain concepts that are frequently tested and have high weightage in exams.
// - **Connect Topics**: Suggest how this topic connects to other high-yield areas in the subject, fostering a holistic understanding.
// - **Topper's Strategy Integration**: Incorporate elements of proven study strategies (e.g., active recall, spaced repetition, weakness-first approach) into the study tips or content where naturally applicable.

// CONTENT RULES:
// - Write like a **chapter explanation**, not revision bullets.
// - Cover the **entire high-yield syllabus scope** for this topic (SSC → UPSC). If an item is *UPSC-only depth*, mark *(Advanced – UPSC only)*.
// - Start simple, then deepen naturally; explain every term on first use.
// - For formulas: present once in LaTeX, define symbols, and give one short worked example.
// - Include **mnemonics, misconceptions with clarifications, interlinking, and exam strategy**.
// - Insert exam tags naturally inline: [SSC CGL/CHSL], [Banking/IBPS/RRB], [CDS/NDA/State PCS], [UPSC].

// ${DESCRIPTIVE_STYLE_GUIDE}
// ${CORE_RULES}
// ${SHARED_STRUCTURE}

// Only output the final, polished notes.`;
//   }

//   /** Legacy mock content for offline/dev */
//   private static generateMockTheory(subject: string, topic: string): string {
//     const header = `# ${topic} in ${subject}\n\n`;
//     const intro = `## Introduction\n${topic} is a foundational chapter in ${subject}. These notes provide beginner→advanced explanations with SSC→UPSC coverage.\n\n`;
//     const body = `## Detailed Explanation (Progressive Flow)\nThis is placeholder content used only in local mock mode. In production, notes are generated from uploaded materials or the fallback syllabus.\n\n## Key Ideas & Exam Concepts\nExplain key ideas in paragraphs with inline tags like [SSC] or [UPSC].\n\n## Formulas and Principles\nFor example: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$ where $a$, $b$, and $c$ are coefficients in a quadratic equation.\n\n## Applications & Case Studies\nTie concepts to realistic examples and exam questions.\n\n## Misconceptions & Clarifications\nAddress common errors and provide correct reasoning.\n\n## Interlinking with Other Topics\nDescribe how this topic links to adjacent chapters.\n\n## Exam Preparation Strategy\nActionable tips for typical question types and quick checks.\n\n## Study Tips & Revision Plan\nSpaced repetition, active recall, and PYQ strategy.\n`;
//     return header + intro + body;
//   }
// }



























import { Mistral } from '@mistralai/mistralai';
import { supabase } from '../supabase';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
const useMockAI = !apiKey;
const client = apiKey ? new Mistral({ apiKey }) : null;

// Config
const MODEL_NAME = 'mistral-large-latest';
const TEMPERATURE = 0.25;
const MAX_TOKENS = 8500;

type GeneratedTheory = {
  notes: string;
  mermaid?: string;
  examTag: string;
  raw?: string;
};

export class TheoryGenerator {
  /** Public entrypoint used in Course section */
  static async generateTheory(
    subject: string,
    topic: string,
    userId: string,
    examLevel: string
  ): Promise<string> {
    if (useMockAI) {
      const mock = this.generateMockReturn(subject, topic, examLevel);
      return JSON.stringify(mock);
    }

    try {
      const relevant = await this.retrieveRelevantContent(subject, topic, userId);
      const prompt = this.buildPrompt(subject, topic, relevant, examLevel);

      const response = await client!.chat.complete({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content:
              'You are a senior academic content creator for competitive and university exams. Follow instructions exactly. Use only provided sources if available.'
          },
          { role: 'user', content: prompt },
        ],
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
      });

      const out = response.choices?.[0]?.message?.content?.trim() ?? '';
      if (!out) {
        return JSON.stringify(this.generateMockReturn(subject, topic, examLevel));
      }

      const parsed = this.parseToStructured(out, topic, examLevel);
      parsed.mermaid = parsed.mermaid ?? this.generateMermaidFromHeadings(parsed.notes, topic);
      parsed.examTag = parsed.examTag || this.getExamTag(examLevel);
      parsed.notes = this.ensureExamTagInNotes(parsed.notes, parsed.examTag);
      parsed.raw = out;

      return JSON.stringify(parsed);
    } catch (err) {
      console.error('TheoryGenerator error:', err);
      return JSON.stringify(this.generateMockReturn(subject, topic, examLevel));
    }
  }

  /** Build prompt with exam-level customization */
  private static buildPrompt(subject: string, topic: string, relevant: string[], examLevel: string): string {
    const { instruction, tag } = this.getExamConfig(examLevel);
    const hasSources = relevant.length > 0;

    const srcHeader = hasSources
      ? `You are given EXCERPTS from the learner's own study materials. Stay faithful to them.`
      : `No user materials found. Use accurate standard references.`;

    const contentContext = hasSources
      ? relevant.map((s, i) => `SOURCE ${i + 1}:\n${s}`).join('\n\n----\n\n')
      : '(no uploaded materials)';

    return `
${srcHeader}

TASK:
Write descriptive, exam-focused theory notes for:
- Subject: ${subject}
- Topic: ${topic}
- Exam profile: ${examLevel}

STYLE & DEPTH:
${instruction}

REQUIREMENTS:
1) Prefer connected paragraphs over plain bullets.
2) Use LaTeX ($...$ inline, $$...$$ display) for math.
3) Add a "Quick Recap" at the end with 5–7 bullets.
4) Include ONE mermaid diagram if useful (flowchart LR style).
5) Do not hallucinate beyond provided sources when they exist.
6) Output MUST be valid JSON with this shape:

{
  "notes": "<markdown, may include LaTeX and tables>",
  "mermaid": "flowchart LR; ...",  // OPTIONAL
  "examTag": "${tag}"
}

CONTEXT:
${contentContext}
`.trim();
  }

  /** Exam-specific config */
  private static getExamConfig(examLevel: string): { instruction: string; tag: string } {
    let instruction = '';
    let tag = examLevel || 'General Knowledge';

    switch (examLevel) {
      case 'Board Exams (Class 12)':
        instruction = 'NCERT-aligned clarity, stepwise derivations, board-style emphasis, precise definitions and diagrams.';
        break;
      case 'University Exams (B.Tech)':
      case 'University Exams (B.Arch)':
      case 'University Exams (BAMS)':
      case 'University Exams (MBBS)':
      case 'University Exams (BHMS)':
      case 'University Exams (B.Sc Agriculture)':
      case 'University Exams (B.Sc Veterinary)':
        instruction = 'University depth with rigorous definitions, short and long answer preparation, applications and derivations.';
        break;
      case 'UPSC Civil Services':
        instruction = 'Analytical, interdisciplinary, mains-ready explanations plus prelims fact precision. Add answer-writing angles.';
        break;
      case 'JEE Main/Advanced':
        instruction = 'Problem-solving focus; derivations, formulas, traps, shortcuts, example setups.';
        break;
      case 'NEET UG':
        instruction = 'Concept-first biology/chemistry; must-know facts; clinical correlation; diagram-friendly.';
        break;
      case 'SSC CGL':
        instruction = 'High-yield facts, shortcuts, MCQ patterns, crisp explanations.';
        break;
      case 'Banking (SBI PO/Clerk)':
        instruction = 'Quant/Reasoning/GA orientation; formula snippets; tricks; accuracy-driven notes.';
        break;
      case 'CAT':
        instruction = 'Logical flow, quantitative reasoning, problem framing strategies, succinct concepts.';
        break;
      case 'GATE':
        instruction = 'Graduate-level rigor; definitions, theorems, derivations, pitfalls in numericals.';
        break;
      default:
        instruction = 'General exam-ready clarity; descriptive but precise.';
        tag = 'General Knowledge';
        break;
    }
    return { instruction, tag };
  }

  private static getExamTag(examLevel: string): string {
    return this.getExamConfig(examLevel).tag;
  }

  private static ensureExamTagInNotes(notes: string, tag: string) {
    const badge = `> **Exam Profile:** ${tag}\n\n`;
    return notes.startsWith('> **Exam Profile:**') ? notes : badge + notes;
  }

  /** Parse JSON or fallback */
  private static parseToStructured(out: string, topic: string, examLevel: string): GeneratedTheory {
    try {
      const first = out.indexOf('{');
      const last = out.lastIndexOf('}');
      if (first !== -1 && last !== -1) {
        const json = out.slice(first, last + 1);
        const parsed = JSON.parse(json);
        return {
          notes: String(parsed.notes ?? ''),
          mermaid: parsed.mermaid ? String(parsed.mermaid) : undefined,
          examTag: String(parsed.examTag ?? this.getExamTag(examLevel)),
          raw: out,
        };
      }
    } catch { /* ignore */ }

    return {
      notes: out,
      examTag: this.getExamTag(examLevel),
      mermaid: this.generateMermaidFromHeadings(out, topic),
      raw: out,
    };
  }

  /** Fetch relevant user-uploaded content from Supabase */
  private static async retrieveRelevantContent(subject: string, topic: string, userId: string): Promise<string[]> {
    try {
      const { data: materials, error } = await supabase
        .from('uploaded_materials')
        .select('extracted_content, filename, processed_topics, exam_relevance_score')
        .eq('user_id', userId)
        .gte('exam_relevance_score', 4);

      if (error || !materials?.length) return [];

      const sKey = subject.toLowerCase();
      const tKey = topic.toLowerCase();

      const scored = materials.map((m: any) => {
        const content = String(m.extracted_content || '');
        const filename = String(m.filename || '').toLowerCase();
        const topics: string[] = Array.isArray(m.processed_topics) ? m.processed_topics : [];
        const text = content.toLowerCase();

        const subjectHit = Number(text.includes(sKey) || filename.includes(sKey) || topics.some(t => t?.toLowerCase?.().includes(sKey)));
        const topicHit   = Number(text.includes(tKey) || filename.includes(tKey) || topics.some(t => t?.toLowerCase?.().includes(tKey)));

        const score = topicHit * 2 + subjectHit + (m.exam_relevance_score || 0) * 0.25;
        return { content, score };
      }).sort((a, b) => b.score - a.score);

      const top = scored.slice(0, 10);
      const snippets: string[] = [];
      for (const t of top) {
        if (t.content && snippets.length < 5) snippets.push(this.normalize(t.content));
      }
      return snippets;
    } catch (e) {
      console.error('retrieveRelevantContent error:', e);
      return [];
    }
  }

  private static normalize(s: string) {
    return s.replace(/\s+/g, ' ').replace(/\u0000/g, '').trim();
  }

  /** Generate fallback mermaid */
  private static generateMermaidFromHeadings(notes: string, topic: string): string | undefined {
    const headings = (notes.match(/^#{1,3}\s+.+$/gm) || []).map(h => h.replace(/^#{1,3}\s+/, '').trim());
    const nodes = headings.length ? headings.slice(0, 6) : [topic, 'Concepts', 'Examples', 'Summary'];
    const ids = nodes.map((n, i) => `N${i}`);
    const lines = ['flowchart LR', ...ids.map((id, i) => `${id}[${nodes[i]}]`)];
    for (let i = 0; i < ids.length - 1; i++) lines.push(`${ids[i]} --> ${ids[i + 1]}`);
    return lines.join('\n');
  }

  /** Mock return */
  private static generateMockReturn(subject: string, topic: string, examLevel: string): GeneratedTheory {
    const tag = this.getExamTag(examLevel);
    const notes = `# ${topic}\n\n**Subject:** ${subject}\n\nThis is placeholder content tailored for *${tag}*.`;
    return {
      notes: this.ensureExamTagInNotes(notes, tag),
      mermaid: this.generateMermaidFromHeadings(notes, topic),
      examTag: tag,
      raw: notes,
    };
  }
}
