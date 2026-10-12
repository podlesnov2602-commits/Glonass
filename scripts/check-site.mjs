import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = process.cwd();
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ['node_modules', 'test-results', 'playwright-report'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full)); else files.push(full);
  }
  return files;
}
const htmlFiles = (await walk(root)).filter(file => file.endsWith('.html'));
const documents = new Map();
for (const file of htmlFiles) documents.set(file, await readFile(file, 'utf8'));
for (const [file, html] of documents) {
  assert.match(html, /<html lang="ru">/, file + ': language');
  assert.match(html, /name="viewport"/, file + ': viewport');
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, file + ': one main heading');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, file + ': duplicate ids');
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(value)) continue;
    const [relative, fragment] = value.split('#');
    const target = relative ? path.resolve(path.dirname(file), relative) : file;
    assert.ok(target.startsWith(root + path.sep), 'Path escapes site: ' + value);
    assert.ok((await stat(target)).isFile(), file + ': missing ' + value);
    if (fragment && documents.has(target)) {
      assert.ok(documents.get(target).includes('id="' + fragment + '"'), file + ': missing anchor ' + value);
    }
  }
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(match[0], /rel="noopener noreferrer"/, 'External link must be protected');
  }
}
const home = documents.get(path.join(root, 'index.html'));
const schema = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
assert.equal(JSON.parse(schema).telephone, '+77753715077');
assert.ok(!home.includes('−27.4%'), 'Old unverified statistic removed');
const css = await readFile(path.join(root, 'assets/styles.css'), 'utf8');
assert.ok(css.includes('prefers-reduced-motion'));
assert.ok(css.includes(':focus-visible'));
console.log('Checked ' + documents.size + ' HTML pages, local assets, fragment links, metadata and accessibility hooks.');
