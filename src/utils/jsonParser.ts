// src/utils/jsonParser.ts

/**
 * Robust JSON extraction + parsing for messy AI responses.
 * Handles:
 *  - Mixed text + markdown + multiple code fences
 *  - ```json and ``` (no language) fences
 *  - Unquoted keys, single-quoted strings, comments, trailing commas
 *  - Dangling commas / partial/truncated blocks (brace/bracket balancing)
 *  - Blocks that are: { dailySchedule: [...] } OR an array of day objects OR a single day object
 *
 * Returns a single shape: { dailySchedule: [...] } | null
 *
 * Logging is verbose (prefixed) to help debugging in dev tools.
 */

// ------------------------------
// Small helpers
// ------------------------------

function log(...args: any[]) {
  console.log("🧩 [jsonParser]", ...args);
}
function warn(...args: any[]) {
  console.warn("🧩 [jsonParser]", ...args);
}
function err(...args: any[]) {
  console.error("🧩 [jsonParser]", ...args);
}

function normalizeSmartQuotes(s: string): string {
  return s
    .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')  // smart double quotes
    .replace(/[\u2018\u2019\u201B\u2032]/g, "'");      // smart single quotes
}

function stripBOM(s: string): string {
  return s.replace(/^\uFEFF/, "");
}

function stripInlineBackticks(s: string): string {
  // remove stray inline code ticks that can break JSON
  return s.replace(/`+/g, "");
}

function removeComments(s: string): string {
  // remove // line comments and /* block comments */
  return s.replace(/\/\/[^\n\r]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

function removeTrailingCommas(s: string): string {
  return s.replace(/,\s*([}\]])/g, "$1");
}

function quoteUnquotedKeys(s: string): string {
  // Quote keys after { or , that look like identifiers (allow - and _)
  // Avoid touching keys already quoted.
  return s.replace(/([{\[,]\s*)([A-Za-z_][A-Za-z0-9_\-]*)(\s*):/g, (_m, pre, key, suff) => {
    // if already quoted, skip
    if (/^".*"$/.test(key)) return `${pre}${key}${suff}:`;
    return `${pre}"${key}"${suff}:`;
  });
}

function convertSingleQuotedStrings(s: string): string {
  // Convert '...'(with escapes) to "..."
  // Handles nested escaped quotes inside single quotes.
  return s.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, (_m, inner: string) => {
    const unescaped = inner.replace(/\\"/g, '"'); // normalize any \" inside
    const replaced = unescaped.replace(/"/g, '\\"'); // re-escape " for JSON
    return `"${replaced}"`;
  });
}

function balanceBrackets(raw: string): string {
  let s = raw;

  // Balance braces
  const openBraces = (s.match(/{/g) || []).length;
  const closeBraces = (s.match(/}/g) || []).length;
  if (closeBraces < openBraces) {
    s += "}".repeat(openBraces - closeBraces);
  }

  // Balance brackets
  const openBrackets = (s.match(/\[/g) || []).length;
  const closeBrackets = (s.match(/]/g) || []).length;
  if (closeBrackets < openBrackets) {
    s += "]".repeat(openBrackets - closeBrackets);
  }

  // Remove obvious dangling key tail like ..., "key": OR trailing comma before EOF
  s = s.replace(/,\s*(?=$)/, "");
  s = s.replace(/:\s*$/, ""); // ends with colon -> drop the colon

  return s.trim();
}

function basicClean(block: string): string {
  return balanceBrackets(
    removeTrailingCommas(
      removeComments(
        stripInlineBackticks(stripBOM(normalizeSmartQuotes(block.trim())))
      )
    )
  );
}

/**
 * Extract fenced code blocks first.
 * Supports ```json ... ``` and ``` ... ```
 */
function extractFencedBlocks(text: string): { language: string; content: string }[] {
  const blocks: { language: string; content: string }[] = [];
  const fenceRegex = /```([\w+\-]*)\s*\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = fenceRegex.exec(text)) !== null) {
    const language = (m[1] || "").toLowerCase();
    const content = m[2] || "";
    blocks.push({ language, content });
  }
  return blocks;
}

/**
 * Remove fenced blocks from text so our inline scanner can search the rest cleanly.
 */
function removeFencedBlocks(text: string): string {
  return text.replace(/```[\w+\-]*\s*\n[\s\S]*?```/g, "");
}

/**
 * Bracket-aware scanner to find JSON-like substrings in plain text.
 * Skips inside quotes; returns balanced substrings for every top-level {...} or [...]
 */
function scanInlineJSONCandidates(text: string): string[] {
  const s = text;
  const out: string[] = [];

  const len = s.length;
  let i = 0;

  while (i < len) {
    const ch = s[i];

    if (ch === "{" || ch === "[") {
      const stack: string[] = [ch];
      let j = i + 1;
      let inStr: '"' | "'" | null = null;
      let esc = false;

      while (j < len && stack.length > 0) {
        const c = s[j];

        if (inStr) {
          if (esc) {
            esc = false;
          } else if (c === "\\") {
            esc = true;
          } else if (c === inStr) {
            inStr = null;
          }
        } else {
          if (c === '"' || c === "'") {
            inStr = c as '"' | "'";
          } else if (c === "{" || c === "[") {
            stack.push(c);
          } else if (c === "}" || c === "]") {
            const last = stack[stack.length - 1];
            if ((last === "{" && c === "}") || (last === "[" && c === "]")) {
              stack.pop();
            } else {
              // mismatched -> break and let the repair handle it
              stack.pop();
            }
          }
        }

        j++;
      }

      // Take substring i..j (possibly truncated if stack non-empty; repair will balance it)
      const candidate = s.slice(i, j);
      // Heuristic: ensure there's a colon or object-like content to look like JSON
      if (candidate.includes(":") || candidate.startsWith("[{") || candidate.startsWith("{[")) {
        out.push(candidate);
      }
      i = j;
    } else {
      i++;
    }
  }

  return out;
}

/**
 * Multi-pass repair & parse attempt for a single candidate.
 */
function tryParseCandidate(raw: string): any | null {
  // Pass 0: strip fences (if any accidentally included) and basic clean
  let attempt = raw.replace(/```(json)?/gi, "").trim();

  // Try direct first
  try {
    return JSON.parse(attempt);
  } catch {}

  // Pass 1: basic clean
  attempt = basicClean(attempt);
  try {
    return JSON.parse(attempt);
  } catch {}

  // Pass 2: quote unquoted keys + trailing commas removed again + clean
  attempt = quoteUnquotedKeys(attempt);
  attempt = removeTrailingCommas(attempt);
  attempt = basicClean(attempt);
  try {
    return JSON.parse(attempt);
  } catch {}

  // Pass 3: convert single-quoted strings
  attempt = convertSingleQuotedStrings(attempt);
  attempt = basicClean(attempt);
  try {
    return JSON.parse(attempt);
  } catch {}

  // Pass 4: last resort — balance again and strip possible dangling tails
  attempt = balanceBrackets(attempt);
  attempt = attempt.replace(/,\s*([}\]])/g, "$1").replace(/:\s*([}\]])/g, "$1");
  try {
    return JSON.parse(attempt);
  } catch (e) {
    warn("Failed parsing candidate after all repairs:", e, "\nCandidate was:\n", raw);
    return null;
  }
}

/**
 * Interpret parsed value into array of "day schedule" objects.
 * Accepts:
 *  - { dailySchedule: [...] }
 *  - [ { ...day }, { ...day } ]
 *  - { ...single day object }
 */
function collectScheduleEntries(parsed: any): any[] {
  const out: any[] = [];
  if (parsed == null) return out;

  // 1) { dailySchedule: [...] }
  if (parsed && typeof parsed === "object" && Array.isArray(parsed.dailySchedule)) {
    for (const item of parsed.dailySchedule) {
      if (item && typeof item === "object") out.push(item);
    }
    return out;
  }

  // 2) [ dayObj, ... ]
  if (Array.isArray(parsed)) {
    for (const item of parsed) {
      if (item && typeof item === "object") {
        // looks like a day if it has subjects or date
        if ("subjects" in item || "date" in item || "dayOfWeek" in item) {
          out.push(item);
        }
      }
    }
    return out;
  }

  // 3) Single day object
  if (parsed && typeof parsed === "object") {
    if ("subjects" in parsed || "date" in parsed || "dayOfWeek" in parsed) {
      out.push(parsed);
    }
  }

  return out;
}

/**
 * Main: safeParseJSON
 *  - Extract fenced code blocks first (prefer language=json)
 *  - Then scan the remaining text for inline JSON-like chunks
 *  - Parse each candidate with multi-pass repair
 *  - Merge into { dailySchedule: [...] }
 */
export function safeParseJSON(aiText: string): any | null {
  log("Raw AI response length:", aiText?.length ?? 0);

  if (!aiText || typeof aiText !== "string") {
    err("Input is not a string");
    return null;
  }

  // 1) Extract fenced blocks
  const fenced = extractFencedBlocks(aiText);
  const jsonFenced = fenced.filter(b => b.language === "json").map(b => b.content);
  const anyFenced = fenced
    .filter(b => b.language !== "json") // include unlabeled + other langs as fallback
    .map(b => b.content);

  // 2) Remove fenced blocks and scan rest for inline JSON
  const textWithoutFences = removeFencedBlocks(aiText);
  const inlineCandidates = scanInlineJSONCandidates(textWithoutFences);

  const candidates: string[] = [];
  candidates.push(...jsonFenced, ...anyFenced, ...inlineCandidates);

  if (candidates.length === 0) {
    warn("No JSON-like candidates found.");
    return null;
  }

  log(`Found ${candidates.length} candidate block(s).`);

  const schedules: any[] = [];

  for (const cand of candidates) {
    const parsed = tryParseCandidate(cand);
    if (!parsed) continue;

    const entries = collectScheduleEntries(parsed);
    if (entries.length) {
      schedules.push(...entries);
    }
  }

  if (schedules.length === 0) {
    err("No valid schedules parsed from candidates.");
    return null;
  }

  log(`✅ Successfully merged ${schedules.length} schedule entries`);
  return { dailySchedule: schedules };
}

// ------------------------------
// Retry wrapper (unchanged API)
// ------------------------------
export async function robustParseWithRetry(
  aiCall: () => Promise<string>
): Promise<any | null> {
  log("⚡ Calling AI service...");
  let aiResponse = await aiCall();
  let parsed = safeParseJSON(aiResponse);

  if (!parsed) {
    warn("First parse failed. Retrying AI call...");
    aiResponse = await aiCall();
    parsed = safeParseJSON(aiResponse);

    if (!parsed) {
      err("Retry also failed. Returning null.");
    }
  }
  return parsed;
}

// ------------------------------
// Extend schedule (minor hardening)
// ------------------------------
export function extendSchedule(parsed: any, studentProfile: any, totalDays: number): any {
  if (!parsed?.dailySchedule) return parsed;

  const currentSchedule = Array.isArray(parsed.dailySchedule) ? parsed.dailySchedule : [];
  
  // If no existing schedule, return empty to let ScheduleGenerator handle fallback
  if (currentSchedule.length === 0) {
    console.warn('extendSchedule: No existing schedule to extend, returning empty');
    return { dailySchedule: [] };
  }
  
  const today = new Date();

  const subjects: string[] = Array.isArray(studentProfile?.subjects) ? studentProfile.subjects : [];
  const weakSubjects: string[] = Array.isArray(studentProfile?.weakSubjects) ? studentProfile.weakSubjects : [];
  const dailyAvailableHours = Number(studentProfile?.dailyAvailableHours) || 9;
  const isBeginnerLevel = studentProfile?.currentLevel === 'beginner';
  const isIntermediateLevel = studentProfile?.currentLevel === 'intermediate';

  if (subjects.length === 0) {
    // Nothing to extend without subject list
    return { dailySchedule: currentSchedule };
  }

  // Enhanced topic progression tracking
  const topicProgressTracker: Record<string, { currentChapter: number; subTopicIndex: number }> = {};
  subjects.forEach(subject => {
    topicProgressTracker[subject] = { currentChapter: 0, subTopicIndex: 0 };
  });
  
  // Analyze existing schedule to determine current progression
  currentSchedule.forEach((day: any) => {
    if (day.subjects && Array.isArray(day.subjects)) {
      day.subjects.forEach((subj: any) => {
        if (subj.subject && topicProgressTracker[subj.subject]) {
          topicProgressTracker[subj.subject].currentChapter++;
        }
      });
    }
  });
  for (let i = currentSchedule.length; i < totalDays; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    const dayOfWeek = currentDate.toLocaleDateString("en-IN", { weekday: "long" });
    const isWeekend = dayOfWeek === "Saturday" || dayOfWeek === "Sunday";
    const weekNumber = Math.ceil((i + 1) / 7);

    const subjectIndex = i % subjects.length;
    const primarySubject = subjects[subjectIndex];
    const secondarySubject = subjects[(subjectIndex + 1) % subjects.length];

    const isPrimaryWeak = weakSubjects.includes(primarySubject);
    const primaryHours = isPrimaryWeak ? 
      Math.ceil(dailyAvailableHours * 0.6) : 
      Math.ceil(dailyAvailableHours * 0.5);
    const secondaryHours = Math.max(0, dailyAvailableHours - primaryHours);

    // Generate specific topics based on progression and level
    const generateSpecificTopics = (subject: string, isSecondary: boolean = false) => {
      const progress = topicProgressTracker[subject];
      const chapterNumber = Math.floor(progress.currentChapter / (isBeginnerLevel ? 4 : isIntermediateLevel ? 3 : 2)) + 1;
      
      if (isBeginnerLevel) {
        const subTopics = ['Introduction', 'Basic Concepts', 'Examples', 'Simple Practice'];
        const currentSubTopic = subTopics[progress.subTopicIndex % subTopics.length];
        return isSecondary ? [
          `${subject} - Chapter ${chapterNumber}: Quick Review`,
          `${subject} - Chapter ${chapterNumber}: Practice Problems`
        ] : [
          `${subject} - Chapter ${chapterNumber}: ${currentSubTopic}`,
          `${subject} - Chapter ${chapterNumber}: Step-by-step Learning`
        ];
      } else if (isIntermediateLevel) {
        const subTopics = ['Theory & Concepts', 'Applications', 'Problem Solving'];
        const currentSubTopic = subTopics[progress.subTopicIndex % subTopics.length];
        return isSecondary ? [
          `${subject} - Chapter ${chapterNumber}: Quick Review`,
          `${subject} - Chapter ${chapterNumber}: Advanced Practice`
        ] : [
          `${subject} - Chapter ${chapterNumber}: ${currentSubTopic}`,
          `${subject} - Chapter ${chapterNumber}: Comprehensive Understanding`
        ];
      } else {
        return isSecondary ? [
          `${subject} - Chapter ${chapterNumber}: Advanced Review`,
          `${subject} - Chapter ${chapterNumber}: Integration & Synthesis`
        ] : [
          `${subject} - Chapter ${chapterNumber}: Mastery & Integration`,
          `${subject} - Chapter ${chapterNumber}: Complex Problem Solving`
        ];
      }
    };

    // Generate time slots based on study pattern
    const generateTimeSlot = (subjectIndex: number, hours: number) => {
      const baseHour = studentProfile?.studyPattern === 'morning' ? 6 :
                     studentProfile?.studyPattern === 'evening' ? 16 :
                     studentProfile?.studyPattern === 'night' ? 20 : 9;
      const startHour = baseHour + (subjectIndex * Math.ceil(hours));
      const endHour = startHour + hours;
      
      const formatHour = (hour: number) => {
        const adjustedHour = hour % 24;
        const period = adjustedHour >= 12 ? 'PM' : 'AM';
        const displayHour = adjustedHour === 0 ? 12 : adjustedHour > 12 ? adjustedHour - 12 : adjustedHour;
        return `${displayHour}:${hour % 1 === 0.5 ? '30' : '00'} ${period}`;
      };
      
      return `${formatHour(startHour)} - ${formatHour(endHour)}`;
    };

    const dailySchedule = {
      date: currentDate.toISOString().split("T")[0],
      dayOfWeek,
      subjects: [
        {
          subject: primarySubject,
          hours: primaryHours,
          timeSlot: generateTimeSlot(0, primaryHours),
          topics: generateSpecificTopics(primarySubject),
          priority: isPrimaryWeak ? "high" : "medium",
          studyType: isWeekend ? "revision" : "new-concepts",
          breakAfter: 15,
          difficultyLevel: isBeginnerLevel ? 'easy' : isIntermediateLevel ? 'medium' : 'hard',
          expectedOutcome: isBeginnerLevel ?
            `Build foundation in ${primarySubject}` :
            `Advance understanding of ${primarySubject}`
        },
        ...(secondarySubject
          ? [
              {
                subject: secondarySubject,
                hours: secondaryHours,
                timeSlot: generateTimeSlot(1, secondaryHours),
                topics: generateSpecificTopics(secondarySubject, true),
                priority: "medium",
                studyType: "practice",
                breakAfter: 15,
                difficultyLevel: isBeginnerLevel ? 'easy' : 'medium',
                expectedOutcome: `Reinforce ${secondarySubject} concepts through practice`
              },
            ]
          : []),
        ...(isWeekend
          ? [
              {
                subject: isBeginnerLevel ? "Weekly Review" : "Mock Test",
                hours: isBeginnerLevel ? 1.5 : 2,
                timeSlot: generateTimeSlot(2, isBeginnerLevel ? 1.5 : 2),
                topics: isBeginnerLevel ? [
                  "Week's Learning Consolidation",
                  "Concept Clarity Check",
                  "Confidence Building"
                ] : [
                  "Full-Length Mock Test",
                  "Performance Analysis",
                  "Strategy Refinement"
                ],
                priority: "high",
                studyType: isBeginnerLevel ? "revision" : "mock-test",
                breakAfter: 0,
                difficultyLevel: isBeginnerLevel ? 'easy' : 'medium',
                expectedOutcome: isBeginnerLevel ?
                  "Consolidate week's learning and build confidence" :
                  "Assess exam readiness and identify improvement areas"
              },
            ]
          : []),
      ],
      totalHours: dailyAvailableHours,
      focusArea: isPrimaryWeak ? 
        `Strengthen ${primarySubject} - ${isBeginnerLevel ? 'Foundation Building' : 'Advanced Mastery'}` : 
        `Balanced ${isBeginnerLevel ? 'Foundation' : 'Mastery'} Study`,
      motivationalNote: isWeekend ?
        `Weekend ${isBeginnerLevel ? 'consolidation' : 'revision'} focus: Reinforce ${primarySubject} understanding` :
        isBeginnerLevel ?
          `Day ${i + 1}: Take time to understand each concept. Quality learning builds lasting knowledge!` :
          `Day ${i + 1}: Stay consistent and challenge yourself. Excellence is built daily!`,
      weeklyGoal: `Week ${weekNumber}: ${isBeginnerLevel ? 'Build solid foundations and confidence in' : 'Master progressively advanced concepts in'} ${subjects.slice(0, 2).join(' & ')}`,
      studyPhase: isBeginnerLevel ? 'foundation' : isIntermediateLevel ? 'building' : 'mastery',
      difficultyLevel: isBeginnerLevel ? 'easy' : isIntermediateLevel ? 'medium' : 'hard'
    };

    // Update topic progression trackers
    topicProgressTracker[primarySubject].subTopicIndex++;
    if (topicProgressTracker[primarySubject].subTopicIndex >= (isBeginnerLevel ? 4 : isIntermediateLevel ? 3 : 2)) {
      topicProgressTracker[primarySubject].subTopicIndex = 0;
      topicProgressTracker[primarySubject].currentChapter++;
    }
    
    if (secondarySubject && topicProgressTracker[secondarySubject]) {
      topicProgressTracker[secondarySubject].subTopicIndex++;
      if (topicProgressTracker[secondarySubject].subTopicIndex >= (isBeginnerLevel ? 4 : isIntermediateLevel ? 3 : 2)) {
        topicProgressTracker[secondarySubject].subTopicIndex = 0;
        topicProgressTracker[secondarySubject].currentChapter++;
      }
    }

    currentSchedule.push(dailySchedule);
  }

  return { dailySchedule: currentSchedule };
}
