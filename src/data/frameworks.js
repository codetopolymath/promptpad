import { SECTION_COLORS } from './sections.js';

// Convenience: get the hex color for a section ID (falls back to role color if missing).
const colorOf = (sectionId) => (SECTION_COLORS[sectionId] ?? SECTION_COLORS.role).hex;

export const FRAMEWORKS = {
  custom: {
    name: 'Custom (Full)',
    icon: '⚙',
    description: 'Your own 8-section structure — maximum control and flexibility.',
    bestUsedWhen: 'Complex prompts where you need all levers.',
    acronymBreakdown: [
      { letter: 'Role',         color: colorOf('role') },
      { letter: 'Context',      color: colorOf('ctx') },
      { letter: 'Task',         color: colorOf('task') },
      { letter: 'Instructions', color: colorOf('instr') },
      { letter: 'Examples',     color: colorOf('ex') },
      { letter: 'Format',       color: colorOf('fmt') },
      { letter: 'Tone',         color: colorOf('tone') },
      { letter: 'Constraints',  color: colorOf('cnstr') },
    ],
    sections: [
      { baseSection: 'role' },
      { baseSection: 'ctx' },
      { baseSection: 'task' },
      { baseSection: 'instr' },
      { baseSection: 'ex' },
      { baseSection: 'fmt' },
      { baseSection: 'tone' },
      { baseSection: 'cnstr' },
    ],
  },

  risen: {
    name: 'RISEN',
    icon: '📐',
    description: 'Role · Instructions · Steps · End Goal · Narrowing. Best for structured, multi-step execution.',
    bestUsedWhen: 'Multi-step tasks where execution order matters; instruction-heavy prompts.',
    acronymBreakdown: [
      { letter: 'R: Role',         color: colorOf('role') },
      { letter: 'I: Instructions', color: colorOf('instr') },
      { letter: 'S: Steps',        color: colorOf('ctx') },
      { letter: 'E: End Goal',     color: colorOf('task') },
      { letter: 'N: Narrowing',    color: colorOf('cnstr') },
    ],
    sections: [
      { baseSection: 'role' },
      { baseSection: 'instr', overrides: { shortLabel: 'Instructions', fullTitle: 'Instructions + Steps' } },
      { baseSection: 'task',  overrides: { shortLabel: 'End Goal',     fullTitle: 'End Goal',         placeholder: 'What is the final outcome you need? Describe the desired end state clearly.' } },
      { baseSection: 'ex',    overrides: { shortLabel: 'Steps',        fullTitle: 'Concrete Steps',   placeholder: 'List the specific numbered steps the AI should take to achieve the End Goal.' } },
      { baseSection: 'cnstr', overrides: { shortLabel: 'Narrowing',    fullTitle: 'Narrowing (Scope)', placeholder: 'Narrow the scope. What should be excluded, limited, or constrained?\n\n- Limit to...\n- Exclude...\n- Stay within...' } },
    ],
  },

  costar: {
    name: 'CO-STAR',
    icon: '⭐',
    description: 'Context · Objective · Style · Tone · Audience · Response. Built for writing tasks with specific audiences.',
    bestUsedWhen: 'Content creation, marketing, communications — anytime the reader matters as much as the task.',
    acronymBreakdown: [
      { letter: 'C: Context',   color: colorOf('ctx') },
      { letter: 'O: Objective', color: colorOf('task') },
      { letter: 'S: Style',     color: colorOf('style') },
      { letter: 'T: Tone',      color: colorOf('tone') },
      { letter: 'A: Audience',  color: colorOf('audience') },
      { letter: 'R: Response',  color: colorOf('fmt') },
    ],
    sections: [
      { baseSection: 'ctx' },
      { baseSection: 'task',     overrides: { shortLabel: 'Objective', fullTitle: 'Objective',       placeholder: 'What is the single objective? State the desired output clearly and specifically.' } },
      { baseSection: 'style' },
      { baseSection: 'tone' },
      { baseSection: 'audience' },
      { baseSection: 'fmt',      overrides: { shortLabel: 'Response',  fullTitle: 'Response Format' } },
    ],
  },

  rtf: {
    name: 'RTF (Minimal)',
    icon: '⚡',
    description: 'Role · Task · Format. The fastest, leanest prompt structure.',
    bestUsedWhen: "Quick, well-defined tasks where you trust the model's defaults on tone and constraints.",
    acronymBreakdown: [
      { letter: 'R: Role',   color: colorOf('role') },
      { letter: 'T: Task',   color: colorOf('task') },
      { letter: 'F: Format', color: colorOf('fmt') },
    ],
    sections: [
      { baseSection: 'role' },
      { baseSection: 'task' },
      { baseSection: 'fmt' },
    ],
  },

  tag: {
    name: 'TAG (Micro)',
    icon: '🏷',
    description: 'Task · Action · Goal. Ultra-minimal — no role, no format. For fast iteration.',
    bestUsedWhen: "Chat-style prompting, quick experiments, or when you're iterating rapidly.",
    acronymBreakdown: [
      { letter: 'T: Task',   color: colorOf('task') },
      { letter: 'A: Action', color: colorOf('instr') },
      { letter: 'G: Goal',   color: colorOf('ctx') },
    ],
    sections: [
      { baseSection: 'task' },
      { baseSection: 'instr', overrides: { shortLabel: 'Action', fullTitle: 'Action', placeholder: 'What specific action should be taken? What are the concrete steps or method?\n\n- Action 1\n- Action 2' } },
      { baseSection: 'ex',    overrides: { shortLabel: 'Goal',   fullTitle: 'Goal',   placeholder: 'What is the desired goal or outcome? What does success look like?' } },
    ],
  },

  crispe: {
    name: 'CRISPE',
    icon: '🔬',
    description: 'Capacity & Role · Insight · Statement · Personality · Experiment. Iterative and exploratory.',
    bestUsedWhen: 'Exploratory tasks, creative work, or when you want the model to try variations and self-evaluate.',
    acronymBreakdown: [
      { letter: 'C: Capacity & Role', color: colorOf('role') },
      { letter: 'R: Insight',         color: colorOf('instr') },
      { letter: 'I: Statement',       color: colorOf('task') },
      { letter: 'S: Personality',     color: colorOf('tone') },
      { letter: 'P: Experiment',      color: colorOf('ctx') },
    ],
    sections: [
      { baseSection: 'role',  overrides: { shortLabel: 'Capacity & Role', fullTitle: 'Capacity & Role',     placeholder: "Define the AI's capacity and role. Be specific about its expertise, perspective, and authority level." } },
      { baseSection: 'ctx',   overrides: { shortLabel: 'Insight',         fullTitle: 'Insight (Context)',   placeholder: 'Provide insight and context. What background knowledge does the AI need to form a good perspective?' } },
      { baseSection: 'task',  overrides: { shortLabel: 'Statement',       fullTitle: 'Statement (Task)',    placeholder: 'State exactly what you need. Be direct and specific — this is the core task statement.' } },
      { baseSection: 'tone',  overrides: { shortLabel: 'Personality',     fullTitle: 'Personality',         placeholder: 'Define the personality of the response. How should the AI come across to the reader?' } },
      { baseSection: 'ex',    overrides: { shortLabel: 'Experiment',      fullTitle: 'Experiment (Iterate)', placeholder: 'What experiments or variations should the AI try?\n\ne.g. "Generate 3 different approaches, evaluate each against the stated criteria, then recommend the best one with your reasoning."' } },
    ],
  },

  ape: {
    name: 'APE',
    icon: '🦾',
    description: 'Action · Purpose · Expectation. Purpose-first — forces you to articulate why.',
    bestUsedWhen: "When context is obvious but purpose often isn't; short prompts where intent drives everything.",
    acronymBreakdown: [
      { letter: 'A: Action',      color: colorOf('task') },
      { letter: 'P: Purpose',     color: colorOf('ctx') },
      { letter: 'E: Expectation', color: colorOf('ex') },
    ],
    sections: [
      { baseSection: 'task', overrides: { shortLabel: 'Action',      fullTitle: 'Action',      placeholder: 'What action should be performed? State it as a verb-first command.\n\ne.g. "Write a...", "Analyse the...", "Rewrite this..."' } },
      { baseSection: 'ctx',  overrides: { shortLabel: 'Purpose',     fullTitle: 'Purpose',     placeholder: "Why do you need this? What problem does it solve? What will you use this output for?\n\nThe purpose informs every choice the model makes." } },
      { baseSection: 'fmt',  overrides: { shortLabel: 'Expectation', fullTitle: 'Expectation', placeholder: 'What does a successful output look like? Describe the format, quality bar, and any specific requirements.' } },
    ],
  },
};
