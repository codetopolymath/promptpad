// Per-section color palette. hex/r/g/b are applied as CSS custom properties
// on each card so the glow, tag, and stripe all derive from one source color.
export const SECTION_COLORS = {
  role:     { hex: '#9B8BFA', r: 155, g: 139, b: 250, background: 'rgba(155,139,250,.12)' },
  ctx:      { hex: '#2DD4A0', r: 45,  g: 212, b: 160, background: 'rgba(45,212,160,.1)'  },
  task:     { hex: '#E8B84B', r: 232, g: 184, b: 75,  background: 'rgba(232,184,75,.1)'  },
  instr:    { hex: '#7EB3FC', r: 126, g: 179, b: 252, background: 'rgba(126,179,252,.1)' },
  ex:       { hex: '#F87171', r: 248, g: 113, b: 113, background: 'rgba(248,113,113,.1)' },
  fmt:      { hex: '#5CC8D8', r: 92,  g: 200, b: 216, background: 'rgba(92,200,216,.1)'  },
  tone:     { hex: '#E077B0', r: 224, g: 119, b: 176, background: 'rgba(224,119,176,.1)' },
  style:    { hex: '#B88BF5', r: 184, g: 139, b: 245, background: 'rgba(184,139,245,.12)' },
  cnstr:    { hex: '#FB923C', r: 251, g: 146, b: 60,  background: 'rgba(251,146,60,.1)'  },
  audience: { hex: '#7ED95A', r: 126, g: 217, b: 90,  background: 'rgba(126,217,90,.1)'  },
};

export const SECTION_DEFINITIONS = {
  role: {
    id: 'role',
    shortLabel: 'Role',
    fullTitle: 'Role / Persona',
    placeholder: 'Who should the AI be?\n\ne.g. "Act as a senior software engineer with 10 years of experience in distributed systems. You are pragmatic, value simplicity, and think carefully about edge cases."',
    tip: {
      whatItIs:      'Sets the identity the model should inhabit — job title, expertise level, personality.',
      whyItMatters:  'A concrete role primes relevant knowledge and sets the register of the response. Vague prompts get generic answers; a vivid persona gets expert-level thinking.',
      example:       'Act as a principal software engineer at a fintech startup with 12 years in distributed systems. You are direct, deeply technical, and value simple solutions over clever ones.'
    }
  },
  ctx: {
    id: 'ctx',
    shortLabel: 'Context',
    fullTitle: 'Context / Background',
    placeholder: 'What does the AI need to know?\n\nProvide situational background, relevant constraints, prior decisions, data, or anything that informs the task.',
    tip: {
      whatItIs:      'The situational briefing — everything the model needs to understand before it can act intelligently.',
      whyItMatters:  'Models have no memory between sessions. Context bridges that gap. More relevant context = more accurate, specific output.',
      example:       'We are a 12-person B2B startup. Our customers are non-technical business owners. We are 3 weeks from our Series A. Our main competitor just launched a mobile app.'
    }
  },
  task: {
    id: 'task',
    shortLabel: 'Task',
    fullTitle: 'Task / Objective',
    placeholder: 'What exactly do you want done?\n\nState one clear objective. If you have multiple tasks, break them into separate prompts.',
    tip: {
      whatItIs:      'The primary directive — the single, clearly stated thing you want the model to produce.',
      whyItMatters:  'Ambiguous tasks generate ambiguous outputs. A sharp task sentence acts as the north star everything else orbits.',
      example:       'Write a 90-second investor pitch script for our Series A deck — communicates market size, our unique insight, and why now — in plain, confident language.'
    }
  },
  instr: {
    id: 'instr',
    shortLabel: 'Instructions',
    fullTitle: 'Instructions / Steps',
    placeholder: 'How should the task be completed?\n\nList specific steps, rules, or requirements:\n- Step or rule 1\n- Step or rule 2',
    tip: {
      whatItIs:      'Explicit operating rules — the step-by-step breakdown or constraints on how the task must be done.',
      whyItMatters:  'Instructions turn a fuzzy directive into a precise execution plan. Especially powerful for multi-step tasks or when you\'ve been burned by the same mistake before.',
      example:       '1. Open with a one-sentence hook naming the problem.\n2. State market size using a bottom-up number.\n3. Describe our solution in one plain sentence (no jargon).\n4. Name one customer and their quantified result.\n5. Close with our ask. Do not use bullet points.'
    }
  },
  ex: {
    id: 'ex',
    shortLabel: 'Examples',
    fullTitle: 'Examples (Few-Shot)',
    placeholder: "Show, don't just tell. Provide 1–3 input/output pairs:\n\nInput: ...\nOutput: ...",
    tip: {
      whatItIs:      'Concrete input/output pairs — few-shot prompting. Often the single most powerful technique.',
      whyItMatters:  'One good example is worth a paragraph of instructions. It bypasses ambiguity and shows exactly what "good" looks like.',
      example:       'Input: "Feature: auto-categorisation of expenses"\nOutput: "Stop sorting receipts. Claude learns your patterns and files everything."\n\nInput: "Feature: multi-currency support"\nOutput: "Do business in any currency. Reconcile in yours."'
    }
  },
  fmt: {
    id: 'fmt',
    shortLabel: 'Format',
    fullTitle: 'Output Format',
    placeholder: 'How should the response be structured?\n\nSpecify format, length, sections, or data shape (JSON, markdown, prose, bullet list).',
    tip: {
      whatItIs:      'The structural shape of the expected response — length, organisation, and any special syntax.',
      whyItMatters:  'Without format guidance the model picks a default. Explicit format instructions prevent surprises, especially for downstream use.',
      example:       'Return a JSON array. Each object: { "headline": string (max 8 words), "subheadline": string (max 15 words), "cta": string (max 4 words) }. No markdown, no commentary.'
    }
  },
  tone: {
    id: 'tone',
    shortLabel: 'Tone',
    fullTitle: 'Tone / Voice',
    placeholder: "What should it sound like?\n\nDescribe the register, personality, and style — or name a reference voice.",
    tip: {
      whatItIs:      'The emotional register and personality of the output.',
      whyItMatters:  'The same content in different tones reads as completely different work. Explicit tone instructions prevent mismatch.',
      example:       "Confident without being arrogant. Concise without being cold. Like a smart investor who's heard a thousand pitches and respects people's time. No buzzwords. Active voice."
    }
  },
  style: {
    id: 'style',
    shortLabel: 'Style',
    fullTitle: 'Style / Genre',
    placeholder: 'What style should the writing take?\n\ne.g. Journalistic, academic, conversational, persuasive, narrative...',
    tip: {
      whatItIs:      'The writing genre and structural approach — how the content is organised and delivered.',
      whyItMatters:  'Style (genre/structure) and tone (emotion/register) are distinct. A piece can be journalistic in style but warm in tone. CO-STAR separates them deliberately.',
      example:       'Journalistic. Lead with the most important fact. Inverted pyramid structure. Short paragraphs, one idea per sentence. No fluff.'
    }
  },
  cnstr: {
    id: 'cnstr',
    shortLabel: 'Constraints',
    fullTitle: 'Constraints / Avoid',
    placeholder: 'What should NOT be in the output?\n\nList explicit exclusions, banned phrases, or hard limits:\n- Do not...\n- Avoid...',
    tip: {
      whatItIs:      'Explicit guardrails — what the model must not do, include, say, or assume.',
      whyItMatters:  'Negative constraints are as powerful as positive instructions. If you\'ve received a specific failure before, a constraint directly prevents it.',
      example:       '- Do not mention competitors by name\n- No buzzwords: "innovative", "seamless", "leverage", "robust"\n- Do not exceed 90 seconds (~220 words)\n- No passive voice\n- Do not open with a question'
    }
  },
  audience: {
    id: 'audience',
    shortLabel: 'Audience',
    fullTitle: 'Target Audience',
    placeholder: 'Who is the output for?\n\nDescribe the reader: their role, knowledge level, context, and what they care about.',
    tip: {
      whatItIs:      'Defines who the output is written for — their expertise level, role, and what they need.',
      whyItMatters:  'CO-STAR adds Audience as a first-class field because writing "for" someone specific dramatically improves relevance and tone calibration.',
      example:       'B2B decision-makers at mid-market companies (50–500 employees). Time-poor, sceptical of vendor claims, need to justify purchases to their CFO. Not technical.'
    }
  },
};
