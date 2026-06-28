'use strict';

// ════════════════════════════════════════════════
//  DATA — Section Definitions
// ════════════════════════════════════════════════

const SEC_DEFS = {
  role: {
    id:'role', tag:'Role', title:'Role / Persona', wm:'ROLE',
    ph:'Who should the AI be?\n\ne.g. "Act as a senior software engineer with 10 years of experience in distributed systems. You are pragmatic, value simplicity, and think carefully about edge cases."',
    tip:{ what:'Sets the identity the model should inhabit — job title, expertise level, personality.',
          why:'A concrete role primes relevant knowledge and sets the register of the response. Vague prompts get generic answers; a vivid persona gets expert-level thinking.',
          ex:'Act as a principal software engineer at a fintech startup with 12 years in distributed systems. You are direct, deeply technical, and value simple solutions over clever ones.' }
  },
  ctx: {
    id:'ctx', tag:'Context', title:'Context / Background', wm:'CONTEXT',
    ph:'What does the AI need to know?\n\nProvide situational background, relevant constraints, prior decisions, data, or anything that informs the task.',
    tip:{ what:'The situational briefing — everything the model needs to understand before it can act intelligently.',
          why:'Models have no memory between sessions. Context bridges that gap. More relevant context = more accurate, specific output.',
          ex:'We are a 12-person B2B startup. Our customers are non-technical business owners. We are 3 weeks from our Series A. Our main competitor just launched a mobile app.' }
  },
  task: {
    id:'task', tag:'Task', title:'Task / Objective', wm:'TASK',
    ph:'What exactly do you want done?\n\nState one clear objective. If you have multiple tasks, break them into separate prompts.',
    tip:{ what:'The primary directive — the single, clearly stated thing you want the model to produce.',
          why:'Ambiguous tasks generate ambiguous outputs. A sharp task sentence acts as the north star everything else orbits.',
          ex:'Write a 90-second investor pitch script for our Series A deck — communicates market size, our unique insight, and why now — in plain, confident language.' }
  },
  instr: {
    id:'instr', tag:'Instructions', title:'Instructions / Steps', wm:'INSTRUCTIONS',
    ph:'How should the task be completed?\n\nList specific steps, rules, or requirements:\n- Step or rule 1\n- Step or rule 2',
    tip:{ what:'Explicit operating rules — the step-by-step breakdown or constraints on how the task must be done.',
          why:'Instructions turn a fuzzy directive into a precise execution plan. Especially powerful for multi-step tasks or when you\'ve been burned by the same mistake before.',
          ex:'1. Open with a one-sentence hook naming the problem.\n2. State market size using a bottom-up number.\n3. Describe our solution in one plain sentence (no jargon).\n4. Name one customer and their quantified result.\n5. Close with our ask. Do not use bullet points.' }
  },
  ex: {
    id:'ex', tag:'Examples', title:'Examples (Few-Shot)', wm:'EXAMPLES',
    ph:'Show, don\'t just tell. Provide 1–3 input/output pairs:\n\nInput: ...\nOutput: ...',
    tip:{ what:'Concrete input/output pairs — few-shot prompting. Often the single most powerful technique.',
          why:'One good example is worth a paragraph of instructions. It bypasses ambiguity and shows exactly what "good" looks like.',
          ex:'Input: "Feature: auto-categorisation of expenses"\nOutput: "Stop sorting receipts. Claude learns your patterns and files everything."\n\nInput: "Feature: multi-currency support"\nOutput: "Do business in any currency. Reconcile in yours."' }
  },
  fmt: {
    id:'fmt', tag:'Format', title:'Output Format', wm:'FORMAT',
    ph:'How should the response be structured?\n\nSpecify format, length, sections, or data shape (JSON, markdown, prose, bullet list).',
    tip:{ what:'The structural shape of the expected response — length, organisation, and any special syntax.',
          why:'Without format guidance the model picks a default. Explicit format instructions prevent surprises, especially for downstream use.',
          ex:'Return a JSON array. Each object: { "headline": string (max 8 words), "subheadline": string (max 15 words), "cta": string (max 4 words) }. No markdown, no commentary.' }
  },
  tone: {
    id:'tone', tag:'Tone', title:'Tone / Voice', wm:'TONE',
    ph:'What should it sound like?\n\nDescribe the register, personality, and style — or name a reference voice.',
    tip:{ what:'The emotional register and personality of the output.',
          why:'The same content in different tones reads as completely different work. Explicit tone instructions prevent mismatch.',
          ex:'Confident without being arrogant. Concise without being cold. Like a smart investor who\'s heard a thousand pitches and respects people\'s time. No buzzwords. Active voice.' }
  },
  style: {
    id:'style', tag:'Style', title:'Style / Genre', wm:'STYLE',
    ph:'What style should the writing take?\n\ne.g. Journalistic, academic, conversational, persuasive, narrative...',
    tip:{ what:'The writing genre and structural approach — how the content is organised and delivered.',
          why:'Style (genre/structure) and tone (emotion/register) are distinct. A piece can be journalistic in style but warm in tone. CO-STAR separates them deliberately.',
          ex:'Journalistic. Lead with the most important fact. Inverted pyramid structure. Short paragraphs, one idea per sentence. No fluff.' }
  },
  cnstr: {
    id:'cnstr', tag:'Constraints', title:'Constraints / Avoid', wm:'CONSTRAINTS',
    ph:'What should NOT be in the output?\n\nList explicit exclusions, banned phrases, or hard limits:\n- Do not...\n- Avoid...',
    tip:{ what:'Explicit guardrails — what the model must not do, include, say, or assume.',
          why:'Negative constraints are as powerful as positive instructions. If you\'ve received a specific failure before, a constraint directly prevents it.',
          ex:'- Do not mention competitors by name\n- No buzzwords: "innovative", "seamless", "leverage", "robust"\n- Do not exceed 90 seconds (~220 words)\n- No passive voice\n- Do not open with a question' }
  },
  audience: {
    id:'audience', tag:'Audience', title:'Target Audience', wm:'AUDIENCE',
    ph:'Who is the output for?\n\nDescribe the reader: their role, knowledge level, context, and what they care about.',
    tip:{ what:'Defines who the output is written for — their expertise level, role, and what they need.',
          why:'CO-STAR adds Audience as a first-class field because writing "for" someone specific dramatically improves relevance and tone calibration.',
          ex:'B2B decision-makers at mid-market companies (50–500 employees). Time-poor, sceptical of vendor claims, need to justify purchases to their CFO. Not technical.' }
  }
};

// ════════════════════════════════════════════════
//  SECTION COLORS
// r/g/b are used for CSS box-shadow rgba() values
// ════════════════════════════════════════════════

const SEC_COLORS = {
  role:     { color:'#A78BFA', r:167, g:139, b:250, bg:'rgba(167,139,250,.12)' },
  ctx:      { color:'#34D399', r:52,  g:211, b:153, bg:'rgba(52,211,153,.1)' },
  task:     { color:'#F7C948', r:247, g:201, b:72,  bg:'rgba(247,201,72,.1)' },
  instr:    { color:'#60A5FA', r:96,  g:165, b:250, bg:'rgba(96,165,250,.1)' },
  ex:       { color:'#F87171', r:248, g:113, b:113, bg:'rgba(248,113,113,.1)' },
  fmt:      { color:'#22D3EE', r:34,  g:211, b:238, bg:'rgba(34,211,238,.1)' },
  tone:     { color:'#F472B6', r:244, g:114, b:182, bg:'rgba(244,114,182,.1)' },
  style:    { color:'#818CF8', r:129, g:140, b:248, bg:'rgba(129,140,248,.12)' },
  cnstr:    { color:'#FB923C', r:251, g:146, b:60,  bg:'rgba(251,146,60,.1)' },
  audience: { color:'#A3E635', r:163, g:230, b:53,  bg:'rgba(163,230,53,.1)' }
};

// ════════════════════════════════════════════════
//  FRAMEWORK DEFINITIONS
// ════════════════════════════════════════════════

const FW = {
  custom: {
    name:'Custom (Full)', icon:'⚙',
    desc:'Your own 8-section structure — maximum control and flexibility.',
    when:'Complex prompts where you need all levers.',
    letters:[{l:'Role',c:'#A78BFA'},{l:'Context',c:'#34D399'},{l:'Task',c:'#F7C948'},{l:'Instructions',c:'#60A5FA'},{l:'Examples',c:'#F87171'},{l:'Format',c:'#22D3EE'},{l:'Tone',c:'#F472B6'},{l:'Constraints',c:'#FB923C'}],
    sections:[{base:'role'},{base:'ctx'},{base:'task'},{base:'instr'},{base:'ex'},{base:'fmt'},{base:'tone'},{base:'cnstr'}]
  },
  risen: {
    name:'RISEN', icon:'📐',
    desc:'Role · Instructions · Steps · End Goal · Narrowing. Best for structured, multi-step execution.',
    when:'Multi-step tasks where execution order matters; instruction-heavy prompts.',
    letters:[{l:'R: Role',c:'#A78BFA'},{l:'I: Instructions',c:'#60A5FA'},{l:'S: Steps',c:'#34D399'},{l:'E: End Goal',c:'#F7C948'},{l:'N: Narrowing',c:'#FB923C'}],
    sections:[
      {base:'role'},
      {base:'instr', overrides:{tag:'Instructions',title:'Instructions + Steps'}},
      {base:'task',  overrides:{tag:'End Goal',title:'End Goal',ph:'What is the final outcome you need? Describe the desired end state clearly.'}},
      {base:'ex',    overrides:{tag:'Steps',title:'Concrete Steps',ph:'List the specific numbered steps the AI should take to achieve the End Goal.'}},
      {base:'cnstr', overrides:{tag:'Narrowing',title:'Narrowing (Scope)',ph:'Narrow the scope. What should be excluded, limited, or constrained?\n\n- Limit to...\n- Exclude...\n- Stay within...'}}
    ]
  },
  costar: {
    name:'CO-STAR', icon:'⭐',
    desc:'Context · Objective · Style · Tone · Audience · Response. Built for writing tasks with specific audiences.',
    when:'Content creation, marketing, communications — anytime the reader matters as much as the task.',
    letters:[{l:'C: Context',c:'#34D399'},{l:'O: Objective',c:'#F7C948'},{l:'S: Style',c:'#818CF8'},{l:'T: Tone',c:'#F472B6'},{l:'A: Audience',c:'#A3E635'},{l:'R: Response',c:'#22D3EE'}],
    sections:[
      {base:'ctx'},
      {base:'task',  overrides:{tag:'Objective',title:'Objective',ph:'What is the single objective? State the desired output clearly and specifically.'}},
      {base:'style'},
      {base:'tone'},
      {base:'audience'},
      {base:'fmt',   overrides:{tag:'Response',title:'Response Format'}}
    ]
  },
  rtf: {
    name:'RTF (Minimal)', icon:'⚡',
    desc:'Role · Task · Format. The fastest, leanest prompt structure.',
    when:'Quick, well-defined tasks where you trust the model\'s defaults on tone and constraints.',
    letters:[{l:'R: Role',c:'#A78BFA'},{l:'T: Task',c:'#F7C948'},{l:'F: Format',c:'#22D3EE'}],
    sections:[{base:'role'},{base:'task'},{base:'fmt'}]
  },
  tag: {
    name:'TAG (Micro)', icon:'🏷',
    desc:'Task · Action · Goal. Ultra-minimal — no role, no format. For fast iteration.',
    when:'Chat-style prompting, quick experiments, or when you\'re iterating rapidly.',
    letters:[{l:'T: Task',c:'#F7C948'},{l:'A: Action',c:'#60A5FA'},{l:'G: Goal',c:'#34D399'}],
    sections:[
      {base:'task'},
      {base:'instr', overrides:{tag:'Action',title:'Action',ph:'What specific action should be taken? What are the concrete steps or method?\n\n- Action 1\n- Action 2'}},
      {base:'ex',    overrides:{tag:'Goal',title:'Goal',ph:'What is the desired goal or outcome? What does success look like?'}}
    ]
  },
  crispe: {
    name:'CRISPE', icon:'🔬',
    desc:'Capacity & Role · Insight · Statement · Personality · Experiment. Iterative and exploratory.',
    when:'Exploratory tasks, creative work, or when you want the model to try variations and self-evaluate.',
    letters:[{l:'C: Capacity & Role',c:'#A78BFA'},{l:'R: Insight',c:'#60A5FA'},{l:'I: Statement',c:'#F7C948'},{l:'S: Personality',c:'#F472B6'},{l:'P: Experiment',c:'#34D399'}],
    sections:[
      {base:'role',  overrides:{tag:'Capacity & Role',title:'Capacity & Role',ph:'Define the AI\'s capacity and role. Be specific about its expertise, perspective, and authority level.'}},
      {base:'ctx',   overrides:{tag:'Insight',title:'Insight (Context)',ph:'Provide insight and context. What background knowledge does the AI need to form a good perspective?'}},
      {base:'task',  overrides:{tag:'Statement',title:'Statement (Task)',ph:'State exactly what you need. Be direct and specific — this is the core task statement.'}},
      {base:'tone',  overrides:{tag:'Personality',title:'Personality',ph:'Define the personality of the response. How should the AI come across to the reader?'}},
      {base:'ex',    overrides:{tag:'Experiment',title:'Experiment (Iterate)',ph:'What experiments or variations should the AI try?\n\ne.g. "Generate 3 different approaches, evaluate each against the stated criteria, then recommend the best one with your reasoning."'}}
    ]
  },
  ape: {
    name:'APE', icon:'🦾',
    desc:'Action · Purpose · Expectation. Purpose-first — forces you to articulate why.',
    when:'When context is obvious but purpose often isn\'t; short prompts where intent drives everything.',
    letters:[{l:'A: Action',c:'#F7C948'},{l:'P: Purpose',c:'#34D399'},{l:'E: Expectation',c:'#F87171'}],
    sections:[
      {base:'task', overrides:{tag:'Action',title:'Action',ph:'What action should be performed? State it as a verb-first command.\n\ne.g. "Write a...", "Analyse the...", "Rewrite this..."'}},
      {base:'ctx',  overrides:{tag:'Purpose',title:'Purpose',ph:'Why do you need this? What problem does it solve? What will you use this output for?\n\nThe purpose informs every choice the model makes.'}},
      {base:'fmt',  overrides:{tag:'Expectation',title:'Expectation',ph:'What does a successful output look like? Describe the format, quality bar, and any specific requirements.'}}
    ]
  }
};

// ════════════════════════════════════════════════
//  TECHNIQUES
// ════════════════════════════════════════════════

const TECHNIQUES = [
  { name:'Zero-Shot CoT',          cat:'reason',   catLabel:'Reasoning',
    desc:'Add "think step by step" to prompt the model to show its work before concluding. No examples needed.',
    when:['Logic or math problems','Multi-step reasoning tasks','When the model keeps giving the wrong answer'],
    snippet:'Before giving your final answer, think through this step by step, showing your reasoning.',
    injectTo:'instr' },
  { name:'Few-Shot Prompting',      cat:'reason',   catLabel:'Reasoning',
    desc:'Provide concrete input/output examples in your prompt. The most reliably high-impact technique.',
    when:['You have examples of good output','Task format is hard to describe','Consistent style or structure needed'],
    snippet:'See the Examples section above — fill it with 2–3 concrete input/output pairs.',
    injectTo:'ex' },
  { name:'Self-Consistency',        cat:'reason',   catLabel:'Reasoning',
    desc:'Run the same prompt multiple times and take the majority answer. Corrects errors through voting.',
    when:['High-stakes factual or analytical answers','Model gives different answers each run','Math, logic, or classification tasks'],
    snippet:'Generate 3 independent answers to this question. Then identify which answer appears most often and give me that as your final answer, with brief reasoning.',
    injectTo:'instr' },
  { name:'Tree of Thoughts (ToT)',  cat:'reason',   catLabel:'Reasoning',
    desc:'Prompt the model to explore multiple reasoning paths and evaluate them, like a decision tree.',
    when:['Complex decisions with multiple valid paths','Strategic planning','Creative problems with many possible directions'],
    snippet:'Imagine three different experts are answering this question. Each writes 1 step of their thinking, shares it, then the group continues. If any expert realises they are wrong, they leave. Continue until one path clearly wins.',
    injectTo:'instr' },
  { name:'Chain-of-Thought (CoT)',  cat:'reason',   catLabel:'Reasoning',
    desc:'Provide examples with the full reasoning chain shown, not just input/output. Teach the model to reason.',
    when:['Complex multi-step tasks','Arithmetic or logical reasoning','When zero-shot CoT is not enough'],
    snippet:'[In your Examples section, show complete reasoning traces:]\nInput: [question]\nThinking: [step 1] → [step 2] → [step 3]\nAnswer: [conclusion]',
    injectTo:'ex' },
  { name:'ReAct Prompting',         cat:'agentic',  catLabel:'Agentic',
    desc:'Interleave Reasoning and Acting: model produces a thought, takes an action, observes result, repeats.',
    when:['Agentic or tool-use prompts','Tasks requiring external information','Multi-step workflows with feedback loops'],
    snippet:'For each step: first write a Thought explaining your reasoning, then write an Action (what you would do or look up), then write an Observation (the result). Repeat until you have a final answer.',
    injectTo:'instr' },
  { name:'Prompt Chaining',         cat:'agentic',  catLabel:'Agentic',
    desc:'Break a complex task into sequential prompts where each output feeds the next. Better than one mega-prompt.',
    when:['Tasks too complex for a single prompt','When you need to verify intermediate outputs','Document processing pipelines'],
    snippet:'[Design as a chain:]\nPrompt 1: Extract relevant quotes from the document.\nPrompt 2: Given these quotes, answer the question.\n\n(Add to your instructions as a numbered pipeline.)',
    injectTo:'instr' },
  { name:'Generated Knowledge',     cat:'reason',   catLabel:'Reasoning',
    desc:'Ask the model to first generate relevant facts, then use those facts to answer. Reduces hallucination.',
    when:['Topics where accuracy matters','Commonsense or domain knowledge tasks','When the model tends to hallucinate'],
    snippet:'Step 1: List 5 key facts you know about [topic] that are relevant to this question.\nStep 2: Using only those facts, answer the question.',
    injectTo:'instr' },
  { name:'RAG (Retrieval Augmented)',cat:'retrieve', catLabel:'Retrieval',
    desc:'Supply retrieved documents or data directly in the prompt. Ground the model in real, current sources.',
    when:['Tasks requiring current or proprietary information','Reducing hallucination on factual queries','QA over specific documents'],
    snippet:'Use only the information in the document below to answer the question. If the answer is not in the document, say "I don\'t know."\n\n---\n[DOCUMENT]\n{paste document here}\n---',
    injectTo:'ctx' },
  { name:'PAL (Program-Aided)',      cat:'reason',   catLabel:'Reasoning',
    desc:'Ask the model to write code to solve the problem, then execute it. Separates reasoning from computation.',
    when:['Math, statistics, or data manipulation','Tasks with clear algorithmic solutions','When calculation errors are unacceptable'],
    snippet:'Solve this by writing Python code that performs the calculation. Show the code, then show the result. Do not compute in your head — write code.',
    injectTo:'instr' },
  { name:'Metacognitive Prompting',  cat:'reason',   catLabel:'Reasoning',
    desc:'Ask the model to reflect on what it knows before answering, or to critique its own output.',
    when:['Uncertain or nuanced topics','When you want balanced, accurate analysis','Self-improvement loops'],
    snippet:'Before answering: what do you know well about this topic, and what are you uncertain about? Then answer, flagging your confidence level on key claims.',
    injectTo:'instr' },
  { name:'Context Engineering',      cat:'context',  catLabel:'Context',
    desc:'The 2025 discipline beyond prompt engineering: deliberately filling the model\'s context window with the right information at the right time.',
    when:['Long-context tasks','Agentic systems with memory','When prompt engineering alone isn\'t enough'],
    snippet:'[Not a prompt pattern — a system design principle]\nStructure your context window deliberately:\n1. System identity (role + rules)\n2. Relevant retrieved documents\n3. Conversation history\n4. Current task + instructions\n5. Output format\n\nOrder matters. More recent = more weight.',
    injectTo:'ctx' }
];

// ════════════════════════════════════════════════
//  DEFAULT SNIPPETS
// ════════════════════════════════════════════════

const DEFAULT_SNIPS = {
  role:[
    'Act as a senior software engineer with 12 years of experience in distributed backend systems. You are pragmatic, prefer simple solutions over clever ones, and think carefully about edge cases before recommending anything.',
    'Act as an experienced B2B content strategist. You write for busy decision-makers, avoid jargon, lead with the reader\'s pain point, and always have a clear CTA.',
    'Act as a data analyst who communicates complex findings clearly to non-technical stakeholders. You are precise, sceptical of weak correlations, and always explain your assumptions.'
  ],
  ctx:[
    'We are a [stage] startup building [product] for [target customer]. Our main customer pain is [pain]. We are [timeline] from [milestone]. The key constraint is [constraint].',
    'I am preparing [deliverable] for [audience]. Previous attempts had [problem]. The key requirement this time is [key requirement].',
    'This is a [draft/final] version. The audience is [description]. They know [level of knowledge] about this topic. They care most about [priority].'
  ],
  task:[
    'Write a [type] that [achieves X] for [audience], in [length/format].',
    'Analyse [subject] and identify [what to find]. The output should be actionable and prioritised.',
    'Review the following [thing] and provide specific, prioritised feedback on [aspects to evaluate].'
  ],
  instr:[
    '1. [First step]\n2. [Second step]\n3. [Third step]\n\nRules:\n- [Rule 1]\n- [Rule 2]',
    'Follow this structure:\n- Section 1: [what goes here]\n- Section 2: [what goes here]\n- Section 3: [what goes here]\n\nMax length: [X] words.',
    'Think step by step before giving your final answer. Show your reasoning, then conclude.'
  ],
  ex:[
    'Input: "[example input 1]"\nOutput: "[example output 1]"\n\nInput: "[example input 2]"\nOutput: "[example output 2]"',
    'Good example:\n"[good example text]"\n\nBad example (avoid this):\n"[bad example text]"\n\nWhy: [explanation]',
    'Q: [sample question]\nA: [ideal answer demonstrating the style, depth, and format you want]'
  ],
  fmt:[
    'Return a JSON array. Each object: { "key": "value" }. No markdown, no commentary — only the JSON.',
    'Format as a markdown document with H2 headings for each section. Max [X] words total. Use bullet lists only for lists of 3+ items.',
    'Plain prose only. No headings, no bullets. [X] paragraphs, each under [Y] sentences. Active voice throughout.'
  ],
  tone:[
    'Confident and direct. No hedging. No filler phrases. Write as if the reader\'s time is limited.',
    'Warm and conversational. Like a knowledgeable friend explaining something — not a textbook.',
    'Dry, precise, technical. Assume the reader is expert-level. Skip explanations of obvious things.'
  ],
  style:[
    'Journalistic. Lead with the most important fact. Short paragraphs. Inverted pyramid structure.',
    'Conversational and narrative. First-person perspective, build tension, resolve it.',
    'Academic and structured. Thesis first, evidence second, synthesis third.'
  ],
  cnstr:[
    '- Do not exceed [X] words\n- Do not use passive voice\n- Do not open with "I"\n- No buzzwords: "innovative", "seamless", "leverage"',
    '- Stay within the scope of [topic area]\n- Do not mention [competitor/topic to avoid]\n- Do not make claims that cannot be verified',
    '- Do not use bullet points in [section]\n- Do not include introductory or closing pleasantries\n- Do not repeat information already stated'
  ],
  audience:[
    '[Job title] at [company type]. They are [technical level]. They care about [priorities]. They are sceptical of [concerns].',
    'Non-technical business owners at SMBs. They make decisions based on ROI and ease of use, not features.',
    'Senior engineers and technical leads. Skip basic explanations. They value precision, tradeoffs, and honesty about limitations.'
  ]
};

// ════════════════════════════════════════════════
//  STATE
// ════════════════════════════════════════════════

const ST = { fw:'custom', mode:'write', vals:{}, on:{}, snips:{}, techFilter:'all' };
Object.keys(SEC_DEFS).forEach(id => { ST.vals[id]=''; ST.on[id]=true; });

const STORAGE_KEY = 'pp4';

function loadST() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    if(d.vals)  Object.assign(ST.vals,  d.vals);
    if(d.on)    Object.assign(ST.on,    d.on);
    if(d.fw)    ST.fw   = d.fw;
    if(d.snips) ST.snips= d.snips;
  } catch(_) {}
}
function saveST() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({vals:ST.vals,on:ST.on,fw:ST.fw,snips:ST.snips}));
}

// ════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════

function currentFW() { return FW[ST.fw] || FW.custom; }

function currentSections() {
  return currentFW().sections.map((s,idx) => {
    const base = SEC_DEFS[s.base];
    if(!base){ console.warn('Unknown section:', s.base); return null; }
    const ov = s.overrides||{};
    const secId = ov.id||s.base;
    const title = ov.title||base.title;
    return { idx, baseId:s.base, secId, tag:ov.tag||base.tag, title,
             wm:title.split('/')[0].trim().toUpperCase().substring(0,10),
             ph:ov.ph||base.ph, tip:base.tip };
  }).filter(Boolean);
}

function getVal(sec) {
  return ST.vals[sec.secId]!==undefined ? ST.vals[sec.secId] : (ST.vals[sec.baseId]||'');
}
function setVal(sec, v) { ST.vals[sec.secId]=v; ST.vals[sec.baseId]=v; }
function activeSecs()   { return currentSections().filter(s=>ST.on[s.secId]&&getVal(s).trim()); }
function assembleText() { return activeSecs().map(s=>`## ${s.title}\n\n${getVal(s)}`).join('\n\n---\n\n'); }
function snipsFor(baseId,secId) { return [...(DEFAULT_SNIPS[baseId]||[]),...(ST.snips[secId]||ST.snips[baseId]||[])]; }

function completionStats() {
  const secs = currentSections();
  const filled = secs.filter(s=>getVal(s).trim()).length;
  return { filled, total:secs.length, pct:secs.length?Math.round(filled/secs.length*100):0 };
}

function escH(s)    { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escAttr(s) { return String(s).replace(/'/g,'&#39;').replace(/"/g,'&quot;'); }

// ════════════════════════════════════════════════
//  THEME
// ════════════════════════════════════════════════

function getTheme() { return localStorage.getItem('pp-theme')||'dark'; }

function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem('pp-theme', t);
  const btn = document.getElementById('theme-btn');
  if(btn) btn.innerHTML = t==='dark'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
}

function toggleTheme() { applyTheme(getTheme()==='dark'?'light':'dark'); }

// ════════════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════════════

let _tt;
function toast(msg, type='ok') {
  const el  = document.getElementById('toast');
  const msg_ = document.getElementById('toast-msg');
  msg_.textContent = msg;
  el.className = 'toast up'+(type==='err'?' err':'');
  clearTimeout(_tt);
  _tt = setTimeout(()=>el.classList.remove('up'), 2800);
}

// ════════════════════════════════════════════════
//  BUILD HEADER
// ════════════════════════════════════════════════

function buildHeader() {
  const stats = completionStats();
  const fwOptions = Object.entries(FW)
    .map(([k,f])=>`<option value="${k}"${ST.fw===k?' selected':''}>${escH(f.name)}</option>`)
    .join('');
  const theme = getTheme();

  document.getElementById('hdr').innerHTML = `
    <button class="mob-menu-btn" onclick="openMobileSb()" aria-label="Open menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
    <a class="logo" href="#" onclick="return false">
      <div class="logo-icon"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
      PromptPad
      <span class="ver">v3</span>
    </a>
    <div class="fw-wrap">
      <span class="fw-lbl">Framework</span>
      <select class="fw-sel" id="fw-sel" onchange="changeFw(this.value)">${fwOptions}</select>
    </div>
    <div class="tabs">
      <button class="tab-btn${ST.mode==='write'   ?' on':''}" onclick="mode('write')">Write</button>
      <button class="tab-btn${ST.mode==='preview' ?' on':''}" onclick="mode('preview')">Preview</button>
      <button class="tab-btn${ST.mode==='assemble'?' on':''}" onclick="mode('assemble')">Assemble</button>
      <button class="tab-btn${ST.mode==='guide'   ?' on':''}" onclick="mode('guide')">Guide</button>
    </div>
    <div class="sp"></div>
    <div class="hdr-progress" title="${stats.filled} of ${stats.total} sections filled">
      <div class="progress-track"><div class="progress-fill" style="width:${stats.pct}%"></div></div>
      <span class="progress-label">${stats.filled}/${stats.total}</span>
    </div>
    <div class="hdr-acts">
      <button class="btn icon-only" id="theme-btn" onclick="toggleTheme()" title="Toggle light/dark theme"></button>
      <button class="btn" onclick="shareURL()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        Share
      </button>
      <button class="btn" onclick="doLoad()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Load
      </button>
      <button class="btn" onclick="doExport()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Export
      </button>
      <button class="btn" onclick="doClear()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
        Clear
      </button>
      <button class="btn primary" onclick="copyFull()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Copy Prompt
      </button>
    </div>`;

  applyTheme(theme); // sets the icon on the newly built button
}

// ════════════════════════════════════════════════
//  BUILD SIDEBAR
// ════════════════════════════════════════════════

function buildSb() {
  const secs  = currentSections();
  const stats = completionStats();

  const navItems = secs.map(s => {
    const col = (SEC_COLORS[s.baseId]||SEC_COLORS.role).color;
    const filled = getVal(s).trim();
    return `
      <div class="ni${ST.on[s.secId]?'':' off'}${filled?' has-content':''}" id="nav-${s.idx}" onclick="scrollToCard(${s.idx})">
        <span class="ni-dot-col" style="background:${col}"></span>
        <span class="ni-num">${String(s.idx+1).padStart(2,'0')}</span>
        <span>${s.title}</span>
        <span class="ni-fill"></span>
      </div>`;
  }).join('');

  const quickInject = TECHNIQUES.slice(0,4).map(t=>`
    <div class="inject-pill" onclick="injectTech('${escAttr(t.injectTo)}','${escAttr(t.snippet)}','${escAttr(t.name)}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
      ${escH(t.name)}
    </div>`).join('');

  document.getElementById('sb').innerHTML = `
    <div class="sb-head">
      <div class="sb-fw-name">${escH(currentFW().name)}</div>
      <div class="sb-progress">
        <div class="sb-progress-track"><div class="sb-progress-fill" style="width:${stats.pct}%"></div></div>
        <span class="sb-progress-label">${stats.pct}% done</span>
      </div>
    </div>
    <div class="sb-lbl">Sections</div>
    ${navItems}
    <div class="sb-div"></div>
    <div class="sb-section">
      <div class="sb-qi-title">Quick Inject</div>
      ${quickInject}
      <div class="inject-pill" style="border-style:dashed" onclick="mode('guide')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        All Techniques →
      </div>
    </div>
    <div class="sb-foot">
      <div class="sb-hint">Click <strong style="color:var(--acc3)">ⓘ</strong> to learn a section. Click <strong style="color:var(--acc)">📚</strong> for snippet starters.</div>
      <div style="display:flex;align-items:center;gap:4px;margin-top:8px">
        <span class="kbd">⌘</span><span class="kbd">↵</span>
        <span style="font-size:11px;color:var(--dim);margin-left:2px">copy prompt</span>
      </div>
    </div>`;
}

// ════════════════════════════════════════════════
//  FRAMEWORK BANNER
// ════════════════════════════════════════════════

function buildFwBanner() {
  const fw = currentFW();
  const el = document.getElementById('fw-banner');
  if(!el) return;
  if(ST.fw==='custom'){ el.innerHTML=''; return; }
  const letters = fw.letters.map(l=>`<span class="fw-letter" style="color:${l.c};border-color:${l.c}33;background:${l.c}11">${escH(l.l)}</span>`).join('');
  el.innerHTML = `
    <div class="fw-banner">
      <div class="fw-banner-icon">${fw.icon}</div>
      <div>
        <div class="fw-banner-name">${escH(fw.name)}</div>
        <div class="fw-banner-desc">${escH(fw.desc)}</div>
        <div class="fw-banner-letters">${letters}</div>
      </div>
    </div>`;
}

// ════════════════════════════════════════════════
//  BUILD CARDS
// ════════════════════════════════════════════════

function buildCards() {
  const secs = currentSections();
  document.getElementById('cards').innerHTML = secs.map(s=>cardHTML(s)).join('');
  secs.forEach(s => {
    const ta = document.getElementById('ta-'+s.idx);
    if(ta && ta.value){ ta.style.height='auto'; ta.style.height=Math.max(100,ta.scrollHeight)+'px'; }
  });
}

function cardHTML(s) {
  const val  = getVal(s);
  const col  = SEC_COLORS[s.baseId]||SEC_COLORS.role;
  const snips = snipsFor(s.baseId, s.secId);
  const snipItems = snips.map((txt,si)=>`
    <div class="snip-item" onclick="useSnip(${s.idx},${si})">
      <div class="snip-text">${escH(txt)}</div>
      <div class="snip-use">Use</div>
    </div>`).join('');

  return `
  <div class="sc${ST.on[s.secId]?'':' off'}" id="card-${s.idx}"
       style="--sec-color:${col.color};--sec-r:${col.r};--sec-g:${col.g};--sec-b:${col.b}">
    <div class="sc-stripe" style="background:${col.color}"></div>
    <div class="sc-hdr">
      <span class="sc-num">${String(s.idx+1).padStart(2,'0')}</span>
      <span class="sc-tag" style="color:${col.color};background:${col.bg};border-color:${col.color}33">${escH(s.tag)}</span>
      <span class="sc-ttl">${escH(s.title)}</span>
      <div class="sc-acts">
        <button class="ic info" title="Learn about this section" onclick="flipTip(${s.idx})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </button>
        <button class="ic snip" title="Snippets" onclick="toggleSnip(event,${s.idx})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
        </button>
        <button class="ic cp" title="Copy section" onclick="copySec(${s.idx})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        </button>
        <button class="tgl${ST.on[s.secId]?' on':''}" id="tgl-${s.idx}"
                onclick="flipOn(${s.idx},'${escAttr(s.secId)}')" title="Toggle section">
          <div class="tgl-th"></div>
        </button>
        <div class="snip-drop" id="sd-${s.idx}">
          <div class="snip-hdr-row">
            <span class="snip-title">${escH(s.title)}</span>
            <span style="font-size:11px;color:var(--dim)">${snips.length} snippets</span>
          </div>
          ${snipItems||'<p style="font-size:12px;color:var(--dim);padding:4px 0">No snippets yet.</p>'}
          <button class="snip-save" onclick="saveSnip(${s.idx},'${escAttr(s.secId)}','${escAttr(s.baseId)}')">+ Save current text as snippet</button>
        </div>
      </div>
    </div>
    <div class="ew">
      <div class="wm${val?' gone':''}" id="wm-${s.idx}">${escH(s.wm)}</div>
      <textarea class="ta" id="ta-${s.idx}"
        placeholder="${escAttr(s.ph)}" rows="5"
        data-idx="${s.idx}" data-secid="${escAttr(s.secId)}" data-baseid="${escAttr(s.baseId)}"
        oninput="onInp(${s.idx},this)" onfocus="onFoc(${s.idx})" onblur="onBlr(${s.idx})"
      >${escH(val)}</textarea>
    </div>
    <div class="cc" id="cc-${s.idx}">${val.length} chars</div>
    <div class="tip-panel" id="tip-${s.idx}">
      <div class="tip-h what">📌 What is this?</div><p>${escH(s.tip.what)}</p>
      <div class="tip-h why" style="margin-top:10px">🧠 Why it matters</div><p>${escH(s.tip.why)}</p>
      <div class="tip-h ex" style="margin-top:10px">✍️ Example</div>
      <div class="tip-ex">${escH(s.tip.ex)}</div>
    </div>
  </div>`;
}

// ════════════════════════════════════════════════
//  GUIDE PANEL
// ════════════════════════════════════════════════

function buildGuide() {
  const fwCards = Object.entries(FW).map(([k,fw])=>`
    <div class="fw-card${ST.fw===k?' active':''}" onclick="changeFw('${k}');mode('write')">
      <div class="fw-card-icon">${fw.icon}</div>
      <div class="fw-card-name">${escH(fw.name)}</div>
      <div class="fw-card-count">${fw.sections.length} sections</div>
      <div class="fw-card-when">${escH(fw.when)}</div>
      <div class="fw-letters">${fw.letters.map(l=>`<span class="fw-l" style="color:${l.c};border-color:${l.c}33;background:${l.c}11">${escH(l.l)}</span>`).join('')}</div>
    </div>`).join('');

  const decRows = [
    ['Quick, well-defined task','RTF or TAG','Lean structure; model fills sensible defaults'],
    ['Complex, multi-step task','RISEN or Custom','Need full instructions + explicit end goal'],
    ['Writing for a specific audience','CO-STAR','Audience field forces you to define the reader'],
    ['Exploratory / iterative task','CRISPE','Experiment field prompts self-evaluation'],
    ['Purpose-first / intent-driven','APE','Forces you to articulate why before what'],
    ['Reasoning or math','CoT + Custom','Add "think step by step" to Instructions'],
    ['You have good examples','Few-Shot (Custom)','Fill Examples section — often beats instructions alone'],
    ['Model keeps making same mistake','Constraints + CoT','Explicit Constraints + reasoning instruction'],
    ['High-stakes factual answer','Self-Consistency','Run 3×; take majority answer'],
    ['Multi-tool or agentic workflow','ReAct','Thought/Action/Observation loop in Instructions'],
    ['Complex task, breakable','Prompt Chaining','Split into sequential prompts; outputs chain'],
    ['Requires current/proprietary data','RAG','Paste retrieved docs into Context section'],
    ['Math/data manipulation','PAL','Ask for Python code solution in Instructions'],
    ['Need multiple options evaluated','Tree of Thoughts','Three-expert prompt in Instructions'],
    ['Uncertainty/hallucination risk','Generated Knowledge','Two-step: generate facts, then answer'],
    ['Long-context agentic systems','Context Engineering','Design what goes in context window and in what order'],
  ];

  const catMap = { reason:'cat-reason', retrieve:'cat-retrieve', agentic:'cat-agentic', optim:'cat-optim', context:'cat-context' };

  // FIX: use data-cat attribute for reliable matching (not textContent)
  const filterChips = [
    ['all','All'],['reason','Reasoning'],['retrieve','Retrieval'],['agentic','Agentic'],['context','Context']
  ].map(([val,label])=>
    `<button class="filter-chip${ST.techFilter===val?' on':''}" data-cat="${val}" onclick="filterTech('${val}')">${escH(label)}</button>`
  ).join('');

  const techCards = TECHNIQUES.map(t=>`
    <div class="tech-card${ST.techFilter!=='all'&&t.cat!==ST.techFilter?' hidden':''}" data-cat="${t.cat}">
      <div class="tech-top">
        <div style="flex:1"><div class="tech-name">${escH(t.name)}</div></div>
        <span class="tech-cat ${catMap[t.cat]||'cat-reason'}">${escH(t.catLabel)}</span>
      </div>
      <div class="tech-desc">${escH(t.desc)}</div>
      <div class="tech-when">
        <div class="tech-when-label">Use when:</div>
        ${t.when.map(w=>`<span class="tech-tag">${escH(w)}</span>`).join('')}
      </div>
      <div class="tech-snippet">${escH(t.snippet)}</div>
      <div class="tech-actions">
        <button class="tech-btn" onclick="copyText('${escAttr(t.snippet)}','${escAttr(t.name)} copied!')">Copy snippet</button>
        <button class="tech-btn inject" onclick="injectTech('${escAttr(t.injectTo)}','${escAttr(t.snippet)}','${escAttr(t.name)}')">→ Inject into prompt</button>
      </div>
    </div>`).join('');

  document.getElementById('p-guide').innerHTML = `
    <div class="g-title">Choose a Framework</div>
    <div class="g-desc">Click any card to switch. All written content is preserved when you switch.</div>
    <div class="fw-grid">${fwCards}</div>

    <div class="g-title">When to Use What</div>
    <div class="g-desc">Match your situation to the right approach. Frameworks and techniques stack.</div>
    <div class="dec-wrap">
      <table class="dec-table">
        <thead><tr><th>Situation</th><th>Best Approach</th><th>Why</th></tr></thead>
        <tbody>${decRows.map(([c,a,w])=>`<tr><td>${escH(c)}</td><td><span style="color:var(--acc);font-weight:600">${escH(a)}</span></td><td style="color:var(--sub)">${escH(w)}</td></tr>`).join('')}</tbody>
      </table>
    </div>

    <div class="g-title">Advanced Techniques</div>
    <div class="g-desc">These change how the model reasons — not just what information you give it.</div>
    <div class="tech-filter">${filterChips}</div>
    <div class="tech-grid" id="tech-grid">${techCards}</div>`;
}

// ════════════════════════════════════════════════
//  PREVIEW & ASSEMBLE
// ════════════════════════════════════════════════

function renderPreview() {
  const secs = activeSecs();
  const el = document.getElementById('p-preview');
  if(!secs.length){
    el.innerHTML=`<div class="pv-card"><p style="color:var(--sub);font-style:italic;font-size:13px">Nothing written yet — switch to Write and fill in some sections.</p></div>`;
    return;
  }
  el.innerHTML = `<div class="pv-card">
    <div class="pv-hdr">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      Preview — ${escH(currentFW().name)}
    </div>
    ${secs.map((s,i)=>{
      const col = (SEC_COLORS[s.baseId]||SEC_COLORS.role).color;
      return `<div class="pv-sec">
        <div class="pv-lbl" style="color:${col}">
          <span class="pv-lbl-dot" style="background:${col}"></span>
          ${escH(s.tag)} — ${escH(s.title)}
        </div>
        <div class="pv-body">${marked.parse(getVal(s))}</div>
      </div>${i<secs.length-1?'<hr class="pv-div">':''}`;
    }).join('')}
  </div>`;
}

function renderAssemble() {
  const txt = assembleText();
  document.getElementById('as-out').textContent = txt||'Nothing written yet.';
  const words = txt.trim()?txt.trim().split(/\s+/).length:0;
  document.getElementById('as-w').textContent = words.toLocaleString();
  document.getElementById('as-c').textContent = txt.length.toLocaleString();
  document.getElementById('as-t').textContent = Math.round(txt.length/4).toLocaleString();
}

// ════════════════════════════════════════════════
//  MODE SWITCHING
// ════════════════════════════════════════════════

function mode(m) {
  ST.mode = m;
  ['write','preview','assemble','guide'].forEach(x=>{
    document.getElementById('p-'+x).classList.toggle('active', x===m);
  });
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.classList.toggle('on', btn.textContent.trim().toLowerCase()===m);
  });
  document.querySelectorAll('.mob-tab').forEach(btn=>{
    btn.classList.toggle('on', btn.dataset.mode===m);
  });
  if(m==='preview')  renderPreview();
  if(m==='assemble') renderAssemble();
  if(m==='guide')    buildGuide();
  closeMobileSb();
}

// ════════════════════════════════════════════════
//  INPUT EVENTS
// ════════════════════════════════════════════════

function onInp(idx, el) {
  const sec = currentSections()[idx];
  if(!sec) return;
  setVal(sec, el.value);
  el.style.height='auto';
  el.style.height=Math.max(100,el.scrollHeight)+'px';
  document.getElementById('wm-'+idx)?.classList.toggle('gone', !!el.value.trim());
  document.getElementById('cc-'+idx).textContent = el.value.length+' chars';
  const nav = document.getElementById('nav-'+idx);
  if(nav) nav.classList.toggle('has-content', !!el.value.trim());
  updateProgress();
  saveST();
}

function onFoc(idx) { document.getElementById('nav-'+idx)?.classList.add('lit'); }
function onBlr(idx) { document.getElementById('nav-'+idx)?.classList.remove('lit'); }

function updateProgress() {
  const { filled, total, pct } = completionStats();
  const pf  = document.querySelector('.progress-fill');
  const pl  = document.querySelector('.progress-label');
  const spf = document.querySelector('.sb-progress-fill');
  const spl = document.querySelector('.sb-progress-label');
  if(pf)  pf.style.width  = pct+'%';
  if(pl)  pl.textContent  = `${filled}/${total}`;
  if(spf) spf.style.width = pct+'%';
  if(spl) spl.textContent = pct+'% done';
}

// ════════════════════════════════════════════════
//  CARD ACTIONS
// ════════════════════════════════════════════════

function flipTip(idx) { document.getElementById('tip-'+idx)?.classList.toggle('show'); }

function flipOn(idx, secId) {
  ST.on[secId] = !ST.on[secId];
  document.getElementById('card-'+idx)?.classList.toggle('off', !ST.on[secId]);
  document.getElementById('tgl-'+idx)?.classList.toggle('on', ST.on[secId]);
  document.getElementById('nav-'+idx)?.classList.toggle('off', !ST.on[secId]);
  saveST();
}

function scrollToCard(idx) {
  document.getElementById('card-'+idx)?.scrollIntoView({behavior:'smooth',block:'center'});
  closeMobileSb();
}

// ════════════════════════════════════════════════
//  SNIPPETS
// ════════════════════════════════════════════════

function toggleSnip(e, idx) {
  e.stopPropagation();
  const drop = document.getElementById('sd-'+idx);
  const isOpen = drop.classList.contains('open');
  document.querySelectorAll('.snip-drop.open').forEach(d=>d.classList.remove('open'));
  if(!isOpen){
    drop.classList.add('open');
    const rect = drop.getBoundingClientRect();
    drop.classList.toggle('flip', window.innerHeight - rect.top < 280);
  }
}

document.addEventListener('click', ()=>document.querySelectorAll('.snip-drop.open').forEach(d=>d.classList.remove('open')));

function useSnip(idx, si) {
  const sec = currentSections()[idx];
  if(!sec) return;
  const txt = snipsFor(sec.baseId, sec.secId)[si];
  if(!txt) return;
  const ta = document.getElementById('ta-'+idx);
  if(ta){ ta.value=txt; onInp(idx,ta); }
  document.getElementById('sd-'+idx)?.classList.remove('open');
  toast('Snippet applied');
}

function saveSnip(idx, secId, baseId) {
  const ta  = document.getElementById('ta-'+idx);
  const txt = ta?.value.trim();
  if(!txt){ toast('Section is empty — nothing to save','err'); return; }
  if(!ST.snips[secId]) ST.snips[secId]=[];
  if(ST.snips[secId].includes(txt)){ toast('Already saved'); return; }
  ST.snips[secId].push(txt);
  saveST();
  // Patch dropdown in-place — no full rebuild needed
  const drop = document.getElementById('sd-'+idx);
  if(drop){
    const countEl = drop.querySelector('span[style]');
    const newCount = snipsFor(baseId,secId).length;
    if(countEl) countEl.textContent = newCount+' snippets';
    const saveBtn = drop.querySelector('.snip-save');
    const newItem = document.createElement('div');
    newItem.className = 'snip-item';
    newItem.onclick = ()=>useSnip(idx, newCount-1);
    newItem.innerHTML = `<div class="snip-text">${escH(txt)}</div><div class="snip-use">Use</div>`;
    saveBtn.parentNode.insertBefore(newItem, saveBtn);
  }
  toast('Saved as snippet!');
}

// ════════════════════════════════════════════════
//  TECHNIQUE INJECT + FILTER
// ════════════════════════════════════════════════

function injectTech(targetBaseId, snippet, name) {
  const secs = currentSections();
  const target = secs.find(s=>s.baseId===targetBaseId)||secs[secs.length-1];
  if(!target) return;
  const ta = document.getElementById('ta-'+target.idx);
  if(!ta){ toast('Switch to Write tab first','err'); return; }
  const decoded = snippet.replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  const existing = ta.value.trim();
  ta.value = existing ? `${existing}\n\n[${name}]\n${decoded}` : `[${name}]\n${decoded}`;
  onInp(target.idx, ta);
  if(ST.mode!=='write') mode('write');
  setTimeout(()=>{ ta.scrollIntoView({behavior:'smooth',block:'center'}); ta.focus(); },150);
  toast(`${name} injected into ${target.title}`);
}

// FIX: use data-cat attribute — not textContent — for reliable matching
function filterTech(cat) {
  ST.techFilter = cat;
  document.querySelectorAll('.filter-chip').forEach(btn=>{
    btn.classList.toggle('on', btn.dataset.cat===cat);
  });
  document.querySelectorAll('.tech-card').forEach(card=>{
    card.classList.toggle('hidden', cat!=='all' && card.dataset.cat!==cat);
  });
}

// ════════════════════════════════════════════════
//  FRAMEWORK SWITCH
// ════════════════════════════════════════════════

function changeFw(k) {
  ST.fw = k;
  const sel = document.getElementById('fw-sel');
  if(sel) sel.value = k;
  saveST();
  buildSb(); buildFwBanner(); buildCards(); buildHeader();
  if(ST.mode==='guide') buildGuide();
}

// ════════════════════════════════════════════════
//  CLIPBOARD & FILE ACTIONS
// ════════════════════════════════════════════════

function copySec(idx) {
  const sec = currentSections()[idx];
  if(!sec) return;
  const v = getVal(sec);
  if(!v.trim()){ toast('Section is empty','err'); return; }
  navigator.clipboard.writeText(v).then(()=>{
    toast('Section copied!');
    const card = document.getElementById('card-'+idx);
    card?.classList.add('flashed');
    setTimeout(()=>card?.classList.remove('flashed'),500);
  });
}

function copyFull() {
  const txt = assembleText();
  if(!txt.trim()){ toast('Nothing to copy yet','err'); return; }
  navigator.clipboard.writeText(txt).then(()=>toast('Prompt copied! ✓'));
}

function copyText(txt, msg) {
  const decoded = txt.replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  navigator.clipboard.writeText(decoded).then(()=>toast(msg||'Copied!'));
}

function doClear() {
  if(!confirm('Clear all section content? This cannot be undone.')) return;
  Object.keys(ST.vals).forEach(k=>ST.vals[k]='');
  saveST(); buildCards(); updateProgress(); buildSb();
  toast('All cleared');
}

function doExport() {
  const txt = assembleText();
  if(!txt.trim()){ toast('Nothing to export','err'); return; }
  const full = `# PromptPad Export — ${currentFW().name}\n\n${txt}`;
  const b = new Blob([full],{type:'text/markdown'});
  const a = document.createElement('a');
  a.href=URL.createObjectURL(b); a.download='prompt.md'; a.click();
  toast('Exported as prompt.md');
}

function doLoad() { document.getElementById('file-inp').click(); }

document.getElementById('file-inp').addEventListener('change', function(e){
  const f = e.target.files[0]; if(!f) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    const txt = ev.target.result;
    const parts = txt.split(/^##\s+/m).slice(1);
    parts.forEach(part=>{
      const nl = part.indexOf('\n');
      const heading = part.slice(0,nl).trim();
      const body    = part.slice(nl+1).trim();
      // Direct reference to SEC_DEFS — no dynamic import needed
      Object.values(SEC_DEFS).forEach(def=>{
        if(def.title.toLowerCase()===heading.toLowerCase()||def.tag.toLowerCase()===heading.toLowerCase()){
          ST.vals[def.id]=body;
        }
      });
    });
    saveST(); buildCards(); updateProgress(); buildSb();
    toast('Loaded!');
  };
  reader.readAsText(f); this.value='';
});

// ════════════════════════════════════════════════
//  URL SHARE
// ════════════════════════════════════════════════

function shareURL() {
  try {
    const state   = {vals:ST.vals,on:ST.on,fw:ST.fw};
    const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
    const url     = `${location.origin}${location.pathname}#state=${encoded}`;
    navigator.clipboard.writeText(url).then(()=>toast('Share link copied!'));
  } catch(_){ toast('Could not generate share link','err'); }
}

function loadFromHash() {
  const hash = location.hash;
  if(!hash.startsWith('#state=')) return;
  try {
    const state = JSON.parse(decodeURIComponent(atob(hash.slice(7))));
    if(state.vals) Object.assign(ST.vals, state.vals);
    if(state.on)   Object.assign(ST.on,   state.on);
    if(state.fw)   ST.fw = state.fw;
    saveST();
    history.replaceState(null,'',location.pathname);
  } catch(_){}
}

// ════════════════════════════════════════════════
//  MOBILE
// ════════════════════════════════════════════════

function openMobileSb()  {
  document.getElementById('sb').classList.add('open');
  document.getElementById('mob-overlay').classList.add('visible');
  document.body.style.overflow='hidden';
}
function closeMobileSb() {
  document.getElementById('sb').classList.remove('open');
  document.getElementById('mob-overlay').classList.remove('visible');
  document.body.style.overflow='';
}

function buildMobTabs() {
  const tabs = [
    {mode:'write',    label:'Write',    icon:'<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>'},
    {mode:'preview',  label:'Preview',  icon:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'},
    {mode:'assemble', label:'Assemble', icon:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>'},
    {mode:'guide',    label:'Guide',    icon:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'},
  ];
  const el = document.getElementById('mob-tabs');
  if(!el) return;
  el.innerHTML = tabs.map(t=>`
    <button class="mob-tab${ST.mode===t.mode?' on':''}" data-mode="${t.mode}" onclick="mode('${t.mode}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${t.icon}</svg>
      ${t.label}
    </button>`).join('');
}

// ════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ════════════════════════════════════════════════

document.addEventListener('keydown', e=>{
  const mod = e.metaKey||e.ctrlKey;
  if(mod&&e.key==='Enter'){ e.preventDefault(); copyFull(); }
  if(mod&&e.key==='1'){ e.preventDefault(); mode('write'); }
  if(mod&&e.key==='2'){ e.preventDefault(); mode('preview'); }
  if(mod&&e.key==='3'){ e.preventDefault(); mode('assemble'); }
  if(mod&&e.key==='4'){ e.preventDefault(); mode('guide'); }
  if(e.key==='Escape'){
    document.querySelectorAll('.snip-drop.open').forEach(d=>d.classList.remove('open'));
    closeMobileSb();
  }
});

// ════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════

(function init() {
  loadST();
  loadFromHash();
  applyTheme(getTheme());

  buildHeader();
  buildSb();
  buildFwBanner();
  buildCards();
  buildMobTabs();

  ['write','preview','assemble','guide'].forEach(x=>{
    document.getElementById('p-'+x).classList.toggle('active', x===ST.mode);
  });

  if(ST.mode==='preview')  renderPreview();
  if(ST.mode==='assemble') renderAssemble();
  if(ST.mode==='guide')    buildGuide();
})();
