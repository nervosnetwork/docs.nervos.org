#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REPORTS_DIR = 'reports/link-check';
const DEAD_LINKS_FILE = path.join(REPORTS_DIR, 'dead-links.json');
const KNOWN_FAILURES_FILE = path.join(REPORTS_DIR, 'known-failures.json');
const NEW_FAILURES_FILE = path.join(REPORTS_DIR, 'new-failures.json');
const RECOVERED_FILE = path.join(REPORTS_DIR, 'recovered.json');
const UNRESOLVED_KNOWN_FILE = path.join(REPORTS_DIR, 'unresolved-known.json');
const REPORT_MD_FILE = path.join(REPORTS_DIR, 'report.md');

// Read current dead links
let deadLinks = [];
if (fs.existsSync(DEAD_LINKS_FILE)) {
  try {
    deadLinks = JSON.parse(fs.readFileSync(DEAD_LINKS_FILE, 'utf-8'));
  } catch (error) {
    console.error('Error reading dead links:', error.message);
    process.exit(1);
  }
}

// Read known failures baseline
let knownFailures = [];
if (fs.existsSync(KNOWN_FAILURES_FILE)) {
  try {
    knownFailures = JSON.parse(fs.readFileSync(KNOWN_FAILURES_FILE, 'utf-8'));
  } catch (error) {
    console.error('Error reading known failures:', error.message);
    process.exit(1);
  }
}

// Create lookup sets
const knownUrls = new Set(knownFailures.map(kf => kf.url));
const currentFailingUrls = new Set(deadLinks.map(link => link.url));

// Calculate categories
const newFailures = deadLinks.filter(link => !knownUrls.has(link.url));
const recovered = knownFailures.filter(kf => !currentFailingUrls.has(kf.url));
const unresolvedKnown = knownFailures.filter(kf => currentFailingUrls.has(kf.url));

// Write categorized results
fs.writeFileSync(NEW_FAILURES_FILE, JSON.stringify(newFailures, null, 2));
fs.writeFileSync(RECOVERED_FILE, JSON.stringify(recovered, null, 2));
fs.writeFileSync(UNRESOLVED_KNOWN_FILE, JSON.stringify(unresolvedKnown, null, 2));

// Generate markdown report
const reportContent = `# Link Check Report

Generated at: ${new Date().toISOString()}

## Summary
- **New Failures**: ${newFailures.length}
- **Recovered**: ${recovered.length}
- **Unresolved Known Issues**: ${unresolvedKnown.length}
- **Total Current Failures**: ${deadLinks.length}

## New Failures
${newFailures.length === 0 ? 'None! 🎉' : newFailures.map(link => `- ${link.url} (${link.status})`).join('\n')}

## Recovered Links
${recovered.length === 0 ? 'None' : recovered.map(link => `- ${link.url}`).join('\n')}

## Unresolved Known Issues
${unresolvedKnown.length === 0 ? 'None' : unresolvedKnown.map(link => `- ${link.url} (${link.reason || 'No reason specified'})`).join('\n')}

## Actions Required
${newFailures.length > 0 ? `⚠️ **${newFailures.length} new dead links found!** Please review and either fix the links or add them to known-failures.json with appropriate reasons.` : '✅ No new failures detected.'}

${recovered.length > 0 ? `ℹ️ **${recovered.length} links have recovered.** Consider removing them from known-failures.json.` : ''}
`;

fs.writeFileSync(REPORT_MD_FILE, reportContent);

console.log('📋 Comparison complete. Results:');
console.log(`   - New failures: ${newFailures.length}`);
console.log(`   - Recovered: ${recovered.length}`);
console.log(`   - Unresolved known: ${unresolvedKnown.length}`);
console.log(`   - Report saved to: ${REPORT_MD_FILE}`);

// Exit with error if there are new failures (configurable behavior)
if (newFailures.length > 0) {
  console.log('❌ New dead links detected. Review the report above.');
  process.exit(1);
} else {
  console.log('✅ No new dead links found.');
}