const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');
const JS_EXT = '.js';
const JSX_EXT = '.jsx';

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(res));
    else files.push(res);
  }
  return files;
}

function hasJSX(content) {
  return /<\s*(?:[A-Z]|>)/.test(content);
}

function updateImportsInFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  const orig = src;
  src = src.replace(/(["'])(\.\/|\.\.\/|\/[^"']*?)((?:[^"']+?)?)\.js\1/g, (m, q, p1, name) => {
    return `${q}${p1}${name}.jsx${q}`;
  });
  if (src !== orig) fs.writeFileSync(filePath, src, 'utf8');
}

function main() {
  console.log('Scanning', root);
  const files = walk(root).filter(f => f.endsWith(JS_EXT));
  const toRename = [];

  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    if (hasJSX(content)) {
      toRename.push(f);
    }
  }

  if (toRename.length === 0) {
    console.log('No .js files with JSX found.');
    return;
  }

  console.log('Files to rename:', toRename.length);
  toRename.forEach(f => console.log(' -', path.relative(root, f)));

  for (const oldPath of toRename) {
    const newPath = oldPath.slice(0, -JS_EXT.length) + JSX_EXT;
    fs.renameSync(oldPath, newPath);
  }

  const allFiles = walk(root).filter(f => !f.endsWith('.map'));
  for (const file of allFiles) {
    updateImportsInFile(file);
  }

  const indexHtml = path.resolve(__dirname, '..', 'index.html');
  if (fs.existsSync(indexHtml)) {
    let html = fs.readFileSync(indexHtml, 'utf8');
    const newHtml = html.replace(/src="\/src\/(.*?)\.js"/g, 'src="/src/$1.jsx"');
    if (newHtml !== html) fs.writeFileSync(indexHtml, newHtml, 'utf8');
  }

  console.log('Done. Remember to run a full npm install and start dev server.');
}

main();
