<script>
  import { appStore, currentSections, showToast } from '../store.js';
  import { FRAMEWORKS } from '../data/frameworks.js';
  import { TECHNIQUES } from '../data/techniques.js';

  const DECISION_TABLE_ROWS = [
    ['Quick, well-defined task',          'RTF or TAG',          'Lean structure; model fills sensible defaults'],
    ['Complex, multi-step task',          'RISEN or Custom',     'Need full instructions + explicit end goal'],
    ['Writing for a specific audience',   'CO-STAR',             'Audience field forces you to define the reader'],
    ['Exploratory / iterative task',      'CRISPE',              'Experiment field prompts self-evaluation'],
    ['Purpose-first / intent-driven',     'APE',                 'Forces you to articulate why before what'],
    ['Reasoning or math',                 'CoT + Custom',        'Add "think step by step" to Instructions'],
    ['You have good examples',            'Few-Shot (Custom)',    'Fill Examples section — often beats instructions alone'],
    ['Model keeps making same mistake',   'Constraints + CoT',   'Explicit Constraints + reasoning instruction'],
    ['High-stakes factual answer',        'Self-Consistency',    'Run 3×; take majority answer'],
    ['Multi-tool or agentic workflow',    'ReAct',               'Thought/Action/Observation loop in Instructions'],
    ['Complex task, breakable',           'Prompt Chaining',     'Split into sequential prompts; outputs chain'],
    ['Requires current/proprietary data', 'RAG',                 'Paste retrieved docs into Context section'],
    ['Math/data manipulation',            'PAL',                 'Ask for Python code solution in Instructions'],
    ['Need multiple options evaluated',   'Tree of Thoughts',    'Three-expert prompt in Instructions'],
    ['Uncertainty/hallucination risk',    'Generated Knowledge', 'Two-step: generate facts, then answer'],
    ['Long-context agentic systems',      'Context Engineering', 'Design what goes in context window and in what order'],
  ];

  const CATEGORY_FILTER_OPTIONS = [
    { value: 'all',     label: 'All' },
    { value: 'reason',  label: 'Reasoning' },
    { value: 'retrieve',label: 'Retrieval' },
    { value: 'agentic', label: 'Agentic' },
    { value: 'context', label: 'Context' },
  ];

  const TECHNIQUE_CATEGORY_CSS_CLASS = {
    reason:   'category-reason',
    retrieve: 'category-retrieve',
    agentic:  'category-agentic',
    context:  'category-context',
  };

  function copyTechniqueSnippet(snippetText, techniqueName) {
    navigator.clipboard.writeText(snippetText).then(() => showToast(`${techniqueName} copied!`));
  }

  function injectTechniqueIntoPrompt(targetBaseSection, snippetText, techniqueName) {
    const sections = $currentSections;
    const targetSection = sections.find(s => s.baseId === targetBaseSection) ?? sections[sections.length - 1];
    if (!targetSection) { showToast('Switch to Write tab first', true); return; }

    const existingValue = $appStore.sectionValues[targetSection.id] ?? '';
    const newValue = existingValue.trim()
      ? `${existingValue}\n\n[${techniqueName}]\n${snippetText}`
      : `[${techniqueName}]\n${snippetText}`;

    appStore.setSectionValue(targetSection.id, newValue);
    appStore.setMode('write');
    showToast(`${techniqueName} injected into ${targetSection.fullTitle}`);

    setTimeout(() => {
      const textarea = document.getElementById(`textarea-${targetSection.index}`);
      textarea?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      textarea?.focus();
    }, 150);
  }
</script>

<!-- Framework chooser -->
<div class="guide-section-title">Choose a Framework</div>
<div class="guide-section-description">
  Click any card to switch. All written content is preserved when you switch.
  Not sure which one? <strong style="color:var(--color-accent)">RTF</strong> is the leanest place to start —
  three fields, done in a minute.
</div>

<div class="framework-grid">
  {#each Object.entries(FRAMEWORKS) as [frameworkKey, framework]}
    <button
      class="framework-card"
      class:is-active={$appStore.activeFramework === frameworkKey}
      on:click={() => { appStore.setActiveFramework(frameworkKey); appStore.setMode('write'); }}
    >
      {#if frameworkKey === 'rtf'}
        <span class="framework-card-badge">Recommended</span>
      {/if}
      <div class="framework-card-icon">{framework.icon}</div>
      <div class="framework-card-name">{framework.name}</div>
      <div class="framework-card-count">{framework.sections.length} sections</div>
      <div class="framework-card-when">{framework.bestUsedWhen}</div>
      <div class="framework-acronym-list">
        {#each framework.acronymBreakdown as letterItem}
          <span
            class="framework-acronym-letter"
            style="color:{letterItem.color};border-color:{letterItem.color}33;background:{letterItem.color}11"
          >{letterItem.letter}</span>
        {/each}
      </div>
    </button>
  {/each}
</div>

<!-- Decision table -->
<div class="guide-section-title">When to Use What</div>
<div class="guide-section-description">Match your situation to the right approach. Frameworks and techniques stack.</div>

<div class="decision-table-wrap">
  <table class="decision-table">
    <thead>
      <tr>
        <th>Situation</th>
        <th>Best Approach</th>
        <th>Why</th>
      </tr>
    </thead>
    <tbody>
      {#each DECISION_TABLE_ROWS as [situation, approach, reason]}
        <tr>
          <td>{situation}</td>
          <td><span class="decision-table-approach">{approach}</span></td>
          <td class="decision-table-reason">{reason}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Techniques -->
<div class="guide-section-title">Advanced Techniques</div>
<div class="guide-section-description">These change how the model reasons — not just what information you give it.</div>

<div class="technique-filter-row">
  {#each CATEGORY_FILTER_OPTIONS as filterOption}
    <button
      class="technique-filter-chip"
      class:is-active={$appStore.techniqueFilter === filterOption.value}
      on:click={() => appStore.setTechniqueFilter(filterOption.value)}
    >{filterOption.label}</button>
  {/each}
</div>

<div class="technique-grid">
  {#each TECHNIQUES as technique}
    {#if $appStore.techniqueFilter === 'all' || technique.category === $appStore.techniqueFilter}
      <div class="technique-card">
        <div class="technique-card-top">
          <div style="flex:1">
            <div class="technique-name">{technique.name}</div>
          </div>
          <span class="technique-category-badge {TECHNIQUE_CATEGORY_CSS_CLASS[technique.category] ?? 'category-reason'}">
            {technique.categoryLabel}
          </span>
        </div>

        <div class="technique-description">{technique.description}</div>

        <div class="technique-use-cases">
          <div class="technique-use-cases-label">Use when:</div>
          {#each technique.useCases as useCase}
            <span class="technique-use-case-tag">{useCase}</span>
          {/each}
        </div>

        <div class="technique-snippet">{technique.snippet}</div>

        <div class="technique-actions">
          <button
            class="technique-action-button"
            on:click={() => copyTechniqueSnippet(technique.snippet, technique.name)}
          >Copy snippet</button>
          <button
            class="technique-action-button is-inject"
            on:click={() => injectTechniqueIntoPrompt(technique.injectToSection, technique.snippet, technique.name)}
          >→ Inject into prompt</button>
        </div>
      </div>
    {/if}
  {/each}
</div>
