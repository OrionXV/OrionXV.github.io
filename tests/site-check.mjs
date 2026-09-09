import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const output = join(root, '_site');
const baseline = '3f982c18fb6d11ba67fb9021ca7a9e7c98b8e052';
const read = p => readFileSync(join(root, p), 'utf8');
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);

assert.ok(existsSync(join(output, 'index.html')), 'Build Jekyll before running checks.');
const tracked = new Set(execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0'));
for (const file of walk(join(root, '_sass'))) {
  assert.ok(tracked.has(relative(root, file)), `Theme dependency is not tracked: ${file}`);
}

// Compare using the same line-ending normalization as the original Git paths.
const oldFiles = execFileSync('git', ['ls-tree', '-r', baseline], { cwd: root, encoding: 'utf8' })
  .trim().split('\n').map(line => {
    const [meta, path] = line.split('\t');
    return { path, hash: meta.split(' ')[2] };
  }).filter(f => f.path.startsWith('assets/') || ['index.html', 'image-credits.html'].includes(f.path));
for (const file of oldFiles) {
  assert.ok(tracked.has('legacy/' + file.path), `Legacy file is not tracked: ${file.path}`);
  const hash = execFileSync('git', ['hash-object', '--path=' + file.path, 'legacy/' + file.path], { cwd: root, encoding: 'utf8' }).trim();
  assert.equal(hash, file.hash, `Legacy file changed: ${file.path}`);
}

const old = read('legacy/index.html');
const cards = [...old.matchAll(/^ {12}<(article|a)\b[^\n]*\bproject-card\b[\s\S]*?^ {12}<\/\1>/gm)];
const projects = readdirSync(join(root, '_portfolio')).filter(f => f.endsWith('.md')).map(file => {
  const source = read('_portfolio/' + file);
  const fields = Object.fromEntries(source.split('---')[1].trim().split('\n').map(line => {
    const split = line.indexOf(':');
    return [line.slice(0, split), JSON.parse(line.slice(split + 1))];
  }));
  return { ...fields, slug: file.replace(/\.md$/, '') };
}).sort((a, b) => a.order - b.order);
assert.equal(projects.length, 22);
assert.equal(cards.length, projects.length);
for (const [i, p] of projects.entries()) {
  const card = cards[i][0];
  assert.equal(p.order, i + 1);
  assert.equal(p.title, decode(card.match(/<h6[^>]*>(.*?)<\/h6>/)[1]));
  if (p.slug === 'website') assert.match(p.summary, /Academic Pages.*preserved at \/legacy/);
  else assert.equal(p.summary, decode(card.match(/<p class="project-summary">(.*?)<\/p>/)[1]));
  assert.equal(p.project_url, decode(card.match(/href="([^"]+)"/)[1]));
  const oldImage = card.match(/<img src="([^"]+)"/)[1];
  assert.deepEqual(readFileSync(join(root, p.image)), readFileSync(join(root, 'legacy', oldImage)));
  assert.ok(existsSync(join(output, 'projects', p.slug, 'index.html')));
}

const projectList = read('_site/projects/index.html');
assert.equal((projectList.match(/class="project-row"/g) || []).length, 22);
let lastPosition = -1;
for (const p of projects) {
  const position = projectList.indexOf(`href="/projects/${p.slug}/"`, lastPosition + 1);
  assert.ok(position > lastPosition, `Project out of order: ${p.title}`);
  lastPosition = position;
}

let checkedLinks = 0;
const htmlFiles = walk(output).filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const path = '/' + relative(output, file);
  const base = new URL(path, 'https://orionxv.github.io');
  if (!path.startsWith('/legacy/') && !path.endsWith('/image-credits.html')) {
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `Expected one h1: ${path}`);
    assert.ok(!/SGPO|Gridworld|Your Name|John Doe|Lorem ipsum/.test(html), `Unexpected content: ${path}`);
    assert.ok(!/\{\{|\{%/.test(html), `Unrendered Liquid: ${path}`);
    assert.ok(html.includes('Skip to content'), `Missing skip link: ${path}`);
    assert.ok(!/img[^>]+(?:profile\.jpeg|img-01\.jpeg)/.test(html), `Unwanted personal photo: ${path}`);
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      assert.ok(/\balt="[^"]*"/.test(image[0]), `Missing image alt: ${path}`);
    }
  }
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = decode(match[1]);
    if (/^(?:mailto:|tel:|javascript:|data:)/.test(value)) continue;
    const url = new URL(value, base);
    if (url.origin !== base.origin) continue;
    let target = join(output, decodeURIComponent(url.pathname));
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    assert.ok(existsSync(target), `Missing local target ${value} on ${path}`);
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      const targetHtml = readFileSync(target, 'utf8');
      assert.ok(targetHtml.includes(`id="${id}"`) || targetHtml.includes(`name="${id}"`), `Missing fragment ${value} on ${path}`);
    }
    checkedLinks++;
  }
}
const research = read('_site/research/index.html');
assert.match(research, /CRL and causal effects of interventions/);
assert.match(research, /Knowledge gradients, Bayesian optimization, guided diffusion models, and reinforcement learning/);
const experience = read('_site/experience/index.html');
assert.match(experience, /Research Assistant · Espoo/);
assert.match(experience, /generative UI and Bayesian optimization to model user preferences/);
assert.match(experience, /Research Engineer Intern · Virtual Cell Harness/);
assert.ok(!/pipeline’s KPI|limited evaluations|sample.limited/.test(research + experience));
const articles = read('_site/articles/index.html');
assert.match(articles, /href="\/articles\/" aria-current="page"/);
assert.match(articles, /<h1[^>]*>\s*Articles\s*<\/h1>/);
assert.ok(!existsSync(join(output, 'articles/template')), 'The starter article must not be published.');
assert.ok(!read('_site/sitemap.xml').includes('/articles/template/'), 'The starter article must not be indexed.');
const copyright = read('_site/copyright/index.html');
assert.match(copyright, /Original writing/);
assert.match(copyright, /all rights reserved/i);
assert.match(copyright, /MIT licence/);
assert.match(articles, /href="\/copyright\/"/);
assert.ok(!existsSync(join(output, 'tests')), 'Tests should not be published.');
assert.ok(!existsSync(join(output, 'Gemfile')), 'Build configuration should not be published.');
assert.ok(!existsSync(join(output, 'images/profile.jpeg')), 'Personal photo should not be published with the new site.');

console.log(`PASS: ${oldFiles.length} legacy files unchanged; 22 projects preserved in order; ${htmlFiles.length} HTML pages; ${checkedLinks} internal links/assets verified.`);
