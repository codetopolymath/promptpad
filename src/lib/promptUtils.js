// Assemble all active (enabled + filled) sections into a single markdown string.
export function assemblePromptText(activeSectionsList, sectionValues) {
  return activeSectionsList
    .map(section => `## ${section.fullTitle}\n\n${sectionValues[section.id] ?? ''}`)
    .join('\n\n---\n\n');
}

// Trigger a markdown file download of the assembled prompt.
export function exportPromptAsMarkdown(frameworkName, activeSectionsList, sectionValues) {
  const body        = assemblePromptText(activeSectionsList, sectionValues);
  const fullContent = `# PromptPad Export — ${frameworkName}\n\n${body}`;
  const blob        = new Blob([fullContent], { type: 'text/markdown' });
  const objectURL   = URL.createObjectURL(blob);
  const anchor      = document.createElement('a');
  anchor.href       = objectURL;
  anchor.download   = 'prompt.md';
  anchor.click();
  URL.revokeObjectURL(objectURL);
}

// Encode the current state into a URL-safe base64 string for sharing.
export function buildShareURL(state) {
  const shareableState = {
    activeFramework: state.activeFramework,
    sectionValues:   state.sectionValues,
    enabledSections: state.enabledSections,
  };
  const encoded = btoa(encodeURIComponent(JSON.stringify(shareableState)));
  return `${location.origin}${location.pathname}#state=${encoded}`;
}

// Decode a shared state from a URL hash. Returns null if the hash is absent or invalid.
export function parseShareURLHash(hash) {
  if (!hash.startsWith('#state=')) return null;
  try {
    return JSON.parse(decodeURIComponent(atob(hash.slice(7))));
  } catch {
    return null;
  }
}

// Parse a .md export back into section values (used by the Load feature).
export function parseMarkdownExport(markdownText, sectionDefinitions) {
  const sectionValues = {};
  const parts = markdownText.split(/^##\s+/m).slice(1);
  parts.forEach(part => {
    const newlineIndex = part.indexOf('\n');
    const heading      = part.slice(0, newlineIndex).trim();
    const body         = part.slice(newlineIndex + 1).trim();
    Object.values(sectionDefinitions).forEach(definition => {
      if (
        definition.fullTitle.toLowerCase()  === heading.toLowerCase() ||
        definition.shortLabel.toLowerCase() === heading.toLowerCase()
      ) {
        sectionValues[definition.id] = body;
      }
    });
  });
  return sectionValues;
}
