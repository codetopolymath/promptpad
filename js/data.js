// ════════════════════════════════════════════════
//  SECTION DEFINITIONS  — canonical base sections
// ════════════════════════════════════════════════

export const SEC_DEFS = {
  role: {
    id: 'role', tag: 'Role', title: 'Role / Persona', wm: 'ROLE',
    ph: 'Who should the AI be?\n\ne.g. "Act as a senior software engineer with 10 years of experience in distributed systems. You are pragmatic, value simplicity, and think carefully about edge cases."',
    tip: {
      what: 'Sets the identity the model should inhabit — job title, expertise level, personality.',
      why: 'A concrete role primes relevant knowledge and sets the register of the response. Vague prompts get generic answers; a vivid persona gets expert-level thinking.',
      ex: 'Act as a principal software engineer at a fintech startup with 12 years in distributed systems. You are direct, deeply technical, and value simple solutions over clever ones.'
    }
  },
  ctx: {
    id: 'ctx', tag: 'Context', title: 'Context / Background', wm: 'CONTEXT',
    ph: 'What does the AI need to know?\n\nProvide situational background, relevant constraints, prior decisions, data, or anything that informs the task.',
    tip: {
      what: 'The situational briefing — everything the model needs to understand before it can act intelligently.',
      why: 'Models have no memory between sessions. Context bridges that gap. More relevant context = more accurate, specific output.',
      ex: 'We are a 12-person B2B startup. Our customers are non-technical business owners. We are 3 weeks from our Series A. Our main competitor just launched a mobile app.'
    }
  },
  task: {
    id: 'task', tag: 'Task', title: 'Task / Objective', wm: 'TASK',
    ph: 'What exactly do you want done?\n\nState one clear objective. If you have multiple tasks, break them into separate prompts.',
    tip: {
      what: 'The primary directive — the single, clearly stated thing you want the model to produce.',
      why: 'Ambiguous tasks generate ambiguous outputs. A sharp task sentence acts as the north star everything else orbits.',
      ex: 'Write a 90-second investor pitch script for our Series A deck — communicates market size, our unique insight, and why now — in plain, confident language.'
    }
  },
  instr: {
    id: 'instr', tag: 'Instructions', title: 'Instructions / Steps', wm: 'INSTRUCTIONS',
    ph: 'How should the task be completed?\n\nList specific steps, rules, or requirements:\n- Step or rule 1\n- Step or rule 2',
    tip: {
      what: 'Explicit operating rules — the step-by-step breakdown or constraints on how the task must be done.',
      why: 'Instructions turn a fuzzy directive into a precise execution plan. Especially powerful for multi-step tasks or when you\'ve been burned by the same mistake before.',
      ex: '1. Open with a one-sentence hook naming the problem.\n2. State market size using a bottom-up number.\n3. Describe our solution in one plain sentence (no jargon).\n4. Name one customer and their quantified result.\n5. Close with our ask. Do not use bullet points.'
    }
  },
  ex: {
    id: 'ex', tag: 'Examples', title: 'Examples (Few-Shot)', wm: 'EXAMPLES',
    ph: 'Show, don\'t just tell. Provide 1–3 input/output pairs:\n\nInput: ...\nOutput: ...',
    tip: {
      what: 'Concrete input/output pairs — few-shot prompting. Often the single most powerful technique.',
      why: 'One good example is worth a paragraph of instructions. It bypasses ambiguity and shows exactly what "good" looks like.',
      ex: 'Input: "Feature: auto-categorisation of expenses"\nOutput: "Stop sorting receipts. Claude learns your patterns and files everything."\n\nInput: "Feature: multi-currency support"\nOutput: "Do business in any currency. Reconcile in yours."'
    }
  },
  fmt: {
    id: 'fmt', tag: 'Format', title: 'Output Format', wm: 'FORMAT',
    ph: 'How should the response be structured?\n\nSpecify format, length, sections, or data shape (JSON, markdown, prose, bullet list).',
    tip: {
      what: 'The structural shape of the expected response — length, organisation, and any special syntax.',
      why: 'Without format guidance the model picks a default. Explicit format instructions prevent surprises, especially for downstream use.',
      ex: 'Return a JSON array. Each object: { "headline": string (max 8 words), "subheadline": string (max 15 words), "cta": string (max 4 words) }. No markdown, no commentary.'
    }
  },
  tone: {
    id: 'tone', tag: 'Tone', title: 'Tone / Voice', wm: 'TONE',
    ph: 'What should it sound like?\n\nDescribe the register, personality, and style — or name a reference voice.',
    tip: {
      what: 'The emotional register and personality of the output.',
      why: 'The same content in different tones reads as completely different work. Explicit tone instructions prevent mismatch.',
      ex: 'Confident without being arrogant. Concise without being cold. Like a smart investor who\'s heard a thousand pitches and respects people\'s time. No buzzwords. Active voice.'
    }
  },
  style: {
    id: 'style', tag: 'Style', title: 'Style / Genre', wm: 'STYLE',
    ph: 'What style should the writing take?\n\ne.g. Journalistic, academic, conversational, persuasive, narrative, technical...',
    tip: {
      what: 'The writing genre and structural approach — how the content is organised and delivered.',
      why: 'Style (genre/structure) and tone (emotion/register) are distinct. A piece can be journalistic in style but warm in tone. CO-STAR separates them deliberately.',
      ex: 'Journalistic. Lead with the most important fact. Use the inverted pyramid structure. Short paragraphs, one idea per sentence. No fluff, no throat-clearing.'
    }
  },
  cnstr: {
    id: 'cnstr', tag: 'Constraints', title: 'Constraints / Avoid', wm: 'CONSTRAINTS',
    ph: 'What should NOT be in the output?\n\nList explicit exclusions, banned phrases, or hard limits:\n- Do not...\n- Avoid...',
    tip: {
      what: 'Explicit guardrails — what the model must not do, include, say, or assume.',
      why: 'Negative constraints are as powerful as positive instructions. If you\'ve received a specific failure before, a constraint directly prevents it.',
      ex: '- Do not mention competitors by name\n- No buzzwords: "innovative", "seamless", "leverage", "robust"\n- Do not exceed 90 seconds (~220 words)\n- No passive voice\n- Do not open with a question'
    }
  },
  audience: {
    id: 'audience', tag: 'Audience', title: 'Target Audience', wm: 'AUDIENCE',
    ph: 'Who is the output for?\n\nDescribe the reader: their role, knowledge level, context, and what they care about.',
    tip: {
      what: 'Defines who the output is written for — their expertise level, role, and what they need.',
      why: 'CO-STAR adds Audience as a first-class field because writing "for" someone specific dramatically improves relevance and tone calibration.',
      ex: 'B2B decision-makers at mid-market companies (50–500 employees). They are time-poor, sceptical of vendor claims, and need to justify purchases to their CFO. They are not technical.'
    }
  }
};

// ════════════════════════════════════════════════
//  SECTION COLORS  — one accent per section type
// ════════════════════════════════════════════════

export const SEC_COLORS = {
  role:     { color: '#A78BFA', bg: 'rgba(167,139,250,.12)' },
  ctx:      { color: '#34D399', bg: 'rgba(52,211,153,.1)' },
  task:     { color: '#F7C948', bg: 'rgba(247,201,72,.1)' },
  instr:    { color: '#60A5FA', bg: 'rgba(96,165,250,.1)' },
  ex:       { color: '#F87171', bg: 'rgba(248,113,113,.1)' },
  fmt:      { color: '#22D3EE', bg: 'rgba(34,211,238,.1)' },
  tone:     { color: '#F472B6', bg: 'rgba(244,114,182,.1)' },
  style:    { color: '#818CF8', bg: 'rgba(129,140,248,.12)' },
  cnstr:    { color: '#FB923C', bg: 'rgba(251,146,60,.1)' },
  audience: { color: '#A3E635', bg: 'rgba(163,230,53,.1)' },
  tone2:    { color: '#F472B6', bg: 'rgba(244,114,182,.1)' },
};

// ════════════════════════════════════════════════
//  FRAMEWORK DEFINITIONS
// ════════════════════════════════════════════════

export const FW = {
  custom: {
    name: 'Custom (Full)', icon: '⚙',
    desc: 'Your own 8-section structure — maximum control and flexibility.',
    when: 'Complex prompts where you need all levers.',
    letters: [
      { l: 'Role', c: '#A78BFA' }, { l: 'Context', c: '#34D399' },
      { l: 'Task', c: '#F7C948' }, { l: 'Instructions', c: '#60A5FA' },
      { l: 'Examples', c: '#F87171' }, { l: 'Format', c: '#22D3EE' },
      { l: 'Tone', c: '#F472B6' }, { l: 'Constraints', c: '#FB923C' }
    ],
    sections: [
      { base: 'role' }, { base: 'ctx' }, { base: 'task' }, { base: 'instr' },
      { base: 'ex' }, { base: 'fmt' }, { base: 'tone' }, { base: 'cnstr' }
    ]
  },
  risen: {
    name: 'RISEN', icon: '📐',
    desc: 'Role · Instructions · Steps · End Goal · Narrowing. Best for structured, multi-step execution.',
    when: 'Multi-step tasks where execution order matters; instruction-heavy prompts.',
    letters: [
      { l: 'R: Role', c: '#A78BFA' }, { l: 'I: Instructions', c: '#60A5FA' },
      { l: 'S: Steps', c: '#34D399' }, { l: 'E: End Goal', c: '#F7C948' },
      { l: 'N: Narrowing', c: '#FB923C' }
    ],
    sections: [
      { base: 'role' },
      { base: 'instr', overrides: { tag: 'Instructions', title: 'Instructions + Steps' } },
      { base: 'task',  overrides: { tag: 'End Goal', title: 'End Goal', ph: 'What is the final outcome you need? Describe the desired end state clearly.' } },
      { base: 'ex',    overrides: { tag: 'Steps', title: 'Concrete Steps', ph: 'List the specific numbered steps the AI should take to achieve the End Goal.' } },
      { base: 'cnstr', overrides: { tag: 'Narrowing', title: 'Narrowing (Scope)', ph: 'Narrow the scope. What should be excluded, limited, or constrained?\n\n- Limit to...\n- Exclude...\n- Stay within...' } }
    ]
  },
  costar: {
    name: 'CO-STAR', icon: '⭐',
    desc: 'Context · Objective · Style · Tone · Audience · Response. Built for writing tasks with specific audiences.',
    when: 'Content creation, marketing, communications — anytime the reader matters as much as the task.',
    letters: [
      { l: 'C: Context', c: '#34D399' }, { l: 'O: Objective', c: '#F7C948' },
      { l: 'S: Style', c: '#818CF8' }, { l: 'T: Tone', c: '#F472B6' },
      { l: 'A: Audience', c: '#A3E635' }, { l: 'R: Response', c: '#22D3EE' }
    ],
    sections: [
      { base: 'ctx' },
      { base: 'task',  overrides: { tag: 'Objective', title: 'Objective', ph: 'What is the single objective? State the desired output clearly and specifically.' } },
      { base: 'style' },
      { base: 'tone' },
      { base: 'audience' },
      { base: 'fmt',   overrides: { tag: 'Response', title: 'Response Format' } }
    ]
  },
  rtf: {
    name: 'RTF (Minimal)', icon: '⚡',
    desc: 'Role · Task · Format. The fastest, leanest prompt structure.',
    when: 'Quick, well-defined tasks where you trust the model\'s defaults on tone and constraints.',
    letters: [
      { l: 'R: Role', c: '#A78BFA' }, { l: 'T: Task', c: '#F7C948' }, { l: 'F: Format', c: '#22D3EE' }
    ],
    sections: [{ base: 'role' }, { base: 'task' }, { base: 'fmt' }]
  },
  tag: {
    name: 'TAG (Micro)', icon: '🏷',
    desc: 'Task · Action · Goal. Ultra-minimal — no role, no format. For fast iteration.',
    when: 'Chat-style prompting, quick experiments, or when you\'re iterating rapidly.',
    letters: [
      { l: 'T: Task', c: '#F7C948' }, { l: 'A: Action', c: '#60A5FA' }, { l: 'G: Goal', c: '#34D399' }
    ],
    sections: [
      { base: 'task' },
      { base: 'instr', overrides: { tag: 'Action', title: 'Action', ph: 'What specific action should be taken? What are the concrete steps or method?\n\n- Action 1\n- Action 2' } },
      { base: 'ex',    overrides: { tag: 'Goal', title: 'Goal', ph: 'What is the desired goal or outcome? What does success look like?' } }
    ]
  },
  crispe: {
    name: 'CRISPE', icon: '🔬',
    desc: 'Capacity & Role · Insight · Statement · Personality · Experiment. Iterative and exploratory.',
    when: 'Exploratory tasks, creative work, or when you want the model to try variations and self-evaluate.',
    letters: [
      { l: 'C: Capacity & Role', c: '#A78BFA' }, { l: 'R: Insight', c: '#60A5FA' },
      { l: 'I: Statement', c: '#F7C948' }, { l: 'S: Personality', c: '#F472B6' },
      { l: 'P: Experiment', c: '#34D399' }
    ],
    sections: [
      { base: 'role',  overrides: { tag: 'Capacity & Role', title: 'Capacity & Role', ph: 'Define the AI\'s capacity and role. Be specific about its expertise, perspective, and authority level.' } },
      { base: 'ctx',   overrides: { tag: 'Insight', title: 'Insight (Context)', ph: 'Provide insight and context. What background knowledge does the AI need to form a good perspective?' } },
      { base: 'task',  overrides: { tag: 'Statement', title: 'Statement (Task)', ph: 'State exactly what you need. Be direct and specific — this is the core task statement.' } },
      { base: 'tone',  overrides: { tag: 'Personality', title: 'Personality', ph: 'Define the personality of the response. How should the AI come across to the reader?' } },
      { base: 'ex',    overrides: { tag: 'Experiment', title: 'Experiment (Iterate)', ph: 'What experiments or variations should the AI try?\n\ne.g. "Generate 3 different approaches, evaluate each against the stated criteria, then recommend the best one with your reasoning."' } }
    ]
  },
  ape: {
    name: 'APE', icon: '🦾',
    desc: 'Action · Purpose · Expectation. Purpose-first — forces you to articulate why.',
    when: 'When context is obvious but purpose often isn\'t; short prompts where intent drives everything.',
    letters: [
      { l: 'A: Action', c: '#F7C948' }, { l: 'P: Purpose', c: '#34D399' }, { l: 'E: Expectation', c: '#F87171' }
    ],
    sections: [
      { base: 'task', overrides: { tag: 'Action', title: 'Action', ph: 'What action should be performed? State it as a verb-first command.\n\ne.g. "Write a...", "Analyse the...", "Rewrite this..."' } },
      { base: 'ctx',  overrides: { tag: 'Purpose', title: 'Purpose', ph: 'Why do you need this? What problem does it solve? What will you use this output for?\n\nThe purpose informs every choice the model makes.' } },
      { base: 'fmt',  overrides: { tag: 'Expectation', title: 'Expectation', ph: 'What does a successful output look like? Describe the format, quality bar, and any specific requirements.' } }
    ]
  }
};

// ════════════════════════════════════════════════
//  TECHNIQUES
// ════════════════════════════════════════════════

export const TECHNIQUES = [
  {
    name: 'Zero-Shot CoT', cat: 'reason', catLabel: 'Reasoning',
    desc: 'Add "think step by step" to prompt the model to show its work before concluding. No examples needed.',
    when: ['Logic or math problems', 'Multi-step reasoning tasks', 'When the model keeps giving the wrong answer'],
    snippet: 'Before giving your final answer, think through this step by step, showing your reasoning.',
    injectTo: 'instr'
  },
  {
    name: 'Few-Shot Prompting', cat: 'reason', catLabel: 'Reasoning',
    desc: 'Provide concrete input/output examples in your prompt. The most reliably high-impact technique.',
    when: ['You have examples of good output', 'Task format is hard to describe', 'Consistent style or structure needed'],
    snippet: 'See the Examples section above — fill it with 2–3 concrete input/output pairs.',
    injectTo: 'ex'
  },
  {
    name: 'Self-Consistency', cat: 'reason', catLabel: 'Reasoning',
    desc: 'Run the same prompt multiple times and take the majority answer. Corrects errors through voting.',
    when: ['High-stakes factual or analytical answers', 'Model gives different answers each run', 'Math, logic, or classification tasks'],
    snippet: 'Generate 3 independent answers to this question. Then identify which answer appears most often and give me that as your final answer, with brief reasoning.',
    injectTo: 'instr'
  },
  {
    name: 'Tree of Thoughts (ToT)', cat: 'reason', catLabel: 'Reasoning',
    desc: 'Prompt the model to explore multiple reasoning paths and evaluate them, like a decision tree.',
    when: ['Complex decisions with multiple valid paths', 'Strategic planning', 'Creative problems with many possible directions'],
    snippet: 'Imagine three different experts are answering this question. Each writes 1 step of their thinking, shares it, then the group continues. If any expert realises they are wrong, they leave. Continue until one path clearly wins.',
    injectTo: 'instr'
  },
  {
    name: 'Chain-of-Thought (CoT)', cat: 'reason', catLabel: 'Reasoning',
    desc: 'Provide examples with the full reasoning chain shown, not just input/output. Teach the model to reason.',
    when: ['Complex multi-step tasks', 'Arithmetic or logical reasoning', 'When zero-shot CoT is not enough'],
    snippet: '[In your Examples section, show complete reasoning traces:]\nInput: [question]\nThinking: [step 1] → [step 2] → [step 3]\nAnswer: [conclusion]',
    injectTo: 'ex'
  },
  {
    name: 'ReAct Prompting', cat: 'agentic', catLabel: 'Agentic',
    desc: 'Interleave Reasoning and Acting: model produces a thought, takes an action, observes result, repeats.',
    when: ['Agentic or tool-use prompts', 'Tasks requiring external information', 'Multi-step workflows with feedback loops'],
    snippet: 'For each step: first write a Thought explaining your reasoning, then write an Action (what you would do or look up), then write an Observation (the result). Repeat until you have a final answer.',
    injectTo: 'instr'
  },
  {
    name: 'Prompt Chaining', cat: 'agentic', catLabel: 'Agentic',
    desc: 'Break a complex task into sequential prompts where each output feeds the next. Better than one mega-prompt.',
    when: ['Tasks too complex for a single prompt', 'When you need to verify intermediate outputs', 'Document processing pipelines'],
    snippet: '[Design as a chain:]\nPrompt 1: Extract relevant quotes from the document.\nPrompt 2: Given these quotes, answer the question.\n\n(Add to your instructions as a numbered pipeline.)',
    injectTo: 'instr'
  },
  {
    name: 'Generated Knowledge', cat: 'reason', catLabel: 'Reasoning',
    desc: 'Ask the model to first generate relevant facts, then use those facts to answer. Reduces hallucination.',
    when: ['Topics where accuracy matters', 'Commonsense or domain knowledge tasks', 'When the model tends to hallucinate'],
    snippet: 'Step 1: List 5 key facts you know about [topic] that are relevant to this question.\nStep 2: Using only those facts, answer the question.',
    injectTo: 'instr'
  },
  {
    name: 'RAG (Retrieval Augmented)', cat: 'retrieve', catLabel: 'Retrieval',
    desc: 'Supply retrieved documents or data directly in the prompt. Ground the model in real, current sources.',
    when: ['Tasks requiring current or proprietary information', 'Reducing hallucination on factual queries', 'QA over specific documents'],
    snippet: 'Use only the information in the document below to answer the question. If the answer is not in the document, say "I don\'t know."\n\n---\n[DOCUMENT]\n{paste document here}\n---',
    injectTo: 'ctx'
  },
  {
    name: 'PAL (Program-Aided)', cat: 'reason', catLabel: 'Reasoning',
    desc: 'Ask the model to write code to solve the problem, then execute it. Separates reasoning from computation.',
    when: ['Math, statistics, or data manipulation', 'Tasks with clear algorithmic solutions', 'When calculation errors are unacceptable'],
    snippet: 'Solve this by writing Python code that performs the calculation. Show the code, then show the result. Do not compute in your head — write code.',
    injectTo: 'instr'
  },
  {
    name: 'Metacognitive Prompting', cat: 'reason', catLabel: 'Reasoning',
    desc: 'Ask the model to reflect on what it knows before answering, or to critique its own output.',
    when: ['Uncertain or nuanced topics', 'When you want balanced, accurate analysis', 'Self-improvement loops'],
    snippet: 'Before answering: what do you know well about this topic, and what are you uncertain about? Then answer, flagging your confidence level on key claims.',
    injectTo: 'instr'
  },
  {
    name: 'Context Engineering', cat: 'context', catLabel: 'Context',
    desc: 'The 2025 discipline beyond prompt engineering: deliberately filling the model\'s context window with the right information at the right time.',
    when: ['Long-context tasks', 'Agentic systems with memory', 'When prompt engineering alone isn\'t enough'],
    snippet: '[Not a prompt pattern — a system design principle]\nStructure your context window deliberately:\n1. System identity (role + rules)\n2. Relevant retrieved documents\n3. Conversation history\n4. Current task + instructions\n5. Output format\n\nOrder matters. More recent = more weight.',
    injectTo: 'ctx'
  }
];

// ════════════════════════════════════════════════
//  DEFAULT SNIPPETS  — per base section ID
// ════════════════════════════════════════════════

export const DEFAULT_SNIPS = {
  role: [
    'Act as a senior software engineer with 12 years of experience in distributed backend systems. You are pragmatic, prefer simple solutions over clever ones, and think carefully about edge cases before recommending anything.',
    'Act as an experienced B2B content strategist. You write for busy decision-makers, avoid jargon, lead with the reader\'s pain point, and always have a clear CTA.',
    'Act as a data analyst who communicates complex findings clearly to non-technical stakeholders. You are precise, sceptical of weak correlations, and always explain your assumptions.'
  ],
  ctx: [
    'We are a [stage] startup building [product] for [target customer]. Our main customer pain is [pain]. We are [timeline] from [milestone]. The key constraint is [constraint].',
    'I am preparing [deliverable] for [audience]. Previous attempts had [problem]. The key requirement this time is [key requirement].',
    'This is a [draft/final] version. The audience is [description]. They know [level of knowledge] about this topic. They care most about [priority].'
  ],
  task: [
    'Write a [type] that [achieves X] for [audience], in [length/format].',
    'Analyse [subject] and identify [what to find]. The output should be actionable and prioritised.',
    'Review the following [thing] and provide specific, prioritised feedback on [aspects to evaluate].'
  ],
  instr: [
    '1. [First step]\n2. [Second step]\n3. [Third step]\n\nRules:\n- [Rule 1]\n- [Rule 2]',
    'Follow this structure:\n- Section 1: [what goes here]\n- Section 2: [what goes here]\n- Section 3: [what goes here]\n\nMax length: [X] words.',
    'Think step by step before giving your final answer. Show your reasoning, then conclude.'
  ],
  ex: [
    'Input: "[example input 1]"\nOutput: "[example output 1]"\n\nInput: "[example input 2]"\nOutput: "[example output 2]"',
    'Good example:\n"[good example text]"\n\nBad example (avoid this):\n"[bad example text]"\n\nWhy: [explanation]',
    'Q: [sample question]\nA: [ideal answer demonstrating the style, depth, and format you want]'
  ],
  fmt: [
    'Return a JSON array. Each object: { "key": "value" }. No markdown, no commentary — only the JSON.',
    'Format as a markdown document with H2 headings for each section. Max [X] words total. Use bullet lists only for lists of 3+ items.',
    'Plain prose only. No headings, no bullets. [X] paragraphs, each under [Y] sentences. Active voice throughout.'
  ],
  tone: [
    'Confident and direct. No hedging. No filler phrases. Write as if the reader\'s time is limited.',
    'Warm and conversational. Like a knowledgeable friend explaining something — not a textbook.',
    'Dry, precise, technical. Assume the reader is expert-level. Skip explanations of obvious things.'
  ],
  style: [
    'Journalistic. Lead with the most important fact. Short paragraphs. Inverted pyramid structure.',
    'Conversational and narrative. First-person perspective, build tension, resolve it.',
    'Academic and structured. Thesis first, evidence second, synthesis third. Citations where relevant.'
  ],
  cnstr: [
    '- Do not exceed [X] words\n- Do not use passive voice\n- Do not open with "I"\n- No buzzwords: "innovative", "seamless", "leverage"',
    '- Stay within the scope of [topic area]\n- Do not mention [competitor/topic to avoid]\n- Do not make claims that cannot be verified',
    '- Do not use bullet points in [section]\n- Do not include introductory or closing pleasantries\n- Do not repeat information already stated'
  ],
  audience: [
    '[Job title] at [company type]. They are [technical level]. They care about [priorities]. They are sceptical of [concerns].',
    'Non-technical business owners at SMBs. They make decisions based on ROI and ease of use, not features.',
    'Senior engineers and technical leads. Skip basic explanations. They value precision, tradeoffs, and honesty about limitations.'
  ]
};
