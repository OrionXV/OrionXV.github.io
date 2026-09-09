import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';

const root = resolve(import.meta.dirname, '..');
const startup = readFileSync(resolve(root, '_includes/theme-init.html'), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const runtime = readFileSync(resolve(root, 'assets/js/portfolio.js'), 'utf8');

function browser(stored = null, blocked = false, initialization = startup) {
  const documentRoot = { dataset: {} };
  const attributes = new Map();
  const clicks = new Map();
  const events = new Map();
  const storage = new Map(stored === null ? [] : [['arsalaan-theme', stored]]);
  const button = { hidden: true, setAttribute: (name, value) => attributes.set(name, value), addEventListener: (name, callback) => clicks.set(name, callback) };
  const colour = { content: '#241a3b' };
  const context = {
    document: {
      documentElement: documentRoot,
      querySelector: selector => ({ '.theme-toggle': button, 'meta[name="theme-color"]': colour })[selector] || null,
    },
    window: { addEventListener: (name, callback) => events.set(name, callback) },
    localStorage: {
      getItem: key => { if (blocked) throw new Error('Storage denied'); return storage.get(key) ?? null; },
      setItem: (key, value) => { if (blocked) throw new Error('Storage denied'); storage.set(key, value); },
    },
  };
  runInNewContext(initialization, context);
  const beforeRuntime = documentRoot.dataset.appearance;
  runInNewContext(runtime, context);
  return { documentRoot, attributes, clicks, events, storage, button, colour, beforeRuntime };
}

const first = browser();
assert.equal(first.beforeRuntime, 'sunset');
assert.equal(first.attributes.get('aria-checked'), 'false');
assert.equal(first.button.hidden, false);
first.clicks.get('click')();
assert.equal(first.documentRoot.dataset.appearance, 'disco');
assert.equal(first.attributes.get('aria-checked'), 'true');
assert.equal(first.button.title, 'Switch to Sunset theme');
assert.equal(first.colour.content, '#1c2423');
assert.equal(first.storage.get('arsalaan-theme'), 'disco');

const nextPage = browser(first.storage.get('arsalaan-theme'));
assert.equal(nextPage.beforeRuntime, 'disco', 'The theme must be restored before the body renders');
assert.equal(nextPage.attributes.get('aria-checked'), 'true');
nextPage.clicks.get('click')();
assert.equal(nextPage.documentRoot.dataset.appearance, 'sunset');
assert.equal(nextPage.storage.get('arsalaan-theme'), 'sunset');
assert.equal(nextPage.colour.content, '#241a3b');

const privateWindow = browser(null, true);
privateWindow.clicks.get('click')();
assert.equal(privateWindow.documentRoot.dataset.appearance, 'disco', 'Storage failures must not break the switch');
privateWindow.clicks.get('click')();
assert.equal(privateWindow.documentRoot.dataset.appearance, 'sunset');
assert.equal(browser('unknown-theme').beforeRuntime, 'sunset');

// The production HTML compressor removes line breaks inside inline scripts.
const compressedPage = browser('disco', false, startup.replace(/\s+/g, ' '));
assert.equal(compressedPage.beforeRuntime, 'disco', 'Compressed HTML must still restore the saved theme');
assert.equal(compressedPage.attributes.get('aria-checked'), 'true');

if (process.argv.includes('--built')) {
  for (const path of ['index.html', 'research/index.html', 'projects/index.html', 'articles/index.html', 'experience/index.html', 'cv/index.html']) {
    const html = readFileSync(resolve(root, '_site', path), 'utf8');
    const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
      .map(match => match[1]).find(content => content.includes('arsalaan-theme'));
    assert.ok(script, `Missing saved-theme initialization: ${path}`);
    for (const theme of ['disco', 'sunset']) {
      const page = browser(theme, false, script);
      assert.equal(page.beforeRuntime, theme, `Built ${path} failed to restore ${theme}`);
      assert.equal(page.attributes.get('aria-checked'), String(theme === 'disco'));
    }
  }
}

nextPage.events.get('storage')({ key: 'arsalaan-theme', newValue: 'disco' });
assert.equal(nextPage.documentRoot.dataset.appearance, 'disco');
nextPage.events.get('storage')({ key: 'unrelated-key', newValue: 'sunset' });
assert.equal(nextPage.documentRoot.dataset.appearance, 'disco');
nextPage.events.get('storage')({ key: null, newValue: null });
assert.equal(nextPage.documentRoot.dataset.appearance, 'sunset');
nextPage.storage.set('arsalaan-theme', 'disco');
nextPage.events.get('pageshow')({ persisted: true });
assert.equal(nextPage.documentRoot.dataset.appearance, 'disco', 'Back-forward cached pages must restore the latest choice');
privateWindow.events.get('pageshow')({ persisted: true });
assert.equal(privateWindow.documentRoot.dataset.appearance, 'sunset');

console.log('PASS: Theme switching, saved preference, compressed initialization, blocked storage, invalid values, cross-tab updates, and cached navigation.');
